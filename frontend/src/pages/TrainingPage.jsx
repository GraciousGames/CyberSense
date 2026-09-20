import {
  useEffect,
  useState
} from "react";

import {
  getScenarios
} from "../services/scenarioService.js";

import {
  createAttempt
} from "../services/attemptService.js";

import EmailPreview
  from "../components/EmailPreview.jsx";

import CluePanel
  from "../components/CluePanel.jsx";

import "../styles/training.css";


function TrainingPage({ user }) {
  // -------------------------------------------------------
  // Szenarien und Ladezustand
  // -------------------------------------------------------

  const [scenarios, setScenarios] =
      useState([]);

  const [isLoading, setIsLoading] =
      useState(true);

  const [loadError, setLoadError] =
      useState("");


  // -------------------------------------------------------
  // Aktueller Trainingszustand
  // -------------------------------------------------------

  const [currentIndex, setCurrentIndex] =
      useState(0);

  const [selectedAnswer, setSelectedAnswer] =
      useState("");

  const [score, setScore] =
      useState(0);

  const [isFinished, setIsFinished] =
      useState(false);


  // -------------------------------------------------------
  // Speicherung eines Attempts
  // -------------------------------------------------------

  const [isSavingAttempt, setIsSavingAttempt] =
      useState(false);

  const [attemptError, setAttemptError] =
      useState("");


  // -------------------------------------------------------
  // Szenarien laden
  // -------------------------------------------------------

  useEffect(() => {
    async function loadScenarios() {
      try {
        setIsLoading(true);
        setLoadError("");

        const loadedScenarios =
            await getScenarios();

        if (!Array.isArray(loadedScenarios)) {
          throw new Error(
              "Das Backend hat keine gültige Szenarienliste zurückgegeben."
          );
        }

        setScenarios(
            loadedScenarios
        );

      } catch (error) {
        setLoadError(
            error instanceof Error
                ? error.message
                : "Die Szenarien konnten nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadScenarios();
  }, []);


  // -------------------------------------------------------
  // Ladeanzeige
  // -------------------------------------------------------

  if (isLoading) {
    return (
        <main className="container training-page py-5">

          <section className="training-status-card">

            <div
                className="spinner-border text-primary"
                role="status"
                aria-label="Szenarien werden geladen"
            />

            <p className="mb-0">
              Trainingsszenarien werden geladen …
            </p>

          </section>

        </main>
    );
  }


  // -------------------------------------------------------
  // Ladefehler
  // -------------------------------------------------------

  if (loadError) {
    return (
        <main className="container training-page py-5">

          <div
              className="alert alert-danger"
              role="alert"
          >
            <h1 className="h4">
              Training konnte nicht geladen werden
            </h1>

            <p className="mb-0">
              {loadError}
            </p>
          </div>

        </main>
    );
  }


  // -------------------------------------------------------
  // Keine Szenarien vorhanden
  // -------------------------------------------------------

  if (scenarios.length === 0) {
    return (
        <main className="container training-page py-5">

          <div
              className="alert alert-warning"
              role="alert"
          >
            Es sind derzeit keine Trainingsszenarien vorhanden.
          </div>

        </main>
    );
  }


  // -------------------------------------------------------
  // Aktuelles Szenario
  // -------------------------------------------------------

  const currentScenario =
      scenarios[currentIndex];

  const isAnswered =
      selectedAnswer !== "";

  const isLastScenario =
      currentIndex ===
      scenarios.length - 1;

  /*
   * Dieser Vergleich ist nur für das direkte Feedback im
   * Frontend. Das Backend berechnet beim Speichern ebenfalls
   * unabhängig, ob die Antwort korrekt ist.
   */
  const answerIsCorrect =
      selectedAnswer ===
      currentScenario.correctAnswer;

  const progress =
      ((currentIndex + 1) /
          scenarios.length) *
      100;


  // -------------------------------------------------------
  // Antwort auswählen
  // -------------------------------------------------------

  async function handleAnswer(answer) {
    if (
        isAnswered ||
        isSavingAttempt
    ) {
      return;
    }

    /*
     * Das Training kennt nur noch zwei mögliche Antworten:
     * legitim oder phishing.
     */
    if (
        answer !== "legitim" &&
        answer !== "phishing"
    ) {
      return;
    }

    setSelectedAnswer(answer);
    setAttemptError("");

    if (
        answer ===
        currentScenario.correctAnswer
    ) {
      setScore(
          (currentScore) =>
              currentScore + 1
      );
    }

    /*
     * Gäste können das Training vollständig durchführen,
     * ihre Versuche werden jedoch nicht dauerhaft gespeichert.
     */
    if (!user) {
      return;
    }

    try {
      setIsSavingAttempt(true);

      /*
       * isCorrect wird bewusst nicht vom Frontend übertragen.
       * Das Backend ermittelt die Korrektheit selbst anhand
       * des gespeicherten Szenarios.
       */
      await createAttempt({
        scenarioId:
        currentScenario.id,

        selectedAnswer:
        answer
      });

    } catch (error) {
      setAttemptError(
          error instanceof Error
              ? error.message
              : "Das Ergebnis konnte nicht gespeichert werden."
      );
    } finally {
      setIsSavingAttempt(false);
    }
  }


  // -------------------------------------------------------
  // Nächste Aufgabe
  // -------------------------------------------------------

  function handleNext() {
    if (isLastScenario) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex(
        (index) =>
            index + 1
    );

    setSelectedAnswer("");
    setAttemptError("");
  }


  // -------------------------------------------------------
  // Training neu starten
  // -------------------------------------------------------

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setIsFinished(false);
    setAttemptError("");
  }


  // -------------------------------------------------------
  // Abschlussseite
  // -------------------------------------------------------

  if (isFinished) {
    const percentage =
        Math.round(
            (score /
                scenarios.length) *
            100
        );

    return (
        <main className="container training-page py-5">

          <section className="training-result">

            <div
                className="result-icon"
                aria-hidden="true"
            >
              ✓
            </div>

            <h1>
              Training abgeschlossen
            </h1>

            <p className="result-score">
              {score} von {scenarios.length} richtig
            </p>

            <p className="text-secondary">
              Du hast {percentage} % der Szenarien richtig bewertet.
            </p>

            {!user && (
                <p className="text-secondary">
                  Melde dich an, damit deine Trainingsergebnisse
                  dauerhaft gespeichert werden.
                </p>
            )}

            <button
                className="btn btn-primary"
                type="button"
                onClick={handleRestart}
            >
              Training wiederholen
            </button>

          </section>

        </main>
    );
  }


  // -------------------------------------------------------
  // Hauptansicht
  // -------------------------------------------------------

  return (
      <main className="container training-page py-5">

        <header className="training-header">

          <div>
          <span className="training-overline">
            Phishing-Training
          </span>

            <h1 className="training-title">
              Ist diese Nachricht legitim oder Phishing?
            </h1>

            <p className="text-secondary mb-0">
              Aufgabe {currentIndex + 1} von {scenarios.length}
            </p>
          </div>


          <div className="score-display">
          <span className="score-label">
            Punkte
          </span>

            <strong>
              {score}
            </strong>
          </div>

        </header>


        {/* Fortschrittsbalken */}
        <div
            className="progress training-progress"
            role="progressbar"
            aria-label="Trainingsfortschritt"
            aria-valuenow={
              Math.round(progress)
            }
            aria-valuemin="0"
            aria-valuemax="100"
        >
          <div
              className="progress-bar"
              style={{
                width: `${progress}%`
              }}
          />
        </div>


        {/* E-Mail-Vorschau */}
        <EmailPreview
            scenario={currentScenario}
            showClues={isAnswered}
        />


        {/* -------------------------------------------------- */}
        {/* Antwortauswahl */}
        {/* -------------------------------------------------- */}

        {!isAnswered && (
            <section className="answer-section">

              <h2 className="h5 text-center mb-3">
                Wie bewertest du diese Nachricht?
              </h2>


              <div className="answer-buttons">

                {/* Legitim */}
                <button
                    className="answer-button answer-legitimate"
                    type="button"
                    onClick={() =>
                        handleAnswer("legitim")
                    }
                >
              <span
                  className="answer-icon"
                  aria-hidden="true"
              >
                ✓
              </span>

                  <span>
                <strong>
                  Legitim
                </strong>

                <small>
                  Die Nachricht ist vertrauenswürdig
                </small>
              </span>
                </button>


                {/* Phishing */}
                <button
                    className="answer-button answer-phishing"
                    type="button"
                    onClick={() =>
                        handleAnswer("phishing")
                    }
                >
              <span
                  className="answer-icon"
                  aria-hidden="true"
              >
                !
              </span>

                  <span>
                <strong>
                  Phishing
                </strong>

                <small>
                  Die Nachricht ist betrügerisch
                </small>
              </span>
                </button>

              </div>

            </section>
        )}


        {/* -------------------------------------------------- */}
        {/* Feedback */}
        {/* -------------------------------------------------- */}

        {isAnswered && (
            <section className="answer-feedback">

              {attemptError && (
                  <div
                      className="alert alert-warning"
                      role="alert"
                  >
                    {attemptError}
                  </div>
              )}


              <div
                  className={
                    answerIsCorrect
                        ? "feedback-card feedback-correct"
                        : "feedback-card feedback-wrong"
                  }
                  role="alert"
              >
                <div
                    className="feedback-icon"
                    aria-hidden="true"
                >
                  {answerIsCorrect
                      ? "✓"
                      : "×"}
                </div>

                <div>
                  <h2 className="h4">
                    {answerIsCorrect
                        ? "Richtig erkannt"
                        : "Nicht ganz"}
                  </h2>

                  <p className="mb-0">
                    {currentScenario.explanation}
                  </p>
                </div>
              </div>


              {/* Erklärungen und Hinweise */}
              <CluePanel
                  clues={
                      currentScenario.clues ?? []
                  }
              />


              <div className="next-button-wrapper">

                <button
                    className="btn btn-primary btn-lg"
                    type="button"
                    onClick={handleNext}
                    disabled={isSavingAttempt}
                >
                  {isSavingAttempt
                      ? "Ergebnis wird gespeichert …"
                      : isLastScenario
                          ? "Ergebnis anzeigen"
                          : "Nächste Aufgabe"}
                </button>

              </div>

            </section>
        )}

      </main>
  );
}


export default TrainingPage;
