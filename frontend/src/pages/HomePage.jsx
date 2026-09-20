import { Link } from "react-router-dom";


function HomePage() {
  return (
      <main>

        {/* ================================================== */}
        {/* HERO */}
        {/* ================================================== */}

        <section className="hero-section">

          {/* Dekorative Hintergrundelemente */}
          <div
              className="hero-background-shape hero-shape-one"
              aria-hidden="true"
          />

          <div
              className="hero-background-shape hero-shape-two"
              aria-hidden="true"
          />


          <div className="hero-content">

            {/* Linke Seite: Einführung */}
            <div className="hero-copy">

            <span className="hero-badge">
              Interaktives Phishing-Training
            </span>

              <h1>
                Würdest du diese
                Nachricht als Phishing
                erkennen?
              </h1>

              <p>
                Trainiere mit realistischen E-Mails,
                triff deine Entscheidung und erfahre direkt,
                welche Merkmale eine Nachricht verraten.
              </p>


              {/* Zentrale Aktionen */}
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
                  Kostenlos registrieren
                </Link>

              </div>


              {/* Kurzer Überblick über die Vorteile */}
              <div className="hero-benefits">
                <span>✓ Realistische E-Mails</span>
                <span>✓ Sofortiges Feedback</span>
                <span>✓ Persönlicher Fortschritt</span>
              </div>

            </div>


            {/* Rechte Seite: Beispiel einer Trainingsmail */}
            <div className="hero-demo-card">

              <div
                  className="demo-window-toolbar"
                  aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>


              <div className="demo-mail">

              <span className="demo-mail-label">
                Trainingsbeispiel
              </span>

                <h2>
                  Ungewöhnliche Anmeldung erkannt
                </h2>

                <p className="demo-sender">
                  Von: security@microsoft-kontoschutz.test
                </p>

                <p>
                  Wir haben eine ungewöhnliche Anmeldung
                  festgestellt. Bitte bestätigen Sie innerhalb
                  von 30 Minuten Ihre Identität.
                </p>


                {/* Beispiel für einen erkannten Hinweis */}
                <div className="demo-warning">
                  ⚠ Auffällige Absenderadresse
                </div>

                <div className="demo-warning">
                  ⚠ Künstlicher Zeitdruck
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* ABLAUF DES TRAININGS */}
        {/* ================================================== */}

        <section className="feature-section">

          <div className="page-container">

            <div className="section-heading text-center">

            <span className="page-overline">
              So funktioniert CyberSense
            </span>

              <h2>
                Erkennen. Entscheiden. Verstehen.
              </h2>

              <p>
                Jede Aufgabe konfrontiert dich mit einer
                realistischen Nachricht. Du entscheidest selbst
                und bekommst anschließend direkt erklärt,
                worauf du achten solltest.
              </p>

            </div>


            <div className="feature-grid">

              {/* Schritt 1 */}
              <article className="feature-card">

              <span className="feature-number">
                01
              </span>

                <h3>
                  E-Mail untersuchen
                </h3>

                <p>
                  Prüfe Absender, Betreff, Inhalt und Links
                  genau so, wie du es auch in deinem eigenen
                  Postfach tun würdest.
                </p>

              </article>


              {/* Schritt 2 */}
              <article className="feature-card">

              <span className="feature-number">
                02
              </span>

                <h3>
                  Entscheidung treffen
                </h3>

                <p>
                  Entscheide dich eindeutig:
                  Ist die Nachricht legitim oder handelt
                  es sich um Phishing?
                </p>

              </article>


              {/* Schritt 3 */}
              <article className="feature-card">

              <span className="feature-number">
                03
              </span>

                <h3>
                  Warnzeichen erkennen
                </h3>

                <p>
                  Nach deiner Antwort werden relevante Stellen
                  hervorgehoben und verständlich erklärt.
                </p>

              </article>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* LERNINHALTE */}
        {/* ================================================== */}

        <section className="security-section">

          <div className="page-container security-content">

            {/* Linke Seite */}
            <div>

            <span className="page-overline">
              Lernen statt raten
            </span>

              <h2>
                Verstehe, warum eine Nachricht gefährlich ist.
              </h2>

              <p>
                Phishing wird immer überzeugender.
                Deshalb reicht es nicht, nur nach
                Rechtschreibfehlern zu suchen.
                CyberSense zeigt dir unterschiedliche
                Warnsignale und erklärt ihren Zusammenhang.
              </p>


              <ul className="security-list">

                <li>
                  Gefälschte und manipulierte
                  Absenderadressen erkennen
                </li>

                <li>
                  Verdächtige Links und Domains
                  richtig einschätzen
                </li>

                <li>
                  Zeitdruck und emotionale
                  Manipulation hinterfragen
                </li>

                <li>
                  Gefälschte Rechnungen,
                  Kontowarnungen und Paketmeldungen erkennen
                </li>

                <li>
                  Moderne Phishing-Techniken
                  besser verstehen
                </li>

              </ul>

            </div>


            {/* Rechte Seite: Kerngedanke des Trainings */}
            <div className="security-stat-card">

            <span className="security-stat-value">
              2
            </span>

              <span className="security-stat-label">
              klare Entscheidungen
            </span>

              <div className="security-choice-preview">

              <span className="security-choice-legitimate">
                ✓ Legitim
              </span>

                <span className="security-choice-phishing">
                ! Phishing
              </span>

              </div>


              <hr />


              <span className="security-stat-value">
              100 %
            </span>

              <span className="security-stat-label">
              direktes Feedback nach jeder Entscheidung
            </span>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* ABSCHLUSS / CALL TO ACTION */}
        {/* ================================================== */}

        <section className="feature-section">

          <div className="page-container">

            <div className="section-heading text-center">

            <span className="page-overline">
              Bereit für die erste Nachricht?
            </span>

              <h2>
                Teste, wie sicher du Phishing erkennst.
              </h2>

              <p>
                Du kannst das Training direkt ausprobieren.
                Mit einem kostenlosen Konto werden deine
                Ergebnisse zusätzlich gespeichert und in
                deiner persönlichen Statistik ausgewertet.
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

            </div>

          </div>

        </section>

      </main>
  );
}


export default HomePage;