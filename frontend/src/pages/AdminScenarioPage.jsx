import { useState } from "react";
import { Link } from "react-router-dom";

import { createScenario } from "../services/scenarioService.js";

const initialFormData = {
  senderName: "",
  senderEmail: "",
  recipient: "",
  subject: "",
  date: "",
  greeting: "",
  paragraphOne: "",
  paragraphTwo: "",
  actionText: "",
  displayedUrl: "",
  actualUrl: "",
  signature: "",
  correctAnswer: "phishing",
  explanation: "",
  clueTitle: "",
  clueDescription: ""
};

function AdminScenarioPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  function handleReset() {
    setFormData(initialFormData);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const paragraphs = [
      formData.paragraphOne.trim(),
      formData.paragraphTwo.trim()
    ].filter(Boolean);

    const scenario = {
      senderName: formData.senderName.trim(),
      senderEmail: formData.senderEmail.trim(),
      recipient: formData.recipient.trim(),
      subject: formData.subject.trim(),
      date: formData.date.trim(),
      greeting: formData.greeting.trim(),
      paragraphs,
      actionText: formData.actionText.trim() || null,
      displayedUrl: formData.displayedUrl.trim() || null,
      actualUrl: formData.actualUrl.trim() || null,
      signature: formData.signature.trim(),
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation.trim(),
      clues: [
        {
          id: `clue-${Date.now()}`,
          title: formData.clueTitle.trim(),
          description: formData.clueDescription.trim()
        }
      ]
    };

    try {
      const createdScenario = await createScenario(scenario);

      setSuccess(
        `Das Szenario „${createdScenario.subject}“ wurde gespeichert.`
      );

      setFormData(initialFormData);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Das Szenario konnte nicht gespeichert werden."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-container">
      <header className="page-heading">
        <span className="page-overline">
          Administration
        </span>

        <h1 className="page-title">
          Neues Szenario
        </h1>

        <p className="page-description">
          Erstelle eine neue Trainingsmail mit Bewertung,
          Erklärung und Hinweis.
        </p>
      </header>

      <section className="surface-card admin-form-card">
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
          <h2 className="h4 mb-4">Absender und Empfänger</h2>

          <div className="admin-form-grid">
            <FormField
              label="Absendername"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
            />

            <FormField
              label="Absenderadresse"
              name="senderEmail"
              type="email"
              value={formData.senderEmail}
              onChange={handleChange}
            />

            <FormField
              label="Empfängeradresse"
              name="recipient"
              type="email"
              value={formData.recipient}
              onChange={handleChange}
            />

            <FormField
              label="Datum oder Zeitangabe"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Heute, 14:30"
            />
          </div>

          <h2 className="h4 mt-5 mb-4">Inhalt der Nachricht</h2>

          <FormField
            label="Betreff"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <FormField
            label="Anrede"
            name="greeting"
            value={formData.greeting}
            onChange={handleChange}
            placeholder="Guten Tag,"
          />

          <TextAreaField
            label="Erster Absatz"
            name="paragraphOne"
            value={formData.paragraphOne}
            onChange={handleChange}
          />

          <TextAreaField
            label="Zweiter Absatz"
            name="paragraphTwo"
            value={formData.paragraphTwo}
            onChange={handleChange}
            required={false}
          />

          <FormField
            label="Signatur"
            name="signature"
            value={formData.signature}
            onChange={handleChange}
            placeholder="Ihr Sicherheitsteam"
          />

          <h2 className="h4 mt-5 mb-4">
            Link oder Aktionsbutton
          </h2>

          <div className="admin-form-grid">
            <FormField
              label="Buttontext"
              name="actionText"
              value={formData.actionText}
              onChange={handleChange}
              required={false}
            />

            <FormField
              label="Angezeigte URL"
              name="displayedUrl"
              type="url"
              value={formData.displayedUrl}
              onChange={handleChange}
              required={false}
            />

            <FormField
              label="Tatsächliche URL"
              name="actualUrl"
              type="url"
              value={formData.actualUrl}
              onChange={handleChange}
              required={false}
            />
          </div>

          <h2 className="h4 mt-5 mb-4">
            Bewertung und Erklärung
          </h2>

          <div className="mb-3">
            <label className="form-label" htmlFor="correctAnswer">
              Richtige Bewertung
            </label>

            <select
              className="form-select"
              id="correctAnswer"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
            >
              <option value="legitim">Legitim</option>
              <option value="suspicious">Verdächtig</option>
              <option value="phishing">Phishing</option>
            </select>
          </div>

          <TextAreaField
            label="Erklärung"
            name="explanation"
            value={formData.explanation}
            onChange={handleChange}
          />

          <h2 className="h4 mt-5 mb-4">
            Hinweis
          </h2>

          <FormField
            label="Titel des Hinweises"
            name="clueTitle"
            value={formData.clueTitle}
            onChange={handleChange}
          />

          <TextAreaField
            label="Beschreibung des Hinweises"
            name="clueDescription"
            value={formData.clueDescription}
            onChange={handleChange}
          />

          <div className="admin-form-actions">
            <Link className="btn btn-ghost" to="/admin">
              Zurück
            </Link>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleReset}
            >
              Formular leeren
            </button>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Wird gespeichert …"
                : "Szenario speichern"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = true
}) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>

      <input
        className="form-control"
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  required = true
}) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>

      <textarea
        className="form-control"
        id={name}
        name={name}
        rows="4"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default AdminScenarioPage;