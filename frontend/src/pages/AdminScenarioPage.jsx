// React-Hooks für Formularzustand und Laden vorhandener Daten.
import {
  useEffect,
  useState
} from "react";

// React Router stellt Navigation und URL-Parameter bereit.
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

// Scenario-Service enthält alle Backend-Aufrufe.
import {
  createScenario,
  getScenarioById,
  updateScenario
} from "../services/scenarioService.js";


// ---------------------------------------------------------
// Ausgangszustand des Formulars
// ---------------------------------------------------------

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
  // Liest die ID aus einer URL wie:
  // /admin/scenarios/5/edit
  const { id } = useParams();

  // Ermöglicht Navigation nach erfolgreichem Speichern.
  const navigate = useNavigate();

  // Falls eine ID vorhanden ist, befinden wir uns im Bearbeitungsmodus.
  const isEditMode = Boolean(id);

  // Enthält alle Eingaben des Formulars.
  const [formData, setFormData] =
      useState(initialFormData);

  // Fehlermeldung für Laden oder Speichern.
  const [error, setError] = useState("");

  // Erfolgsmeldung nach erfolgreichem Speichern.
  const [success, setSuccess] = useState("");

  // Verhindert mehrfaches Absenden während eines Requests.
  const [isSubmitting, setIsSubmitting] =
      useState(false);

  // Zeigt beim Bearbeiten einen Ladezustand.
  const [isLoading, setIsLoading] =
      useState(isEditMode);


  // -------------------------------------------------------
  // Bestehendes Szenario laden
  // -------------------------------------------------------

  useEffect(() => {
    // Beim Erstellen gibt es keine ID.
    // Deshalb muss nichts geladen werden.
    if (!isEditMode) {
      return;
    }

    async function loadScenario() {
      try {
        setError("");

        // Szenario anhand der ID vom Backend laden.
        const scenario =
            await getScenarioById(id);

        // Das Backend besitzt ein Paragraphen-Array.
        // Unser Formular verwendet aktuell zwei einzelne Felder.
        const firstParagraph =
            scenario.paragraphs?.[0] ?? "";

        const secondParagraph =
            scenario.paragraphs?.[1] ?? "";

        // Die Oberfläche unterstützt derzeit einen Hinweis.
        const firstClue =
            scenario.clues?.[0] ?? null;

        // Backend-Daten in das Formular übertragen.
        setFormData({
          senderName:
              scenario.senderName ?? "",

          senderEmail:
              scenario.senderEmail ?? "",

          recipient:
              scenario.recipient ?? "",

          subject:
              scenario.subject ?? "",

          date:
              scenario.date ?? "",

          greeting:
              scenario.greeting ?? "",

          paragraphOne:
          firstParagraph,

          paragraphTwo:
          secondParagraph,

          actionText:
              scenario.actionText ?? "",

          displayedUrl:
              scenario.displayedUrl ?? "",

          actualUrl:
              scenario.actualUrl ?? "",

          signature:
              scenario.signature ?? "",

          correctAnswer:
              scenario.correctAnswer ?? "phishing",

          explanation:
              scenario.explanation ?? "",

          clueTitle:
              firstClue?.title ?? "",

          clueDescription:
              firstClue?.description ?? ""
        });
      } catch (loadError) {
        setError(
            loadError instanceof Error
                ? loadError.message
                : "Das Szenario konnte nicht geladen werden."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadScenario();
  }, [id, isEditMode]);


  // -------------------------------------------------------
  // Formularfelder aktualisieren
  // -------------------------------------------------------

  function handleChange(event) {
    // Name entspricht dem Feldnamen,
    // value dem aktuellen Inhalt.
    const {
      name,
      value
    } = event.target;

    // Nur das geänderte Feld wird aktualisiert.
    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }


  // -------------------------------------------------------
  // Formular zurücksetzen
  // -------------------------------------------------------

  function handleReset() {
    // Beim Erstellen kann das Formular vollständig geleert werden.
    if (!isEditMode) {
      setFormData(initialFormData);
      setError("");
      setSuccess("");
    }
  }


  // -------------------------------------------------------
  // Formular absenden
  // -------------------------------------------------------

  async function handleSubmit(event) {
    // Verhindert das normale Neuladen der HTML-Seite.
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);


    // Leere Absätze werden entfernt.
    const paragraphs = [
      formData.paragraphOne.trim(),
      formData.paragraphTwo.trim()
    ].filter(Boolean);


    // Formularstruktur wird in die Struktur umgewandelt,
    // die unsere REST-API erwartet.
    const scenario = {
      senderName:
          formData.senderName.trim(),

      senderEmail:
          formData.senderEmail.trim(),

      recipient:
          formData.recipient.trim(),

      subject:
          formData.subject.trim(),

      date:
          formData.date.trim(),

      greeting:
          formData.greeting.trim(),

      paragraphs,

      actionText:
          formData.actionText.trim() || null,

      displayedUrl:
          formData.displayedUrl.trim() || null,

      actualUrl:
          formData.actualUrl.trim() || null,

      signature:
          formData.signature.trim(),

      correctAnswer:
      formData.correctAnswer,

      explanation:
          formData.explanation.trim(),

      clues: [
        {
          // Beim Speichern wird eine eindeutige Hinweis-ID erzeugt.
          id: `clue-${Date.now()}`,

          title:
              formData.clueTitle.trim(),

          description:
              formData.clueDescription.trim()
        }
      ]
    };


    try {
      // Im Bearbeitungsmodus wird PUT verwendet.
      if (isEditMode) {
        const updatedScenario =
            await updateScenario(
                id,
                scenario
            );

        setSuccess(
            `Das Szenario „${updatedScenario.subject}“ wurde aktualisiert.`
        );
      } else {
        // Ohne ID wird ein neues Szenario per POST erstellt.
        const createdScenario =
            await createScenario(scenario);

        setSuccess(
            `Das Szenario „${createdScenario.subject}“ wurde gespeichert.`
        );

        // Nach dem Erstellen kann das Formular geleert werden.
        setFormData(initialFormData);
      }

      // Nach kurzer erfolgreicher Verarbeitung
      // wechseln wir zurück zur Szenarioübersicht.
      navigate("/admin/scenarios");

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


  // -------------------------------------------------------
  // Ladezustand beim Bearbeiten
  // -------------------------------------------------------

  if (isLoading) {
    return (
        <main className="page-container">
          <p>
            Szenario wird geladen …
          </p>
        </main>
    );
  }


  // -------------------------------------------------------
  // Oberfläche
  // -------------------------------------------------------

  return (
      <main className="page-container">

        {/* Überschrift passt sich an Neu/Bearbeiten an. */}
        <header className="page-heading">
        <span className="page-overline">
          Administration
        </span>

          <h1 className="page-title">
            {isEditMode
                ? "Szenario bearbeiten"
                : "Neues Szenario"}
          </h1>

          <p className="page-description">
            {isEditMode
                ? "Bearbeite eine vorhandene Trainingsmail."
                : "Erstelle eine neue Trainingsmail mit Bewertung, Erklärung und Hinweis."}
          </p>
        </header>


        <section className="surface-card admin-form-card">

          {/* Backend- oder Validierungsfehler anzeigen. */}
          {error && (
              <div
                  className="alert alert-danger"
                  role="alert"
              >
                {error}
              </div>
          )}

          {/* Erfolg nach dem Speichern anzeigen. */}
          {success && (
              <div
                  className="alert alert-success"
                  role="alert"
              >
                {success}
              </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* ------------------------------------------------ */}
            {/* Absender und Empfänger */}
            {/* ------------------------------------------------ */}

            <h2 className="h4 mb-4">
              Absender und Empfänger
            </h2>

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


            {/* ------------------------------------------------ */}
            {/* Inhalt */}
            {/* ------------------------------------------------ */}

            <h2 className="h4 mt-5 mb-4">
              Inhalt der Nachricht
            </h2>

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


            {/* ------------------------------------------------ */}
            {/* Links */}
            {/* ------------------------------------------------ */}

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


            {/* ------------------------------------------------ */}
            {/* Bewertung */}
            {/* ------------------------------------------------ */}

            <h2 className="h4 mt-5 mb-4">
              Bewertung und Erklärung
            </h2>

            <div className="mb-3">

              <label
                  className="form-label"
                  htmlFor="correctAnswer"
              >
                Richtige Bewertung
              </label>

              <select
                  className="form-select"
                  id="correctAnswer"
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
              >
                <option value="legitim">
                  Legitim
                </option>

                <option value="suspicious">
                  Verdächtig
                </option>

                <option value="phishing">
                  Phishing
                </option>
              </select>

            </div>


            <TextAreaField
                label="Erklärung"
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
            />


            {/* ------------------------------------------------ */}
            {/* Hinweis */}
            {/* ------------------------------------------------ */}

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


            {/* ------------------------------------------------ */}
            {/* Formularaktionen */}
            {/* ------------------------------------------------ */}

            <div className="admin-form-actions">

              <Link
                  className="btn btn-ghost"
                  to="/admin/scenarios"
              >
                Zurück
              </Link>


              {/* Beim Bearbeiten soll man nicht versehentlich
                die geladenen Daten komplett löschen. */}
              {!isEditMode && (
                  <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={handleReset}
                  >
                    Formular leeren
                  </button>
              )}


              <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isSubmitting}
              >
                {isSubmitting
                    ? "Wird gespeichert …"
                    : isEditMode
                        ? "Änderungen speichern"
                        : "Szenario speichern"}
              </button>

            </div>

          </form>
        </section>
      </main>
  );
}


// ---------------------------------------------------------
// Wiederverwendbares Eingabefeld
// ---------------------------------------------------------

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

        {/* Label beschreibt das Eingabefeld. */}
        <label
            className="form-label"
            htmlFor={name}
        >
          {label}
        </label>

        {/* Controlled Input:
          Der Wert wird vollständig durch React gesteuert. */}
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


// ---------------------------------------------------------
// Wiederverwendbares mehrzeiliges Eingabefeld
// ---------------------------------------------------------

function TextAreaField({
                         label,
                         name,
                         value,
                         onChange,
                         required = true
                       }) {
  return (
      <div className="mb-3">

        <label
            className="form-label"
            htmlFor={name}
        >
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