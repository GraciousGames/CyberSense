import { Link } from "react-router-dom";


function Footer() {
  return (
      <footer className="app-footer">

        <div className="app-footer-content">

          {/* Projektbeschreibung */}
          <div className="app-footer-brand">

            <strong>CyberSense</strong>

            <p>
              Interaktive Lernplattform zur Erkennung von
              Phishing und Social Engineering.
            </p>

            <span className="app-footer-university">
            Ein studentisches Projekt der HAW Hamburg.
          </span>

          </div>


          {/* Navigation */}
          <div className="app-footer-links">

            <div className="app-footer-link-group">

              <strong>CyberSense</strong>

              <Link to="/training">
                Training
              </Link>

              <Link to="/statistics">
                Statistik
              </Link>

            </div>


            <div className="app-footer-link-group">

              <strong>Projekt</strong>

              <Link to="/about">
                Über CyberSense
              </Link>

              <Link to="/contact">
                Kontakt
              </Link>

            </div>


            <div className="app-footer-link-group">

              <strong>Rechtliches</strong>

              <Link to="/privacy">
                Datenschutz
              </Link>

              <Link to="/imprint">
                Impressum
              </Link>

            </div>

          </div>

        </div>


        {/* Unterer Footer-Bereich */}
        <div className="app-footer-bottom">

        <span>
          © 2026/27 CyberSense · HAW Hamburg
        </span>

          <span>
          Entwickelt mit JavaScript, Kaffee und verdächtig
          vielen Phishing-Mails.
        </span>

        </div>

      </footer>
  );
}


export default Footer;