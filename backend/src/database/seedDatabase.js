import database from "./database.js";
import scenarios from "../data/scenarios.js";

export function seedDatabase() {
  const countStatement = database.prepare(`
    SELECT COUNT(*) AS amount
    FROM scenarios
  `);

  const result = countStatement.get();

  if (result.amount > 0) {
    return;
  }

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
    for (const scenario of scenarios) {
      const result = insertScenario.run(
        scenario.senderName,
        scenario.senderEmail,
        scenario.recipient,
        scenario.subject,
        scenario.date,
        scenario.greeting,
        JSON.stringify(scenario.paragraphs),
        scenario.actionText,
        scenario.displayedUrl,
        scenario.actualUrl,
        scenario.signature,
        scenario.correctAnswer,
        scenario.explanation
      );

      const scenarioId = Number(result.lastInsertRowid);

      for (const clue of scenario.clues) {
        insertClue.run(
          scenarioId,
          clue.id,
          clue.title,
          clue.description
        );
      }
    }

    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}