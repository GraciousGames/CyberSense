const validAnswers = new Set([
  "legitim",
  "suspicious",
  "phishing"
]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value) {
  return value === null || typeof value === "string";
}

export function validateScenario(input) {
  const errors = [];

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return ["The request body must be a JSON object."];
  }

  const requiredStringFields = [
    ["senderName", "Sender name"],
    ["senderEmail", "Sender email"],
    ["recipient", "Recipient"],
    ["subject", "Subject"],
    ["date", "Date"],
    ["greeting", "Greeting"],
    ["signature", "Signature"],
    ["explanation", "Explanation"]
  ];

  for (const [field, label] of requiredStringFields) {
    if (!isNonEmptyString(input[field])) {
      errors.push(`${label} is required.`);
    }
  }

  if (
    !Array.isArray(input.paragraphs) ||
    input.paragraphs.length === 0 ||
    input.paragraphs.some((paragraph) => !isNonEmptyString(paragraph))
  ) {
    errors.push("At least one non-empty paragraph is required.");
  }

  if (!validAnswers.has(input.correctAnswer)) {
    errors.push(
      "Correct answer must be legitim, suspicious, or phishing."
    );
  }

  for (const field of ["actionText", "displayedUrl", "actualUrl"]) {
    if (!isOptionalString(input[field])) {
      errors.push(`${field} must be a string or null.`);
    }
  }

  if (!Array.isArray(input.clues) || input.clues.length === 0) {
    errors.push("At least one clue is required.");
  } else {
    input.clues.forEach((clue, index) => {
      if (!clue || typeof clue !== "object") {
        errors.push(`Clue ${index + 1} must be an object.`);
        return;
      }

      if (!isNonEmptyString(clue.id)) {
        errors.push(`Clue ${index + 1} requires an id.`);
      }

      if (!isNonEmptyString(clue.title)) {
        errors.push(`Clue ${index + 1} requires a title.`);
      }

      if (!isNonEmptyString(clue.description)) {
        errors.push(`Clue ${index + 1} requires a description.`);
      }
    });
  }

  return errors;
}
