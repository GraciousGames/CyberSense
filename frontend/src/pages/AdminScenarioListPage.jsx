// React-Hooks für lokale Zustände und Lifecycle-Verhalten.
import {
    useEffect,
    useState
} from "react";

// Link wird für Navigation ohne vollständiges Neuladen verwendet.
import { Link } from "react-router-dom";

// Service-Funktionen für Laden und Löschen der Szenarien.
import {
    deleteScenario,
    getScenarios
} from "../services/scenarioService.js";


function AdminScenarioListPage() {
    // Enthält alle geladenen Szenarien.
    const [scenarios, setScenarios] = useState([]);

    // Zeigt an, ob gerade Daten vom Backend geladen werden.
    const [isLoading, setIsLoading] = useState(true);

    // Enthält eine mögliche Fehlermeldung.
    const [error, setError] = useState("");

    // Enthält eine mögliche Erfolgsmeldung.
    const [success, setSuccess] = useState("");


    // -------------------------------------------------------
    // Szenarien laden
    // -------------------------------------------------------

    useEffect(() => {
        async function loadScenarios() {
            try {
                // Vor dem Laden alte Fehlermeldungen entfernen.
                setError("");

                // Scenario-Liste aus dem Backend abrufen.
                const loadedScenarios = await getScenarios();

                // Geladene Daten in den React-State übernehmen.
                setScenarios(loadedScenarios);
            } catch (loadError) {
                // Verständliche Meldung anzeigen,
                // falls das Backend nicht erreichbar ist.
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Die Szenarien konnten nicht geladen werden."
                );
            } finally {
                // Der Ladezustand endet unabhängig von Erfolg oder Fehler.
                setIsLoading(false);
            }
        }

        loadScenarios();
    }, []);


    // -------------------------------------------------------
    // Szenario löschen
    // -------------------------------------------------------

    async function handleDelete(scenario) {
        // Benutzer muss das Löschen zuerst bestätigen.
        const confirmed = window.confirm(
            `Soll das Szenario „${scenario.subject}“ wirklich gelöscht werden?`
        );

        // Bei Abbrechen passiert nichts.
        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            // DELETE-Request an das Backend senden.
            await deleteScenario(scenario.id);

            // Das gelöschte Szenario direkt aus der Oberfläche entfernen.
            setScenarios((currentScenarios) =>
                currentScenarios.filter(
                    (currentScenario) =>
                        currentScenario.id !== scenario.id
                )
            );

            // Erfolgsmeldung anzeigen.
            setSuccess(
                `Das Szenario „${scenario.subject}“ wurde gelöscht.`
            );
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : "Das Szenario konnte nicht gelöscht werden."
            );
        }
    }


    // -------------------------------------------------------
    // Oberfläche
    // -------------------------------------------------------

    return (
        <main className="page-container">

            {/* Überschrift der Verwaltungsseite */}
            <header className="page-heading">
        <span className="page-overline">
          Administration
        </span>

                <h1 className="page-title">
                    Szenarien verwalten
                </h1>

                <p className="page-description">
                    Zeige vorhandene Trainingsszenarien an,
                    bearbeite sie oder lösche sie.
                </p>
            </header>


            {/* Navigation oberhalb der Liste */}
            <div className="admin-form-actions">
                <Link
                    className="btn btn-ghost"
                    to="/admin"
                >
                    Zurück zum Dashboard
                </Link>

                <Link
                    className="btn btn-primary"
                    to="/admin/scenarios/new"
                >
                    Neues Szenario
                </Link>
            </div>


            {/* Fehlermeldung */}
            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}


            {/* Erfolgsmeldung */}
            {success && (
                <div
                    className="alert alert-success"
                    role="alert"
                >
                    {success}
                </div>
            )}


            {/* Während des Ladens wird eine kurze Meldung angezeigt. */}
            {isLoading && (
                <p>
                    Szenarien werden geladen …
                </p>
            )}


            {/* Falls keine Szenarien vorhanden sind. */}
            {!isLoading &&
                scenarios.length === 0 &&
                !error && (
                    <section className="surface-card admin-form-card">
                        <p>
                            Es sind noch keine Szenarien vorhanden.
                        </p>
                    </section>
                )}


            {/* Liste aller vorhandenen Szenarien */}
            {!isLoading &&
                scenarios.length > 0 && (
                    <section className="admin-dashboard-grid">

                        {scenarios.map((scenario) => (
                            <article
                                className="admin-dashboard-card"
                                key={scenario.id}
                            >

                                {/* ID dient hier nur als zusätzliche Information. */}
                                <span className="page-overline">
                  Szenario #{scenario.id}
                </span>

                                <h2>
                                    {scenario.subject}
                                </h2>

                                <p>
                                    <strong>Absender:</strong>{" "}
                                    {scenario.senderName}
                                    <br />

                                    <strong>Adresse:</strong>{" "}
                                    {scenario.senderEmail}
                                    <br />

                                    <strong>Bewertung:</strong>{" "}
                                    {scenario.correctAnswer}
                                </p>


                                {/* Aktionen für dieses einzelne Szenario */}
                                <div className="admin-form-actions">

                                    {/* Öffnet das Szenario im Bearbeitungsmodus. */}
                                    <Link
                                        className="btn btn-secondary"
                                        to={`/admin/scenarios/${scenario.id}/edit`}
                                    >
                                        Bearbeiten
                                    </Link>

                                    {/* Löschen wird erst nach Bestätigung ausgeführt. */}
                                    <button
                                        className="btn btn-danger"
                                        type="button"
                                        onClick={() =>
                                            handleDelete(scenario)
                                        }
                                    >
                                        Löschen
                                    </button>

                                </div>
                            </article>
                        ))}

                    </section>
                )}

        </main>
    );
}

export default AdminScenarioListPage;