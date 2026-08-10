import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  createScenario,
  getScenario,
  updateScenario
} from "../services/scenarioService.js";

function createEmptyFormData() {
  return {
    senderName: "",
    senderEmail: "",
    recipient: "",
    subject: "",
    date: "",
    greeting: "",
    paragraphs: [""],
    actionText: "",
    displayedUrl: "",
    actualUrl: "",
    signature: "",
    correctAnswer: "phishing",
    explanation: "",
    clues: [
      {
        id: `clue-${Date.now()}`,
        title: "",
        description: ""
      }
    ]
  };
}

function mapScenarioToForm(scenario) {
  return {
    ...scenario,
    actionText: scenario.actionText ?? "",
    displayedUrl: scenario.displayedUrl ?? "",
    actualUrl: scenario.actualUrl ?? "",
    paragraphs: [...scenario.paragraphs],
    clues: scenario.clues.map((clue) => ({ ...clue }))
  };
}

function AdminScenarioPage() {
  const { id } = useParams();
  const isEditing = id !== undefined;

  const [formData, setFormData] = useState(createEmptyFormData);
  const [loadedFormData, setLoadedFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    async function loadScenario() {
      try {
        setIsLoading(true);
        setLoadError("");

        const scenario = await getScenario(id);
        const mappedScenario = mapScenarioToForm(scenario);

        setFormData(mappedScenario);
        setLoadedFormData(mappedScenario);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Das Szenario konnte nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadScenario();
  }, [id, isEditing]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  function updateParagraph(index, value) {
    setFormData((currentData) => ({
      ...currentData,
      paragraphs: currentData.paragraphs.map((paragraph, paragraphIndex) =>
        paragraphIndex === index ? value : paragraph
      )
    }));
  }

  function addParagraph() {
    setFormData((currentData) => ({
      ...currentData,
      paragraphs: [...currentData.paragraphs, ""]
    }));
  }

  function removeParagraph(index) {
    setFormData((currentData) => ({
      ...currentData,
      paragraphs: currentData.paragraphs.filter(
        (paragraph, paragraphIndex) => paragraphIndex !== index
      )
    }));
  }

  function updateClue(index, field, value) {
    setFormData((currentData) => ({
      ...currentData,
      clues: currentData.clues.map((clue, clueIndex) =>
        clueIndex === index ? { ...clue, [field]: value } : clue
      )
    }));
  }

  function addClue() {
    setFormData((currentData) => ({
      ...currentData,
      clues: [
        ...currentData.clues,
        {
          id: `clue-${Date.now()}`,
          title: "",
          description: ""
        }
      ]
    }));
  }

  function removeClue(index) {
    setFormData((currentData) => ({
      ...currentData,
      clues: currentData.clues.filter(
        (clue, clueIndex) => clueIndex !== index
      )
    }));
  }

  function handleReset() {
    setFormData(
      loadedFormData
        ? mapScenarioToForm(loadedFormData)
        : createEmptyFormData()
    );
    setSubmitError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitError("");
    setSuccess("");
    setIsSubmitting(true);

    const scenario = {
      ...formData,
      paragraphs: formData.paragraphs.map((paragraph) => paragraph.trim()),
      actionText: formData.actionText.trim() || null,
      displayedUrl: formData.displayedUrl.trim() || null,
      actualUrl: formData.actualUrl.trim() || null,
      clues: formData.clues.map((clue) => ({
        ...clue,
        id: clue.id.trim(),
        title: clue.title.trim(),
        description: clue.description.trim()
      }))
    };

    try {
      const savedScenario = isEditing
        ? await updateScenario(id, scenario)
        : await createScenario(scenario);

      const mappedScenario = mapScenarioToForm(savedScenario);
      setFormData(mappedScenario);
      setLoadedFormData(mappedScenario);
      setSuccess(
        `Das Szenario „${savedScenario.subject}“ wurde ${
          isEditing ? "aktualisiert" : "erstellt"
        }.`
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Das Szenario konnte nicht gespeichert werden."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="page-container">
        <section className="surface-card admin-list-status" role="status">
          <div className="spinner-border text-primary" aria-hidden="true" />
          <p>Szenario wird geladen …</p>
        </section>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="page-container">
        <div className="alert alert-danger" role="alert">
          <h1 className="h4">Szenario konnte nicht geladen werden</h1>
          <p>{loadError}</p>
          <Link className="btn btn-outline-secondary" to="/admin/scenarios">
            Zurück zur Übersicht
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <header className="page-heading">
        <span className="page-overline">Administration</span>
        <h1 className="page-title">
          {isEditing ? "Szenario bearbeiten" : "Neues Szenario"}
        </h1>
        <p className="page-description">
          {isEditing
            ? "Bearbeite die Trainingsmail, ihre Bewertung und Hinweise."
            : "Erstelle eine neue Trainingsmail mit Bewertung, Erklärung und Hinweisen."}
        </p>
      </header>

      <section className="surface-card admin-form-card">
        {submitError && (
          <div className="alert alert-danger" role="alert">
            {submitError}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="status">
            {success} <Link to="/admin/scenarios">Zur Übersicht</Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h2>Absender und Empfänger</h2>
          <div className="admin-form-grid">
            <FormField label="Absendername" name="senderName" value={formData.senderName} onChange={handleChange} />
            <FormField label="Absenderadresse" name="senderEmail" type="email" value={formData.senderEmail} onChange={handleChange} />
            <FormField label="Empfängeradresse" name="recipient" type="email" value={formData.recipient} onChange={handleChange} />
            <FormField label="Datum oder Zeitangabe" name="date" value={formData.date} onChange={handleChange} placeholder="Heute, 14:30" />
          </div>

          <h2>Inhalt der Nachricht</h2>
          <FormField label="Betreff" name="subject" value={formData.subject} onChange={handleChange} />
          <FormField label="Anrede" name="greeting" value={formData.greeting} onChange={handleChange} placeholder="Guten Tag," />

          <div className="admin-repeatable-list">
            {formData.paragraphs.map((paragraph, index) => (
              <div className="admin-repeatable-item" key={`paragraph-${index}`}>
                <TextAreaField
                  label={`Absatz ${index + 1}`}
                  name={`paragraph-${index}`}
                  value={paragraph}
                  onChange={(event) => updateParagraph(index, event.target.value)}
                />
                <button className="btn btn-ghost" type="button" disabled={formData.paragraphs.length === 1} onClick={() => removeParagraph(index)}>
                  Absatz entfernen
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-outline-secondary admin-add-button" type="button" onClick={addParagraph}>
            + Absatz hinzufügen
          </button>

          <FormField label="Signatur" name="signature" value={formData.signature} onChange={handleChange} placeholder="Ihr Sicherheitsteam" />

          <h2>Link oder Aktionsbutton</h2>
          <div className="admin-form-grid">
            <FormField label="Buttontext" name="actionText" value={formData.actionText} onChange={handleChange} required={false} />
            <FormField label="Angezeigte URL" name="displayedUrl" type="url" value={formData.displayedUrl} onChange={handleChange} required={false} />
            <FormField label="Tatsächliche URL" name="actualUrl" type="url" value={formData.actualUrl} onChange={handleChange} required={false} />
          </div>

          <h2>Bewertung und Erklärung</h2>
          <div className="mb-3">
            <label className="form-label" htmlFor="correctAnswer">Richtige Bewertung</label>
            <select className="form-select" id="correctAnswer" name="correctAnswer" value={formData.correctAnswer} onChange={handleChange}>
              <option value="legitim">Legitim</option>
              <option value="suspicious">Verdächtig</option>
              <option value="phishing">Phishing</option>
            </select>
          </div>
          <TextAreaField label="Erklärung" name="explanation" value={formData.explanation} onChange={handleChange} />

          <h2>Hinweise</h2>
          <div className="admin-repeatable-list">
            {formData.clues.map((clue, index) => (
              <div className="admin-repeatable-item" key={`clue-${index}`}>
                <FormField label={`Hinweis ${index + 1}: Kennung`} name={`clue-id-${index}`} value={clue.id} onChange={(event) => updateClue(index, "id", event.target.value)} />
                <FormField label="Titel" name={`clue-title-${index}`} value={clue.title} onChange={(event) => updateClue(index, "title", event.target.value)} />
                <TextAreaField label="Beschreibung" name={`clue-description-${index}`} value={clue.description} onChange={(event) => updateClue(index, "description", event.target.value)} />
                <button className="btn btn-ghost" type="button" disabled={formData.clues.length === 1} onClick={() => removeClue(index)}>
                  Hinweis entfernen
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-outline-secondary admin-add-button" type="button" onClick={addClue}>
            + Hinweis hinzufügen
          </button>

          <div className="admin-form-actions">
            <Link className="btn btn-ghost" to="/admin/scenarios">Abbrechen</Link>
            <button className="btn btn-secondary" type="button" onClick={handleReset}>Änderungen zurücksetzen</button>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Wird gespeichert …" : isEditing ? "Änderungen speichern" : "Szenario erstellen"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function FormField({ label, name, value, onChange, type = "text", placeholder = "", required = true }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input className="form-control" id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>{label}</label>
      <textarea className="form-control" id={name} name={name} rows="4" value={value} onChange={onChange} required />
    </div>
  );
}

export default AdminScenarioPage;
