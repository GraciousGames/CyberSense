function ContactPage() {
    return (
        <main className="page-container">

            <section className="legal-page">

        <span className="page-overline">
          Projektkontakt
        </span>

                <h1>
                    Kontakt
                </h1>

                <p className="legal-page-intro">
                    Du hast einen Fehler gefunden, eine Frage zum
                    Projekt oder eine Phishing-Mail hat dich im Training
                    doch erwischt?
                </p>


                <div className="legal-card">

                    <h2>
                        Projektteam
                    </h2>

                    <p>
                        CyberSense wurde von Studierenden des
                        Bachelorstudiengangs Medieninformatik entwickelt:
                    </p>

                    <ul>
                        <li>Grace Gehlisch</li>
                        <li>Clemens Lampen</li>
                        <li>Marcel Brauns</li>
                    </ul>

                    <p>
                        Hochschule für Angewandte Wissenschaften Hamburg
                        (HAW Hamburg)
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Wo finde ich CyberSense?
                    </h2>

                    <p>
                        CyberSense wird im Rahmen eines Hochschulprojekts
                        auf Infrastruktur der HAW Hamburg bereitgestellt.
                    </p>

                    <p>
                        Der Zugriff ist nur innerhalb des Hochschulnetzes
                        beziehungsweise über eine bestehende
                        VPN-Verbindung zur HAW möglich.
                    </p>

                    <p>
                        Wenn du diese Seite gerade lesen kannst, hast du
                        die erste technische Herausforderung also bereits
                        erfolgreich bestanden.
                    </p>

                </div>


                <div className="legal-card">

                    <h2>
                        Fehler gefunden?
                    </h2>

                    <p>
                        Trotz ausführlicher Tests kann sich natürlich
                        irgendwo ein Fehler verstecken.
                    </p>

                    <p>
                        Besonders verdächtig sind Buttons, die nichts tun,
                        E-Mails, die sich selbst für legitim halten, und
                        Statistiken mit überraschend vielen 100&nbsp;%.
                    </p>

                </div>

            </section>

        </main>
    );
}


export default ContactPage;