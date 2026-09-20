function AboutPage() {
    return (
        <main className="page-container">

            <section className="legal-page">

        <span className="page-overline">
          Über das Projekt
        </span>

                <h1>
                    Über CyberSense
                </h1>

                <p className="legal-page-intro">
                    CyberSense ist eine interaktive Lernplattform,
                    mit der Nutzerinnen und Nutzer den sicheren Umgang
                    mit verdächtigen E-Mails trainieren können.
                </p>


                <div className="legal-card">

                    <h2>
                        Was ist CyberSense?
                    </h2>

                    <p>
                        Im Training werden realistische E-Mail-Szenarien
                        dargestellt. Die Aufgabe besteht darin zu
                        entscheiden, ob eine Nachricht legitim ist oder
                        einen Phishing-Versuch darstellt.
                    </p>

                    <p>
                        Nach jeder Entscheidung zeigt CyberSense eine
                        Erklärung und hebt relevante Merkmale der
                        Nachricht hervor. Dadurch soll nicht nur die
                        richtige Antwort vermittelt werden, sondern auch,
                        warum bestimmte Merkmale auf Phishing hindeuten.
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Hochschulprojekt
                    </h2>

                    <p>
                        CyberSense entstand im Rahmen des Moduls
                        Web Programming im Studiengang Medieninformatik
                        an der HAW Hamburg.
                    </p>

                    <p>
                        Entwickelt wurde die Anwendung von
                        Grace Gehlisch, Clemens Lampen und Marcel Brauns.
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Was CyberSense nicht macht
                    </h2>

                    <p>
                        CyberSense greift nicht auf echte E-Mail-Postfächer
                        zu und analysiert keine realen Nachrichten,
                        Anhänge oder Schadsoftware.
                    </p>

                    <p>
                        Sämtliche Nachrichten innerhalb des Trainings sind
                        vorbereitete Szenarien und dienen ausschließlich
                        Lern- und Demonstrationszwecken.
                    </p>

                </div>

            </section>

        </main>
    );
}


export default AboutPage;