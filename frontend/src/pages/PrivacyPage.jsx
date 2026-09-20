function PrivacyPage() {
    return (
        <main className="page-container">

            <section className="legal-page">

        <span className="page-overline">
          Datenschutz
        </span>

                <h1>
                    Datenschutz
                </h1>

                <p className="legal-page-intro">
                    CyberSense ist ein studentisches Hochschulprojekt.
                    Für die Nutzung einiger Funktionen werden Daten
                    innerhalb der Anwendung gespeichert.
                </p>


                <div className="legal-card">

                    <h2>
                        Welche Daten werden gespeichert?
                    </h2>

                    <p>
                        Bei der Registrierung werden die für das
                        Benutzerkonto benötigten Informationen
                        gespeichert. Dazu gehören insbesondere:
                    </p>

                    <ul>
                        <li>Benutzername</li>
                        <li>E-Mail-Adresse</li>
                        <li>Passwort-Hash</li>
                        <li>Benutzerrolle</li>
                        <li>Zeitpunkt der Kontoerstellung</li>
                    </ul>

                    <p>
                        Das eingegebene Passwort wird nicht im Klartext
                        in der Datenbank gespeichert.
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Trainingsdaten
                    </h2>

                    <p>
                        Bei angemeldeten Benutzerinnen und Benutzern
                        speichert CyberSense absolvierte
                        Trainingsversuche.
                    </p>

                    <p>
                        Dabei werden das beantwortete Szenario,
                        die ausgewählte Antwort, das Ergebnis und der
                        Zeitpunkt des Versuchs gespeichert.
                    </p>

                    <p>
                        Diese Informationen werden verwendet, um die
                        persönliche Trainingsstatistik darzustellen.
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Sessions und Cookies
                    </h2>

                    <p>
                        CyberSense verwendet eine Session, um angemeldete
                        Benutzerinnen und Benutzer während der Nutzung
                        wiederzuerkennen.
                    </p>

                    <p>
                        Die Session wird unter anderem benötigt, um
                        geschützte Funktionen wie die persönliche
                        Statistik und den Administrationsbereich
                        bereitzustellen.
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Keine Analyse echter E-Mails
                    </h2>

                    <p>
                        CyberSense besitzt keinen Zugriff auf persönliche
                        E-Mail-Postfächer und verarbeitet keine echten
                        E-Mails, Anhänge oder Zugangsdaten anderer
                        Dienste.
                    </p>

                    <p>
                        Alle dargestellten Nachrichten sind vorbereitete
                        Trainingsszenarien.
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Tracking und Werbung
                    </h2>

                    <p>
                        CyberSense verwendet keine Werbenetzwerke und
                        dient nicht der Erstellung von Werbeprofilen.
                    </p>

                    <p>
                        Die Anwendung wurde ausschließlich zu Lern-,
                        Demonstrations- und Projektzwecken entwickelt.
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Hinweis zum Projektbetrieb
                    </h2>

                    <p>
                        CyberSense ist kein kommerzieller Dienst.
                        Die Anwendung wird im Rahmen eines
                        Hochschulprojekts betrieben und ist nur über die
                        Infrastruktur beziehungsweise den VPN-Zugang der
                        HAW Hamburg erreichbar.
                    </p>

                </div>

            </section>

        </main>
    );
}


export default PrivacyPage;