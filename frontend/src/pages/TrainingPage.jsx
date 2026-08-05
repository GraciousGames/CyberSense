import { useEffect, useState } from "react";
import { getScenarios } from "../services/scenarioService.js";

import EmailPreview from "../components/EmailPreview.jsx";
import CluePanel from "../components/CluePanel.jsx";

import "../styles/training.css";

function TrainingPage() {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function loadScenarios() {
      try {
        setIsLoading(true);
        setLoadError("");

        const loadedScenarios = await getScenarios();

        if (!Array.isArray(loadedScenarios)) {
          throw new Error(
            "Das Backend hat keine gültige Szenarienliste zurückgegeben."
          );
        }

        setScenarios(loadedScenarios);
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

  if (loadError) {
    return (
      <main className="container training-page py-5">
        <div className="alert alert-danger" role="alert">
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

  if (scenarios.length === 0) {
    return (
      <main className="container training-page py-5">
        <div className="alert alert-warning" role="alert">
          Es sind derzeit keine Trainingsszenarien vorhanden.
        </div>
      </main>
    );
  }

  const currentScenario = scenarios[currentIndex];
  const isAnswered = selectedAnswer !== "";
  const isLastScenario = currentIndex === scenarios.length - 1;

  const answerIsCorrect =
    selectedAnswer === currentScenario.correctAnswer;

  const progress =
    ((currentIndex + 1) / scenarios.length) * 100;

  function handleAnswer(answer) {
    if (isAnswered) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === currentScenario.correctAnswer) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNext() {
    if (isLastScenario) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer("");
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setIsFinished(false);
  }

  if (isFinished) {
    const percentage = Math.round(
      (score / scenarios.length) * 100
    );

    return (
      <main className="container training-page py-5">
        <section className="training-result">
          <div className="result-icon" aria-hidden="true">
            ✓
          </div>

          <h1>Training abgeschlossen</h1>

          <p className="result-score">
            {score} von {scenarios.length} richtig
          </p>

          <p className="text-secondary">
            Du hast {percentage} % der Szenarien richtig bewertet.
          </p>

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

  return (
    <main className="container training-page py-5">
      <header className="training-header">
        <div>
          <span className="training-overline">
            Phishing-Training
          </span>

          <h1 className="training-title">
            Ist diese Nachricht vertrauenswürdig?
          </h1>

          <p className="text-secondary mb-0">
            Aufgabe {currentIndex + 1} von {scenarios.length}
          </p>
        </div>

        <div className="score-display">
          <span className="score-label">
            Punkte
          </span>

          <strong>{score}</strong>
        </div>
      </header>

      <div
        className="progress training-progress"
        role="progressbar"
        aria-label="Trainingsfortschritt"
        aria-valuenow={Math.round(progress)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <EmailPreview
        scenario={currentScenario}
        showClues={isAnswered}
      />

      {!isAnswered && (
        <section className="answer-section">
          <h2 className="h5 text-center mb-3">
            Wie bewertest du diese Nachricht?
          </h2>

          <div className="answer-buttons">
            <button
              className="answer-button answer-legitimate"
              type="button"
              onClick={() => handleAnswer("legitim")}
            >
              <span
                className="answer-icon"
                aria-hidden="true"
              >
                ✓
              </span>

              <span>
                <strong>Legitim</strong>

                <small>
                  Die Nachricht ist vertrauenswürdig
                </small>
              </span>
            </button>

            <button
              className="answer-button answer-suspicious"
              type="button"
              onClick={() => handleAnswer("suspicious")}
            >
              <span
                className="answer-icon"
                aria-hidden="true"
              >
                ?
              </span>

              <span>
                <strong>Verdächtig</strong>

                <small>
                  Die Nachricht sollte geprüft werden
                </small>
              </span>
            </button>

            <button
              className="answer-button answer-phishing"
              type="button"
              onClick={() => handleAnswer("phishing")}
            >
              <span
                className="answer-icon"
                aria-hidden="true"
              >
                !
              </span>

              <span>
                <strong>Phishing</strong>

                <small>
                  Die Nachricht ist betrügerisch
                </small>
              </span>
            </button>
          </div>
        </section>
      )}

      {isAnswered && (
        <section className="answer-feedback">
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
              {answerIsCorrect ? "✓" : "×"}
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

          <CluePanel
            clues={currentScenario.clues ?? []}
          />

          <div className="next-button-wrapper">
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={handleNext}
            >
              {isLastScenario
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