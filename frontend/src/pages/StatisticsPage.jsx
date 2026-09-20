// React-Hooks für Datenzustand, Berechnungen und Laden beim Seitenaufruf.
import {
    useEffect,
    useMemo,
    useState
} from "react";

// Lädt die eigenen Trainingsversuche.
import {
    getMyAttempts
} from "../services/attemptService.js";

// Lädt die Szenarien,
// damit Scenario-IDs in lesbare Betreffzeilen umgewandelt werden können.
import {
    getScenarios
} from "../services/scenarioService.js";

// Styling dieser Seite.
import "../styles/statistics.css";


function StatisticsPage() {
    // Alle gespeicherten Versuche des aktuellen Benutzers.
    const [attempts, setAttempts] =
        useState([]);

    // Alle verfügbaren Trainingsszenarien.
    const [scenarios, setScenarios] =
        useState([]);

    // Ladezustand der Statistikseite.
    const [isLoading, setIsLoading] =
        useState(true);

    // Fehlermeldung beim Laden der Daten.
    const [error, setError] =
        useState("");


    // -------------------------------------------------------
    // Daten laden
    // -------------------------------------------------------

    useEffect(() => {
        async function loadStatisticsData() {
            try {
                setIsLoading(true);
                setError("");

                // Beide Requests können parallel ausgeführt werden,
                // da sie voneinander unabhängig sind.
                const [
                    loadedAttempts,
                    loadedScenarios
                ] = await Promise.all([
                    getMyAttempts(),
                    getScenarios()
                ]);

                // Prüft, ob das Backend die erwarteten Arrays liefert.
                if (!Array.isArray(loadedAttempts)) {
                    throw new Error(
                        "Die Trainingsergebnisse sind ungültig."
                    );
                }

                if (!Array.isArray(loadedScenarios)) {
                    throw new Error(
                        "Die Szenarienliste ist ungültig."
                    );
                }

                // Geladene Daten im React-State speichern.
                setAttempts(loadedAttempts);
                setScenarios(loadedScenarios);

            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Die Statistik konnte nicht geladen werden."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadStatisticsData();
    }, []);


    // -------------------------------------------------------
    // Kennzahlen berechnen
    // -------------------------------------------------------

    const statistics = useMemo(() => {
        // Gesamtzahl aller gespeicherten Versuche.
        const totalAttempts =
            attempts.length;

        // Anzahl korrekt beantworteter Versuche.
        const correctAttempts =
            attempts.filter(
                (attempt) => attempt.isCorrect
            ).length;

        // Alle übrigen Versuche sind falsch beantwortet.
        const wrongAttempts =
            totalAttempts - correctAttempts;

        // Prozentualer Anteil richtiger Antworten.
        const successRate =
            totalAttempts === 0
                ? 0
                : Math.round(
                    (correctAttempts / totalAttempts) * 100
                );

        // Bestimmt, wie viele unterschiedliche Szenarien
        // mindestens einmal beantwortet wurden.
        const uniqueScenarioIds =
            new Set(
                attempts.map(
                    (attempt) => attempt.scenarioId
                )
            );

        return {
            totalAttempts,
            correctAttempts,
            wrongAttempts,
            successRate,
            uniqueScenarios:
            uniqueScenarioIds.size
        };
    }, [attempts]);


    // -------------------------------------------------------
    // Hilfsfunktion: Szenario zu Attempt finden
    // -------------------------------------------------------

    function getScenarioForAttempt(attempt) {
        return scenarios.find(
            (scenario) =>
                scenario.id === attempt.scenarioId
        );
    }


    // -------------------------------------------------------
    // Hilfsfunktion: Antwort lesbar darstellen
    // -------------------------------------------------------

    function formatAnswer(answer) {
        if (answer === "legitim") {
            return "Legitim";
        }

        if (answer === "phishing") {
            return "Phishing";
        }

        // Fallback für unerwartete Werte aus dem Backend.
        return answer;
    }


    // -------------------------------------------------------
    // Ladezustand
    // -------------------------------------------------------

    if (isLoading) {
        return (
            <main className="page-container">
                <section className="statistics-status-card">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                        aria-label="Statistik wird geladen"
                    />

                    <p>
                        Statistik wird geladen …
                    </p>
                </section>
            </main>
        );
    }


    // -------------------------------------------------------
    // Fehlerzustand
    // -------------------------------------------------------

    if (error) {
        return (
            <main className="page-container">
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    <h1 className="h4">
                        Statistik konnte nicht geladen werden
                    </h1>

                    <p className="mb-0">
                        {error}
                    </p>
                </div>
            </main>
        );
    }


    // -------------------------------------------------------
    // Hauptansicht
    // -------------------------------------------------------

    return (
        <main className="page-container">

            {/* Kopfbereich */}
            <header className="page-heading">
                <span className="page-overline">
                    Auswertung
                </span>

                <h1 className="page-title">
                    Meine Statistik
                </h1>

                <p className="page-description">
                    Hier siehst du deine bisherigen Trainingsergebnisse
                    und deine persönliche Erfolgsquote.
                </p>
            </header>


            {/* -------------------------------------------------- */}
            {/* Kennzahlen */}
            {/* -------------------------------------------------- */}

            <section className="statistics-grid">

                <article className="statistics-card">
                    <span className="statistics-label">
                        Versuche
                    </span>

                    <strong className="statistics-value">
                        {statistics.totalAttempts}
                    </strong>
                </article>


                <article className="statistics-card statistics-card-success">
                    <span className="statistics-label">
                        Richtig
                    </span>

                    <strong className="statistics-value">
                        {statistics.correctAttempts}
                    </strong>
                </article>


                <article className="statistics-card statistics-card-danger">
                    <span className="statistics-label">
                        Falsch
                    </span>

                    <strong className="statistics-value">
                        {statistics.wrongAttempts}
                    </strong>
                </article>


                <article className="statistics-card statistics-card-primary">
                    <span className="statistics-label">
                        Erfolgsquote
                    </span>

                    <strong className="statistics-value">
                        {statistics.successRate} %
                    </strong>
                </article>


                <article className="statistics-card">
                    <span className="statistics-label">
                        Bearbeitete Szenarien
                    </span>

                    <strong className="statistics-value">
                        {statistics.uniqueScenarios}
                    </strong>
                </article>

            </section>


            {/* -------------------------------------------------- */}
            {/* Noch keine Versuche */}
            {/* -------------------------------------------------- */}

            {attempts.length === 0 && (
                <section className="surface-card statistics-empty-card">
                    <h2>
                        Noch keine Trainingsergebnisse
                    </h2>

                    <p>
                        Sobald du ein Training absolvierst,
                        erscheinen deine Ergebnisse hier.
                    </p>
                </section>
            )}


            {/* -------------------------------------------------- */}
            {/* Letzte Versuche */}
            {/* -------------------------------------------------- */}

            {attempts.length > 0 && (
                <section className="statistics-history">

                    <div className="statistics-section-heading">
                        <span className="page-overline">
                            Verlauf
                        </span>

                        <h2>
                            Letzte Antworten
                        </h2>
                    </div>


                    <div className="statistics-history-list">

                        {attempts
                            .slice(0, 10)
                            .map((attempt) => {
                                const scenario =
                                    getScenarioForAttempt(attempt);

                                return (
                                    <article
                                        className="statistics-history-card"
                                        key={attempt.id}
                                    >

                                        <div className="statistics-history-main">

                                            <span className="statistics-history-subject">
                                                {scenario?.subject ??
                                                    `Szenario #${attempt.scenarioId}`}
                                            </span>

                                            <span className="statistics-history-meta">
                                                Deine Antwort:{" "}
                                                <strong>
                                                    {formatAnswer(
                                                        attempt.selectedAnswer
                                                    )}
                                                </strong>
                                            </span>

                                            <span className="statistics-history-meta">
                                                {attempt.createdAt}
                                            </span>

                                        </div>


                                        <div
                                            className={
                                                attempt.isCorrect
                                                    ? "statistics-result statistics-result-correct"
                                                    : "statistics-result statistics-result-wrong"
                                            }
                                        >
                                            {attempt.isCorrect
                                                ? "✓ Richtig"
                                                : "× Falsch"}
                                        </div>

                                    </article>
                                );
                            })}

                    </div>
                </section>
            )}

        </main>
    );
}


export default StatisticsPage;