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

export function createScenario({
                                 senderName,
                                 senderEmail,
                                 recipient,
                                 subject,
                                 date,
                                 greeting,
                                 paragraphs,
                                 actionText,
                                 displayedUrl,
                                 actualUrl,
                                 signature,
                                 correctAnswer,
                                 explanation,
                                 clues = []
                               }) {
  const insertScenario = database.prepare(`
    INSERT INTO scenarios (
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
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertClue = database.prepare(`
    INSERT INTO clues (
      scenario_id,
      clue_key,
      title,
      description
    )
    VALUES (?, ?, ?, ?)
  `);

  try {
    database.exec("BEGIN");

    const result = insertScenario.run(
        senderName,
        senderEmail,
        recipient,
        subject,
        date,
        greeting,
        JSON.stringify(paragraphs),
        actionText ?? null,
        displayedUrl ?? null,
        actualUrl ?? null,
        signature,
        correctAnswer,
        explanation
    );

    const scenarioId = Number(result.lastInsertRowid);

    for (const clue of clues) {
      insertClue.run(
          scenarioId,
          clue.id,
          clue.title,
          clue.description
      );
    }

    database.exec("COMMIT");

    return findScenarioById(scenarioId);
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export function updateScenario(id, {
  senderName,
  senderEmail,
  recipient,
  subject,
  date,
  greeting,
  paragraphs,
  actionText,
  displayedUrl,
  actualUrl,
  signature,
  correctAnswer,
  explanation,
  clues = []
}) {
  const updateScenarioStatement = database.prepare(`
    UPDATE scenarios
    SET
      sender_name = ?,
      sender_email = ?,
      recipient = ?,
      subject = ?,
      sent_at = ?,
      greeting = ?,
      paragraphs = ?,
      action_text = ?,
      displayed_url = ?,
      actual_url = ?,
      signature = ?,
      correct_answer = ?,
      explanation = ?
    WHERE id = ?
  `);

  const deleteClues = database.prepare(`
    DELETE FROM clues
    WHERE scenario_id = ?
  `);

  const insertClue = database.prepare(`
    INSERT INTO clues (
      scenario_id,
      clue_key,
      title,
      description
    )
    VALUES (?, ?, ?, ?)
  `);

  try {
    database.exec("BEGIN");

    const result = updateScenarioStatement.run(
        senderName,
        senderEmail,
        recipient,
        subject,
        date,
        greeting,
        JSON.stringify(paragraphs),
        actionText ?? null,
        displayedUrl ?? null,
        actualUrl ?? null,
        signature,
        correctAnswer,
        explanation,
        id
    );

    if (result.changes === 0) {
      database.exec("ROLLBACK");
      return null;
    }

    deleteClues.run(id);

    for (const clue of clues) {
      insertClue.run(
          id,
          clue.id,
          clue.title,
          clue.description
      );
    }

    database.exec("COMMIT");

    return findScenarioById(id);
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export function deleteScenario(id) {
  const deleteScenarioStatement = database.prepare(`
    DELETE FROM scenarios
    WHERE id = ?
  `);

  const result = deleteScenarioStatement.run(id);

  return result.changes > 0;
}