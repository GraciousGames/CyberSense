// NavLink erzeugt Links,
// die automatisch erkennen können,
// ob die jeweilige Route gerade aktiv ist.
import {
    NavLink
} from "react-router-dom";


function Navbar({
                    user,
                    onLogout
                }) {

    // -------------------------------------------------------
    // CSS-Klasse für aktive Navigation
    // -------------------------------------------------------

    function getLinkClass({
                              isActive
                          }) {

        // Aktive Seite erhält zusätzlich die Klasse "active".
        return isActive
            ? "nav-link app-nav-link active"
            : "nav-link app-nav-link";
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-dark app-navbar">

            <div className="container">

                {/* ------------------------------------------------ */}
                {/* Logo und Markenname */}
                {/* ------------------------------------------------ */}

                <NavLink
                    className="navbar-brand app-brand"
                    to="/"
                >

                    <img
                        src="/CyberSenseLogo.png"
                        alt="CyberSense Logo"
                        className="brand-logo"
                    />

                    <span className="brand-name">
            CyberSense
          </span>

                </NavLink>


                {/* ------------------------------------------------ */}
                {/* Mobile Navigation */}
                {/* ------------------------------------------------ */}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavigation"
                    aria-controls="mainNavigation"
                    aria-expanded="false"
                    aria-label="Navigation öffnen"
                >
                    <span className="navbar-toggler-icon" />
                </button>


                {/* ------------------------------------------------ */}
                {/* Navigation */}
                {/* ------------------------------------------------ */}

                <div
                    className="collapse navbar-collapse"
                    id="mainNavigation"
                >

                    <div className="navbar-nav ms-auto align-items-lg-center">

                        {/* Startseite */}
                        <NavLink
                            className={getLinkClass}
                            to="/"
                        >
                            Startseite
                        </NavLink>


                        {/* Training ist für alle Benutzer verfügbar. */}
                        <NavLink
                            className={getLinkClass}
                            to="/training"
                        >
                            Training
                        </NavLink>


                        {/* ------------------------------------------------ */}
                        {/* Navigation für Gäste */}
                        {/* ------------------------------------------------ */}

                        {!user && (
                            <>

                                <NavLink
                                    className={getLinkClass}
                                    to="/login"
                                >
                                    Anmelden
                                </NavLink>


                                <NavLink
                                    className={getLinkClass}
                                    to="/register"
                                >
                                    Registrieren
                                </NavLink>

                            </>
                        )}


                        {/* ------------------------------------------------ */}
                        {/* Navigation für eingeloggte Benutzer */}
                        {/* ------------------------------------------------ */}

                        {user && (
                            <>

                                {/* Statistik ist nur sinnvoll,
                    wenn Trainingsergebnisse einem User
                    zugeordnet werden können. */}
                                <NavLink
                                    className={getLinkClass}
                                    to="/statistics"
                                >
                                    Statistik
                                </NavLink>


                                {/* Administration wird nur für Admins angezeigt. */}
                                {user.role === "admin" && (
                                    <NavLink
                                        className={getLinkClass}
                                        to="/admin"
                                    >
                                        Administration
                                    </NavLink>
                                )}


                                {/* Logout beendet die aktuelle Session. */}
                                <button
                                    className="app-nav-link app-nav-button"
                                    type="button"
                                    onClick={onLogout}
                                >
                                    Abmelden
                                </button>


                                {/* Name des aktuell angemeldeten Users. */}
                                <span className="app-nav-user">
                  {user.username}
                </span>

                            </>
                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
}


export default Navbar;