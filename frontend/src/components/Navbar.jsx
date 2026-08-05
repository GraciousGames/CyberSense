import { NavLink } from "react-router-dom";

function Navbar() {
  function getLinkClass({ isActive }) {
    return isActive
      ? "nav-link app-nav-link active"
      : "nav-link app-nav-link";
  }

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top">
      <div className="container">
      <NavLink className="app-brand" to="/">
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
            <NavLink className={getLinkClass} to="/">
              Startseite
            </NavLink>

            <NavLink className={getLinkClass} to="/training">
              Training
            </NavLink>

            <NavLink className={getLinkClass} to="/login">
              Anmelden
            </NavLink>

            <NavLink
              className={getLinkClass} to="/register">
              Registrieren
            </NavLink>

            <NavLink className={getLinkClass} to="/admin">
              Administration
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;