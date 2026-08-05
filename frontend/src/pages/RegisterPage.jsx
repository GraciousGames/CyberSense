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

    console.log("Registrierungsdaten:", formData);

    setSuccess(
      "Die Registrierung wurde testweise erfolgreich verarbeitet."
    );
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <h1>Registrieren</h1>

          <p className="text-secondary">
            Erstelle ein Benutzerkonto für CyberSense.
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

          <form className="mt-4" onSubmit={handleSubmit}>
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
                required
              />

              <div className="form-text">
                Mindestens 8 Zeichen.
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
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Registrieren
            </button>
          </form>

          <p className="text-center mt-4">
            Bereits registriert?{" "}
            <Link to="/login">
              Zur Anmeldung
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;