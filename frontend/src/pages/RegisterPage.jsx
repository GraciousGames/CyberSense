import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.passwordConfirmation) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    setSuccess(
      "Die Registrierung wurde testweise erfolgreich verarbeitet."
    );

    setFormData({
      username: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    });
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon" aria-hidden="true">
          +
        </div>

        <h1 className="auth-title">Konto erstellen</h1>

        <p className="auth-description">
          Registriere dich, um Fortschritte und Ergebnisse zu speichern.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="username">
              Benutzername
            </label>

            <input
              className="form-control"
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="Benutzername"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              E-Mail-Adresse
            </label>

            <input
              className="form-control"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Passwort
            </label>

            <input
              className="form-control"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              placeholder="Mindestens 8 Zeichen"
              required
            />

            <div className="form-text">
              Das Passwort muss mindestens 8 Zeichen lang sein.
            </div>
          </div>

          <div className="mb-4">
            <label
              className="form-label"
              htmlFor="passwordConfirmation"
            >
              Passwort wiederholen
            </label>

            <input
              className="form-control"
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              placeholder="Passwort wiederholen"
              required
            />
          </div>

          <button
            className="btn btn-primary btn-lg w-100"
            type="submit"
          >
            Konto erstellen
          </button>
        </form>

        <p className="auth-footer">
          Bereits registriert?{" "}
          <Link to="/login">
            Zur Anmeldung
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;