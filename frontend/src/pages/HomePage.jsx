import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="container py-5">
      <section className="text-center py-5">
        <h1 className="display-4 fw-bold">CyberSense</h1>

        <p className="lead mt-3">
          Interaktive Lernplattform zur Erkennung von Phishing und
          Social Engineering.
        </p>

        <Link className="btn btn-primary btn-lg mt-3" to="/training">
          Training starten
        </Link>
      </section>

      <section className="row g-4 mt-3">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">Phishing erkennen</h2>
              <p className="card-text">
                Lerne typische Merkmale betrügerischer Nachrichten kennen.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">Entscheidungen treffen</h2>
              <p className="card-text">
                Bewerte realistische Nachrichten und E-Mail-Szenarien.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5">Aus Fehlern lernen</h2>
              <p className="card-text">
                Erhalte nach jeder Antwort eine verständliche Erklärung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;