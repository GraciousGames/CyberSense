import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const testDirectory = mkdtempSync(join(tmpdir(), "cybersense-test-"));
process.env.CYBERSENSE_DATABASE_PATH = join(
  testDirectory,
  "cybersense.sqlite"
);

const { initDatabase } = await import(
  "../src/database/initDatabase.js"
);
const { default: database } = await import(
  "../src/database/database.js"
);
const {
  createScenario,
  deleteScenario,
  findScenarioById,
  updateScenario
} = await import("../src/repositories/scenarioRepository.js");
const { validateScenario } = await import(
  "../src/validation/scenarioValidation.js"
);

initDatabase();

after(() => {
  database.close();
  rmSync(testDirectory, { recursive: true, force: true });
});

function createScenarioInput() {
  return {
    senderName: "Security Team",
    senderEmail: "security@example.com",
    recipient: "learner@example.com",
    subject: "Original subject",
    date: "Today, 10:00",
    greeting: "Hello,",
    paragraphs: ["First paragraph.", "Second paragraph."],
    actionText: null,
    displayedUrl: null,
    actualUrl: null,
    signature: "Security Team",
    correctAnswer: "legitim",
    explanation: "This is a CRUD test scenario.",
    clues: [
      {
        id: "sender",
        title: "Sender address",
        description: "The sender uses the expected domain."
      }
    ]
  };
}

test("scenario CRUD lifecycle", () => {
  const createdScenario = createScenario(createScenarioInput());

  assert.equal(createdScenario.subject, "Original subject");
  assert.equal(createdScenario.clues.length, 1);

  const storedScenario = findScenarioById(createdScenario.id);
  assert.deepEqual(storedScenario, createdScenario);

  const updateInput = {
    ...createScenarioInput(),
    subject: "Updated subject",
    paragraphs: ["Updated paragraph."],
    correctAnswer: "suspicious",
    clues: [
      {
        id: "sender",
        title: "Updated clue",
        description: "Updated description."
      },
      {
        id: "content",
        title: "Content clue",
        description: "A second clue."
      }
    ]
  };

  const updatedScenario = updateScenario(
    createdScenario.id,
    updateInput
  );

  assert.equal(updatedScenario.subject, "Updated subject");
  assert.equal(updatedScenario.correctAnswer, "suspicious");
  assert.equal(updatedScenario.paragraphs.length, 1);
  assert.equal(updatedScenario.clues.length, 2);

  assert.equal(deleteScenario(createdScenario.id), true);
  assert.equal(findScenarioById(createdScenario.id), null);

  const remainingClues = database.prepare(`
    SELECT COUNT(*) AS amount
    FROM clues
    WHERE scenario_id = ?
  `).get(createdScenario.id);

  assert.equal(remainingClues.amount, 0);
});

test("invalid scenario data is rejected by validation", () => {
  const errors = validateScenario({});

  assert.ok(errors.length > 0);
  assert.ok(errors.includes("Sender name is required."));
  assert.ok(errors.includes("At least one clue is required."));
});

test("updates and deletes report missing scenarios", () => {
  assert.equal(updateScenario(9999, createScenarioInput()), null);
  assert.equal(deleteScenario(9999), false);
});
