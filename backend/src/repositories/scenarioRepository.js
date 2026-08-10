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

export function createScenario(scenario) {
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

  database.exec("BEGIN TRANSACTION");

  try {
    const result = insertScenario.run(
      scenario.senderName.trim(),
      scenario.senderEmail.trim(),
      scenario.recipient.trim(),
      scenario.subject.trim(),
      scenario.date.trim(),
      scenario.greeting.trim(),
      JSON.stringify(
        scenario.paragraphs.map((paragraph) => paragraph.trim())
      ),
      scenario.actionText?.trim() || null,
      scenario.displayedUrl?.trim() || null,
      scenario.actualUrl?.trim() || null,
      scenario.signature.trim(),
      scenario.correctAnswer,
      scenario.explanation.trim()
    );

    const scenarioId = Number(result.lastInsertRowid);

    for (const clue of scenario.clues) {
      insertClue.run(
        scenarioId,
        clue.id.trim(),
        clue.title.trim(),
        clue.description.trim()
      );
    }

    database.exec("COMMIT");

    return findScenarioById(scenarioId);
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export function updateScenario(id, scenario) {
  if (!findScenarioById(id)) {
    return null;
  }

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

  database.exec("BEGIN TRANSACTION");

  try {
    updateScenarioStatement.run(
      scenario.senderName.trim(),
      scenario.senderEmail.trim(),
      scenario.recipient.trim(),
      scenario.subject.trim(),
      scenario.date.trim(),
      scenario.greeting.trim(),
      JSON.stringify(
        scenario.paragraphs.map((paragraph) => paragraph.trim())
      ),
      scenario.actionText?.trim() || null,
      scenario.displayedUrl?.trim() || null,
      scenario.actualUrl?.trim() || null,
      scenario.signature.trim(),
      scenario.correctAnswer,
      scenario.explanation.trim(),
      id
    );

    deleteClues.run(id);

    for (const clue of scenario.clues) {
      insertClue.run(
        id,
        clue.id.trim(),
        clue.title.trim(),
        clue.description.trim()
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
  const deleteStatement = database.prepare(`
    DELETE FROM scenarios
    WHERE id = ?
  `);

  const result = deleteStatement.run(id);

  return result.changes > 0;
}
