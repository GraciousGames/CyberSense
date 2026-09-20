import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  createScenario,
  getScenarioById,
  updateScenario
} from "../services/scenarioService.js";


/*
 * Alle Trainingsnachrichten werden aus der Perspektive derselben
 * fiktiven Person dargestellt. Der Wert wird deshalb nicht vom
 * Administrator verändert.
 */
const TRAINING_RECIPIENT =
    "Max Mustermann <max.mustermann@example.de>";


/*
 * Startwerte für ein neues Szenario.
 *
 * Die Anwendung unterscheidet nur noch zwischen:
 * - legitim
 * - phishing
 */
const initialFormData = {
  senderName: "",
  senderEmail: "",
  recipient: TRAINING_RECIPIENT,
  subject: "",
  date: "",
  greeting: "Hallo Max Mustermann,",
  paragraphOne: "",
  paragraphTwo: "",
  actionText: "",
  displayedUrl: "",
  actualUrl: "",
  signature: "",
  correctAnswer: "phishing",
  explanation: "",
  clueTarget: "sender",
  clueTitle: "",
  clueDescription: ""
};


/*
 * Bereiche einer E-Mail, die nach der Beantwortung
 * hervorgehoben werden können.
 */
const clueTargets = [
  {
    value: "sender",
    label: "Absenderadresse"
  },
  {
    value: "subject",
    label: "Betreff"
  },
  {
    value: "greeting",
    label: "Anrede"
  },
  {
    value: "paragraph-0",
    label: "Erster Absatz"
  },
  {
    value: "paragraph-1",
    label: "Zweiter Absatz"
  },
  {
    value: "link",
    label: "Link / Aktionsbutton"
  },
  {
    value: "signature",
    label: "Signatur"
  }
];


function AdminScenarioPage() {
  // URL-Parameter, z. B. /admin/scenarios/5/edit.
  const { id } = useParams();

  // Navigation nach dem Speichern.
  const navigate = useNavigate();

  // Mit ID: Bearbeiten, ohne ID: neues Szenario.
  const isEditMode = Boolean(id);

  const [formData, setFormData] =
      useState(initialFormData);

  const [error, setError] =
      useState("");

  const [success, setSuccess] =
      useState("");

  const [isSubmitting, setIsSubmitting] =
      useState(false);

  const [isLoading, setIsLoading] =
      useState(isEditMode);


  // -------------------------------------------------------
  // Vorhandenes Szenario laden
  // -------------------------------------------------------

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadScenario() {
      try {
        setError("");

        const scenario =
            await getScenarioById(id);

        const firstParagraph =
            scenario.paragraphs?.[0] ?? "";

        const secondParagraph =
            scenario.paragraphs?.[1] ?? "";

        /*
         * Das aktuelle Adminformular bearbeitet einen Hinweis.
         * Existieren mehrere Hinweise, wird der erste geladen.
         */
        const firstClue =
            scenario.clues?.[0] ?? null;

        setFormData({
          senderName:
              scenario.senderName ?? "",

          senderEmail:
              scenario.senderEmail ?? "",

          /*
           * Der Empfänger bleibt unabhängig von alten Daten
           * immer die fest definierte Trainingsperson.
           */
          recipient:
          TRAINING_RECIPIENT,

          subject:
              scenario.subject ?? "",

          date:
              scenario.date ?? "",

          greeting:
              scenario.greeting ??
              "Hallo Max Mustermann,",

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
              scenario.correctAnswer === "legitim"
                  ? "legitim"
                  : "phishing",

          explanation:
              scenario.explanation ?? "",

          clueTarget:
              firstClue?.id ?? "sender",

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
  }, [
    id,
    isEditMode
  ]);


  // -------------------------------------------------------
  // Formularwerte aktualisieren
  // -------------------------------------------------------

  function handleChange(event) {
    const {
      name,
      value
    } = event.target;

    /*
     * Der Empfänger wird nicht über handleChange verändert.
     * Das entsprechende Feld ist zusätzlich readOnly.
     */
    if (name === "recipient") {
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }


  // -------------------------------------------------------
  // Neues Formular zurücksetzen
  // -------------------------------------------------------

  function handleReset() {
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
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // Leere Absätze werden nicht an das Backend gesendet.
    const paragraphs = [
      formData.paragraphOne.trim(),
      formData.paragraphTwo.trim()
    ].filter(Boolean);

    /*
     * Ein Hinweis wird nur gespeichert, wenn Titel und Beschreibung
     * ausgefüllt wurden. So entstehen keine leeren Clues.
     */
    const clues =
        formData.clueTitle.trim() &&
        formData.clueDescription.trim()
            ? [
              {
                id:
                formData.clueTarget,

                title:
                    formData.clueTitle.trim(),

                description:
                    formData.clueDescription.trim()
              }
            ]
            : [];

    /*
     * Formulardaten werden in das Datenformat der REST-API
     * übersetzt.
     *
     * Der Empfänger wird bewusst aus der Konstante übernommen
     * und nicht aus dem Formularzustand.
     */
    const scenario = {
      senderName:
          formData.senderName.trim(),

      senderEmail:
          formData.senderEmail.trim(),

      recipient:
      TRAINING_RECIPIENT,

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

      clues
    };

    try {
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
        const createdScenario =
            await createScenario(scenario);

        setSuccess(
            `Das Szenario „${createdScenario.subject}“ wurde gespeichert.`
        );

        setFormData(initialFormData);
      }

      navigate(
          "/admin/scenarios"
      );

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
  // Ladezustand
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

          {error && (
              <div
                  className="alert alert-danger"
                  role="alert"
              >
                {error}
              </div>
          )}

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
                  label="Empfänger"
                  name="recipient"
                  type="text"
                  value={TRAINING_RECIPIENT}
                  onChange={handleChange}
                  readOnly
                  helpText="Der Empfänger ist für alle Trainingsszenarien fest auf Max Mustermann gesetzt."
              />

              <FormField
                  label="Datum oder Zeitangabe"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="15.01.2027, 14:30"
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
                placeholder="Hallo Max Mustermann,"
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
                placeholder="Ihr Kundenservice"
            />


            {/* ------------------------------------------------ */}
            {/* Link */}
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

            <div className="mb-3">
              <label
                  className="form-label"
                  htmlFor="clueTarget"
              >
                Hervorgehobene Stelle
              </label>

              <select
                  className="form-select"
                  id="clueTarget"
                  name="clueTarget"
                  value={formData.clueTarget}
                  onChange={handleChange}
              >
                {clueTargets.map((target) => (
                    <option
                        key={target.value}
                        value={target.value}
                    >
                      {target.label}
                    </option>
                ))}
              </select>

              <small className="form-text">
                Nach der Antwort wird dieser Bereich in der Trainingsmail hervorgehoben.
              </small>
            </div>

            <FormField
                label="Titel des Hinweises"
                name="clueTitle"
                value={formData.clueTitle}
                onChange={handleChange}
                required={false}
            />

            <TextAreaField
                label="Beschreibung des Hinweises"
                name="clueDescription"
                value={formData.clueDescription}
                onChange={handleChange}
                required={false}
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
                     required = true,
                     readOnly = false,
                     helpText = ""
                   }) {
  return (
      <div className="mb-3">

        <label
            className="form-label"
            htmlFor={name}
        >
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
            readOnly={readOnly}
        />

        {helpText && (
            <small className="form-text">
              {helpText}
            </small>
        )}

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
