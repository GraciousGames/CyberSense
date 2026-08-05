function LoginPage() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <h1>Anmelden</h1>

          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                E-Mail-Adresse
              </label>

              <input
                className="form-control"
                id="email"
                name="email"
                type="email"
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
                autoComplete="current-password"
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Anmelden
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;