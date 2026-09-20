import { Link } from "react-router-dom";


function NotFoundPage() {
    return (
        <main className="page-container">
            <section className="not-found-page">

        <span className="not-found-code">
          404
        </span>

                <span className="page-overline">
          Diese Seite wurde nicht gefunden
        </span>

                <h1>
                    Das sieht verdächtig aus.
                </h1>

                <p>
                    Die angeforderte Seite existiert nicht oder wurde verschoben.
                    Zum Glück war es diesmal nur ein falscher Link und keine
                    Phishing-Mail.
                </p>

                <div className="not-found-actions">
                    <Link
                        to="/"
                        className="btn btn-primary"
                    >
                        Zur Startseite
                    </Link>

                    <Link
                        to="/training"
                        className="btn btn-outline-secondary"
                    >
                        Zum Training
                    </Link>
                </div>

            </section>
        </main>
    );
}


export default NotFoundPage;