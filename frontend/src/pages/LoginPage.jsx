import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService.js";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      const user = await loginUser(email, password);
      onLogin(user);

      navigate("/training");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon" aria-hidden="true">
          →
        </div>

        <h1 className="auth-title">Willkommen zurück</h1>

        <p className="auth-description">
          Melde dich an, um dein Training fortzusetzen.
        </p>
        {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              E-Mail-Adresse
            </label>

            <input
                className="form-control"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="name@example.com"
                required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="password">
              Passwort
            </label>

            <input
                className="form-control"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Passwort eingeben"
                required
            />
          </div>

          <button
            className="btn btn-primary btn-lg w-100"
            type="submit"
          >
            Anmelden
          </button>
        </form>

        <p className="auth-footer">
          Noch kein Benutzerkonto?{" "}
          <Link to="/register">
            Jetzt registrieren
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;