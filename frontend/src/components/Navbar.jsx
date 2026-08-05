import { NavLink } from "react-router-dom";

function Navbar() {
  function getLinkClass({ isActive }) {
    return `nav-link${isActive ? " active fw-semibold" : ""}`;
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          CyberSense
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
          <div className="navbar-nav ms-auto">
            <NavLink className={getLinkClass} to="/">
              Startseite
            </NavLink>

            <NavLink className={getLinkClass} to="/training">
              Training
            </NavLink>

            <NavLink className={getLinkClass} to="/login">
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;