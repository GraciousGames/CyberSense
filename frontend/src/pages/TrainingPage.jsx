function TrainingPage() {
  return (
    <main className="container py-5">
      <h1>Phishing-Training</h1>

      <p className="text-secondary">Aufgabe 1 von 10</p>

      <div
        className="progress mb-4"
        role="progressbar"
        aria-label="Trainingsfortschritt"
        aria-valuenow="10"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-bar" style={{ width: "10%" }}>
          10 %
        </div>
      </div>

      <article className="card">
        <div className="card-header">E-Mail</div>

        <div className="card-body">
          <p>
            <strong>Von:</strong>{" "}
            support@paypaI-security.example
          </p>

          <p>
            <strong>Betreff:</strong>{" "}
            Ihr Konto wurde gesperrt
          </p>

          <hr />

          <p>
            Wir haben ungewöhnliche Aktivitäten festgestellt.
            Bestätigen Sie innerhalb von 24 Stunden Ihre Identität.
          </p>
        </div>
      </article>

      <div className="d-flex flex-wrap gap-3 mt-4">
        <button className="btn btn-success" type="button">
          Legitim
        </button>

        <button className="btn btn-warning" type="button">
          Verdächtig
        </button>

        <button className="btn btn-danger" type="button">
          Phishing
        </button>
      </div>
    </main>
  );
}

export default TrainingPage;