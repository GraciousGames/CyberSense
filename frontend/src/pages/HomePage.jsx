import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-background-shape hero-shape-one" />
        <div className="hero-background-shape hero-shape-two" />

        <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-badge">
              Interaktives Sicherheitstraining
            </span>

            <h1>
              Phishing erkennen, bevor du darauf hereinfällst.
            </h1>

            <p>
              CyberSense zeigt dir realistische Nachrichten und
              erklärt verständlich, woran sich Phishing und Social
              Engineering erkennen lassen.
            </p>

            <div className="hero-actions">
              <Link
                className="btn btn-primary btn-lg"
                to="/training"
              >
                Training starten
              </Link>

              <Link
                className="btn btn-outline-secondary btn-lg"
                to="/register"
              >
                Konto erstellen
              </Link>
            </div>

            <div className="hero-benefits">
              <span>✓ Realistische Szenarien</span>
              <span>✓ Direkte Erklärungen</span>
              <span>✓ Kostenloses Training</span>
            </div>
          </div>

          <div className="hero-demo-card">
            <div className="demo-window-toolbar">
              <span />
              <span />
              <span />
            </div>

            <div className="demo-mail">
              <span className="demo-mail-label">
                Beispielnachricht
              </span>

              <h2>Ihr Konto wird gesperrt</h2>

              <p className="demo-sender">
                Von: support@paypaI-security.example
              </p>

              <p>
                Bestätigen Sie innerhalb von 24 Stunden Ihre
                Identität.
              </p>

              <div className="demo-warning">
                Verdächtige Domain erkannt
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-container">
          <div className="section-heading text-center">
            <span className="page-overline">
              So funktioniert es
            </span>

            <h2>Schritt für Schritt sicherer werden</h2>

            <p>
              Das Training verbindet realistische Beispiele mit
              verständlichem Feedback.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-number">01</span>

              <h3>Nachricht prüfen</h3>

              <p>
                Untersuche Absender, Inhalt, Links und sprachliche
                Auffälligkeiten.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-number">02</span>

              <h3>Entscheidung treffen</h3>

              <p>
                Bewerte, ob eine Nachricht legitim, verdächtig oder
                eindeutig Phishing ist.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-number">03</span>

              <h3>Hinweise verstehen</h3>

              <p>
                Erhalte sofortiges Feedback und entdecke alle
                relevanten Warnzeichen.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="security-section">
        <div className="page-container security-content">
          <div>
            <span className="page-overline">
              Medienkompetenz und Sicherheit
            </span>

            <h2>Mehr als nur ein Quiz</h2>

            <p>
              CyberSense soll nicht nur richtige Antworten zählen,
              sondern erklären, warum bestimmte Merkmale gefährlich
              sind.
            </p>

            <ul className="security-list">
              <li>Manipulierte Absenderadressen erkennen</li>
              <li>Künstlichen Zeitdruck hinterfragen</li>
              <li>Gefälschte Links überprüfen</li>
              <li>Social-Engineering-Muster verstehen</li>
            </ul>
          </div>

          <div className="security-stat-card">
            <span className="security-stat-value">3</span>
            <span className="security-stat-label">
              interaktive Trainingskategorien
            </span>

            <hr />

            <span className="security-stat-value">100 %</span>
            <span className="security-stat-label">
              direktes Feedback
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;