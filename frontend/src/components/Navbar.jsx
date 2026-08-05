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
        <NavLink className="navbar-brand app-brand" to="/">
          <span className="brand-icon" aria-hidden="true">
            CS
          </span>

          <span>CyberSense</span>
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
              className="btn btn-primary ms-lg-3 mt-2 mt-lg-0"
              to="/register"
            >
              Registrieren
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;