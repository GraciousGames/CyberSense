import database from "../database/database.js";

function mapScenario(row) {
  const selectCluesByScenarioId = database.prepare(`
    SELECT
      clue_key,
      title,
      description
    FROM clues
    WHERE scenario_id = ?
    ORDER BY id
  `);

  const clues = selectCluesByScenarioId
    .all(row.id)
    .map((clue) => ({
      id: clue.clue_key,
      title: clue.title,
      description: clue.description
    }));

  return {
    id: row.id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    recipient: row.recipient,
    subject: row.subject,
    date: row.sent_at,
    greeting: row.greeting,
    paragraphs: JSON.parse(row.paragraphs),
    actionText: row.action_text,
    displayedUrl: row.displayed_url,
    actualUrl: row.actual_url,
    signature: row.signature,
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    clues
  };
}

export function findAllScenarios() {
  const selectAllScenarios = database.prepare(`
    SELECT
      id,
      sender_name,
      sender_email,
      recipient,
      subject,
      sent_at,
      greeting,
      paragraphs,
      action_text,
      displayed_url,
      actual_url,
      signature,
      correct_answer,
      explanation
    FROM scenarios
    ORDER BY id
  `);

  return selectAllScenarios
    .all()
    .map(mapScenario);
}

export function findScenarioById(id) {
  const selectScenarioById = database.prepare(`
    SELECT
      id,
      sender_name,
      sender_email,
      recipient,
      subject,
      sent_at,
      greeting,
      paragraphs,
      action_text,
      displayed_url,
      actual_url,
      signature,
      correct_answer,
      explanation
    FROM scenarios
    WHERE id = ?
  `);

  const row = selectScenarioById.get(id);

  if (!row) {
    return null;
  }

  return mapScenario(row);
}