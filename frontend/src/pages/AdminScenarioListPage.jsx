import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteScenario,
  getScenarios
} from "../services/scenarioService.js";

const answerLabels = {
  legitim: "Legitim",
  suspicious: "Verdächtig",
  phishing: "Phishing"
};

function AdminScenarioListPage() {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

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
  }, [reloadKey]);

  async function handleDelete(scenario) {
    const shouldDelete = window.confirm(
      `Soll das Szenario „${scenario.subject}“ wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setActionError("");
      setIsDeletingId(scenario.id);
      await deleteScenario(scenario.id);
      setScenarios((currentScenarios) =>
        currentScenarios.filter((item) => item.id !== scenario.id)
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Das Szenario konnte nicht gelöscht werden."
      );
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <main className="page-container">
      <header className="page-heading admin-list-heading">
        <div>
          <span className="page-overline">Administration</span>

          <h1 className="page-title">Szenarien verwalten</h1>

          <p className="page-description">
            Erstelle, prüfe, bearbeite und lösche die vorhandenen
            Trainingsszenarien.
          </p>
        </div>

        <Link className="btn btn-primary" to="/admin/scenarios/new">
          Neues Szenario
        </Link>
      </header>

      {isLoading && (
        <section className="surface-card admin-list-status" role="status">
          <div
            className="spinner-border text-primary"
            aria-hidden="true"
          />
          <p>Szenarien werden geladen …</p>
        </section>
      )}

      {!isLoading && loadError && (
        <section className="alert alert-danger" role="alert">
          <h2 className="h5">Szenarien konnten nicht geladen werden</h2>
          <p>{loadError}</p>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Erneut versuchen
          </button>
        </section>
      )}

      {actionError && (
        <div className="alert alert-danger" role="alert">
          {actionError}
        </div>
      )}

      {!isLoading && !loadError && scenarios.length === 0 && (
        <section className="surface-card admin-list-empty">
          <h2>Noch keine Szenarien vorhanden</h2>
          <p>Erstelle das erste Szenario für das Phishing-Training.</p>
          <Link className="btn btn-primary" to="/admin/scenarios/new">
            Erstes Szenario erstellen
          </Link>
        </section>
      )}

      {!isLoading && !loadError && scenarios.length > 0 && (
        <section aria-label="Vorhandene Trainingsszenarien">
          <div className="admin-list-summary">
            <strong>{scenarios.length}</strong>
            {scenarios.length === 1 ? " Szenario" : " Szenarien"}
          </div>

          <div className="admin-scenario-list">
            {scenarios.map((scenario) => (
              <article
                className="surface-card admin-scenario-item"
                key={scenario.id}
              >
                <div className="admin-scenario-main">
                  <div className="admin-scenario-id" aria-label="Szenario-ID">
                    #{scenario.id}
                  </div>

                  <div className="admin-scenario-copy">
                    <div className="admin-scenario-meta">
                      <span
                        className={`admin-answer-badge admin-answer-${scenario.correctAnswer}`}
                      >
                        {answerLabels[scenario.correctAnswer] ??
                          scenario.correctAnswer}
                      </span>
                      <span>
                        {scenario.clues.length} {scenario.clues.length === 1
                          ? "Hinweis"
                          : "Hinweise"}
                      </span>
                    </div>

                    <h2>{scenario.subject}</h2>
                    <p>
                      {scenario.senderName} &lt;{scenario.senderEmail}&gt;
                    </p>
                  </div>
                </div>

                <div className="admin-scenario-actions">
                  <details className="admin-scenario-details">
                    <summary className="btn btn-outline-secondary">
                      Details
                    </summary>

                    <div className="admin-scenario-details-content">
                      <p><strong>An:</strong> {scenario.recipient}</p>
                      <p><strong>Datum:</strong> {scenario.date}</p>
                      <p><strong>Erklärung:</strong> {scenario.explanation}</p>
                    </div>
                  </details>

                  <Link
                    className="btn btn-secondary"
                    to={`/admin/scenarios/${scenario.id}/edit`}
                  >
                    Bearbeiten
                  </Link>

                  <button
                    className="btn btn-danger"
                    type="button"
                    disabled={isDeletingId !== null}
                    onClick={() => handleDelete(scenario)}
                  >
                    {isDeletingId === scenario.id
                      ? "Wird gelöscht …"
                      : "Löschen"}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <Link className="btn btn-ghost admin-list-back" to="/admin">
            Zurück zum Dashboard
          </Link>
        </section>
      )}
    </main>
  );
}

export default AdminScenarioListPage;
