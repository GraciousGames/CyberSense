import { useState } from "react";

function CluePanel({ clues }) {
  const [openClueIds, setOpenClueIds] = useState([]);

  function toggleClue(clueId) {
    setOpenClueIds((currentIds) =>
      currentIds.includes(clueId)
        ? currentIds.filter((id) => id !== clueId)
        : [...currentIds, clueId]
    );
  }

  return (
    <section className="clue-panel mt-4">
      <div className="clue-panel-header">
        <div>
          <h2 className="h4 mb-1">
            Hinweise in dieser Nachricht
          </h2>

          <p className="text-secondary mb-0">
            Öffne die Hinweise, um die Bewertung nachzuvollziehen.
          </p>
        </div>

        <span className="clue-count">
          {clues.length} Hinweise
        </span>
      </div>

      <div className="clue-list">
        {clues.map((clue, index) => {
          const isOpen = openClueIds.includes(clue.id);

          return (
            <article className="clue-item" key={clue.id}>
              <button
                className="clue-button"
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleClue(clue.id)}
              >
                <span className="clue-number">
                  {index + 1}
                </span>

                <span>{clue.title}</span>

                <span className="clue-arrow" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="clue-description">
                  {clue.description}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CluePanel;