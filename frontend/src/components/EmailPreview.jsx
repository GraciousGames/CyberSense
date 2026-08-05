import { useState } from "react";

function EmailPreview({ scenario, showClues }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showLinkTarget, setShowLinkTarget] = useState(false);

  const senderIsClue = scenario.clues.some(
    (clue) => clue.id === "sender"
  );

  const linkIsClue = scenario.clues.some(
    (clue) => clue.id === "link"
  );

  return (
    <article className="email-window">
      <header className="email-toolbar">
        <button className="email-icon-button" type="button">
          ←
          <span className="visually-hidden">Zurück</span>
        </button>

        <div className="email-toolbar-actions">
          <button className="email-toolbar-button" type="button">
            Archivieren
          </button>

          <button className="email-toolbar-button" type="button">
            Löschen
          </button>

          <button className="email-toolbar-button" type="button">
            ⋮
          </button>
        </div>
      </header>

      <div className="email-content">
        <div className="email-subject-row">
          <h2 className="email-subject">
            {scenario.subject}
          </h2>

          <span className="email-label">
            Posteingang
          </span>
        </div>

        <section className="email-sender">
          <div className="email-avatar" aria-hidden="true">
            {scenario.senderName.charAt(0).toUpperCase()}
          </div>

          <div className="email-sender-content">
            <button
              className="email-sender-button"
              type="button"
              aria-expanded={showDetails}
              onClick={() => setShowDetails((current) => !current)}
            >
              <strong>{scenario.senderName}</strong>
              <span aria-hidden="true">
                {showDetails ? " ▲" : " ▼"}
              </span>
            </button>

            <div
              className={
                showClues && senderIsClue
                  ? "email-address suspicious-highlight"
                  : "email-address"
              }
            >
              &lt;{scenario.senderEmail}&gt;
            </div>

            <small className="text-secondary">
              an {scenario.recipient}
            </small>

            {showDetails && (
              <div className="email-details">
                <div>
                  <strong>Von:</strong> {scenario.senderEmail}
                </div>

                <div>
                  <strong>An:</strong> {scenario.recipient}
                </div>

                <div>
                  <strong>Datum:</strong> {scenario.date}
                </div>
              </div>
            )}
          </div>

          <time className="email-date">
            {scenario.date}
          </time>
        </section>

        <section className="email-body">
          <p>{scenario.greeting}</p>

          {scenario.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {scenario.actionText && (
            <div className="email-action-area">
              <button
                className={
                  showClues && linkIsClue
                    ? "fake-email-button suspicious-highlight"
                    : "fake-email-button"
                }
                type="button"
                onMouseEnter={() => setShowLinkTarget(true)}
                onMouseLeave={() => setShowLinkTarget(false)}
                onFocus={() => setShowLinkTarget(true)}
                onBlur={() => setShowLinkTarget(false)}
                onClick={() => setShowLinkTarget(true)}
              >
                {scenario.actionText}
              </button>

              <div
                className={`link-target ${
                  showLinkTarget ? "link-target-visible" : ""
                }`}
                aria-live="polite"
              >
                Zieladresse: {scenario.actualUrl}
              </div>

              <small className="displayed-url">
                Angezeigter Link: {scenario.displayedUrl}
              </small>
            </div>
          )}

          <p className="email-signature">
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