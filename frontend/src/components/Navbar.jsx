import { NavLink } from "react-router-dom";

function Navbar({ user, onLogout }) {
    function getLinkClass({ isActive }) {
        return isActive
            ? "nav-link app-nav-link active"
            : "nav-link app-nav-link";
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
            <div className="container">
                <NavLink className="navbar-brand app-brand" to="/">
                    <img
                        src="/CyberSenseLogo.png"
                        alt="CyberSense Logo"
                        className="brand-logo"
                    />

                    <span className="brand-name">
            CyberSense
          </span>
                </NavLink>

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

                <div
                    className="collapse navbar-collapse"
                    id="mainNavigation"
                >
                    <div className="navbar-nav ms-auto align-items-lg-center">
                        <NavLink
                            className={getLinkClass}
                            to="/"
                        >
                            Startseite
                        </NavLink>

                        <NavLink
                            className={getLinkClass}
                            to="/training"
                        >
                            Training
                        </NavLink>

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

                        {user && (
                            <>


                                {user.role === "admin" && (
                                    <NavLink
                                        className={getLinkClass}
                                        to="/admin"
                                    >
                                        Administration
                                    </NavLink>
                                )}

                                <button
                                    className="app-nav-link app-nav-button"
                                    type="button"
                                    onClick={onLogout}
                                >
                                    Abmelden
                                </button>
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