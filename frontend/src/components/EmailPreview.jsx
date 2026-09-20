import { useState } from "react";


function EmailPreview({
                        scenario,
                        showClues
                      }) {

  // Steuert die Anzeige der erweiterten E-Mail-Details.
  const [
    showDetails,
    setShowDetails
  ] = useState(false);


  // Zeigt beim Überfahren des Buttons
  // die tatsächliche Zieladresse an.
  const [
    showLinkTarget,
    setShowLinkTarget
  ] = useState(false);


  // -------------------------------------------------------
  // Hilfsfunktion für markierte Stellen
  // -------------------------------------------------------

  /**
   * Prüft, ob zu einem bestimmten Bereich der E-Mail
   * ein Hinweis existiert.
   *
   * Beispiele:
   * sender
   * subject
   * greeting
   * paragraph-0
   * paragraph-1
   * link
   * signature
   */
  function hasClue(clueId) {
    return scenario.clues.some(
        (clue) => clue.id === clueId
    );
  }


  /**
   * Liefert die CSS-Klasse für verdächtige Bereiche.
   *
   * Die Hervorhebung wird erst angezeigt,
   * nachdem der Benutzer seine Antwort abgegeben hat.
   */
  function getHighlightClass(clueId) {
    return showClues && hasClue(clueId)
        ? " suspicious-highlight"
        : "";
  }


  return (
      <article className="email-window">

        {/* -------------------------------------------------- */}
        {/* Toolbar */}
        {/* -------------------------------------------------- */}

        <header className="email-toolbar">

          <button
              className="email-icon-button"
              type="button"
          >
            ←

            <span className="visually-hidden">
            Zurück
          </span>
          </button>


          <div className="email-toolbar-actions">

            <button
                className="email-toolbar-button"
                type="button"
            >
              Archivieren
            </button>

            <button
                className="email-toolbar-button"
                type="button"
            >
              Löschen
            </button>

            <button
                className="email-toolbar-button"
                type="button"
            >
              ⋮
            </button>

          </div>

        </header>


        <div className="email-content">

          {/* ------------------------------------------------ */}
          {/* Betreff */}
          {/* ------------------------------------------------ */}

          <div className="email-subject-row">

            <h2
                className={
                  `email-subject${getHighlightClass(
                      "subject"
                  )}`
                }
            >
              {scenario.subject}
            </h2>


            <span className="email-label">
            Posteingang
          </span>

          </div>


          {/* ------------------------------------------------ */}
          {/* Absender */}
          {/* ------------------------------------------------ */}

          <section className="email-sender">

            <div
                className="email-avatar"
                aria-hidden="true"
            >
              {scenario.senderName
                  .charAt(0)
                  .toUpperCase()}
            </div>


            <div className="email-sender-content">

              <button
                  className="email-sender-button"
                  type="button"
                  aria-expanded={showDetails}
                  onClick={() =>
                      setShowDetails(
                          (current) => !current
                      )
                  }
              >
                <strong>
                  {scenario.senderName}
                </strong>

                <span aria-hidden="true">
                {showDetails
                    ? " ▲"
                    : " ▼"}
              </span>
              </button>


              <div
                  className={
                    `email-address${getHighlightClass(
                        "sender"
                    )}`
                  }
              >
                &lt;{scenario.senderEmail}&gt;
              </div>


              <small className="text-secondary">
                an {scenario.recipient}
              </small>


              {/* Erweiterte Header-Informationen */}
              {showDetails && (
                  <div className="email-details">

                    <div>
                      <strong>
                        Von:
                      </strong>{" "}
                      {scenario.senderEmail}
                    </div>

                    <div>
                      <strong>
                        An:
                      </strong>{" "}
                      {scenario.recipient}
                    </div>

                    <div>
                      <strong>
                        Datum:
                      </strong>{" "}
                      {scenario.date}
                    </div>

                  </div>
              )}

            </div>


            <time className="email-date">
              {scenario.date}
            </time>

          </section>


          {/* ------------------------------------------------ */}
          {/* Nachrichteninhalt */}
          {/* ------------------------------------------------ */}

          <section className="email-body">

            <p
                className={
                  getHighlightClass(
                      "greeting"
                  ).trim()
                }
            >
              {scenario.greeting}
            </p>


            {/* Jeder Absatz kann einzeln markiert werden.
              paragraph-0 bezeichnet den ersten Absatz,
              paragraph-1 den zweiten usw. */}
            {scenario.paragraphs.map(
                (paragraph, index) => (

                    <p
                        key={index}
                        className={
                          getHighlightClass(
                              `paragraph-${index}`
                          ).trim()
                        }
                    >
                      {paragraph}
                    </p>

                )
            )}


            {/* ------------------------------------------------ */}
            {/* Call-to-Action / Link */}
            {/* ------------------------------------------------ */}

            {scenario.actionText && (

                <div className="email-action-area">

                  <button
                      className={
                        `fake-email-button${getHighlightClass(
                            "link"
                        )}`
                      }
                      type="button"

                      onMouseEnter={() =>
                          setShowLinkTarget(true)
                      }

                      onMouseLeave={() =>
                          setShowLinkTarget(false)
                      }

                      onFocus={() =>
                          setShowLinkTarget(true)
                      }

                      onBlur={() =>
                          setShowLinkTarget(false)
                      }

                      onClick={() =>
                          setShowLinkTarget(true)
                      }
                  >
                    {scenario.actionText}
                  </button>


                  {/* Tatsächliches Linkziel */}
                  <div
                      className={
                        `link-target ${
                            showLinkTarget
                                ? "link-target-visible"
                                : ""
                        }`
                      }
                      aria-live="polite"
                  >
                    Zieladresse:{" "}
                    {scenario.actualUrl}
                  </div>


                  {/* Sichtbare URL */}
                  <small className="displayed-url">
                    Angezeigter Link:{" "}
                    {scenario.displayedUrl}
                  </small>

                </div>

            )}


            {/* ------------------------------------------------ */}
            {/* Signatur */}
            {/* ------------------------------------------------ */}

            <p
                className={
                  `email-signature${getHighlightClass(
                      "signature"
                  )}`
                }
            >
              Freundliche Grüße
              <br />

              {scenario.signature}
            </p>

          </section>

        </div>

      </article>
  );
}


export default EmailPreview;