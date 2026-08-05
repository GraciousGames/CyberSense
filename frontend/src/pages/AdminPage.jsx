import { Link } from "react-router-dom";

function AdminPage() {
  return (
    <main className="page-container">
      <header className="page-heading">
        <span className="page-overline">
          Administration
        </span>

        <h1 className="page-title">
          Admin-Dashboard
        </h1>

        <p className="page-description">
          Verwalte Trainingsszenarien, Benutzer und Inhalte von
          CyberSense.
        </p>
      </header>

      <section className="admin-dashboard-grid">
        <article className="admin-dashboard-card">
          <div className="admin-dashboard-icon" aria-hidden="true">
            +
          </div>

          <h2>Neues Szenario</h2>

          <p>
            Erstelle eine neue Trainingsnachricht mit Absender,
            Inhalt, Bewertung und Hinweisen.
          </p>

          <Link
            className="btn btn-primary"
            to="/admin/scenarios/new"
          >
            Szenario erstellen
          </Link>
        </article>

        <article className="admin-dashboard-card">
          <div className="admin-dashboard-icon" aria-hidden="true">
            ✎
          </div>

          <h2>Szenarien verwalten</h2>

          <p>
            Zeige alle vorhandenen Szenarien an und bearbeite oder
            lösche sie.
          </p>

          <Link
            className="btn btn-secondary"
            to="/admin/scenarios"
          >
            Szenarien öffnen
          </Link>
        </article>

        <article className="admin-dashboard-card">
          <div className="admin-dashboard-icon" aria-hidden="true">
            👤
          </div>

          <h2>Benutzer verwalten</h2>

          <p>
            Verwalte Benutzerkonten und Rollen. Diese Funktion wird
            später ergänzt.
          </p>

          <button
            className="btn btn-secondary"
            type="button"
            disabled
          >
            Noch nicht verfügbar
          </button>
        </article>

        <article className="admin-dashboard-card">
          <div className="admin-dashboard-icon" aria-hidden="true">
            ↗
          </div>

          <h2>Statistik</h2>

          <p>
            Zeige Anzahl der Szenarien, Nutzer und absolvierten
            Trainings an.
          </p>

          <button
            className="btn btn-secondary"
            type="button"
            disabled
          >
            Noch nicht verfügbar
          </button>
        </article>
      </section>
    </main>
  );
}

export default AdminPage;