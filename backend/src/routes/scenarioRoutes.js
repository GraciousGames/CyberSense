import { Router } from "express";

import {
  createScenario,
  deleteScenario,
  findAllScenarios,
  findScenarioById,
  updateScenario
} from "../repositories/scenarioRepository.js";

import {
  requireAdmin
} from "../middleware/authMiddleware.js";

const router = Router();

function validateScenario(request, response) {
  const {
    senderName,
    senderEmail,
    recipient,
    subject,
    date,
    greeting,
    paragraphs,
    signature,
    correctAnswer,
    explanation,
    clues
  } = request.body;

  if (
      !senderName ||
      !senderEmail ||
      !recipient ||
      !subject ||
      !date ||
      !greeting ||
      !signature ||
      !correctAnswer ||
      !explanation
  ) {
    response.status(400).json({
      error: "Required scenario fields are missing."
    });

    return false;
  }

  if (!Array.isArray(paragraphs)) {
    response.status(400).json({
      error: "Paragraphs must be an array."
    });

    return false;
  }

  if (
      !["legitim", "suspicious", "phishing"].includes(correctAnswer)
  ) {
    response.status(400).json({
      error: "Invalid correct answer."
    });

    return false;
  }

  if (clues !== undefined && !Array.isArray(clues)) {
    response.status(400).json({
      error: "Clues must be an array."
    });

    return false;
  }

  return true;
}

function parseScenarioId(request, response) {
  const scenarioId = Number(request.params.id);

  if (!Number.isInteger(scenarioId) || scenarioId <= 0) {
    response.status(400).json({
      error: "Invalid scenario ID."
    });

    return null;
  }

  return scenarioId;
}

router.get("/", (request, response) => {
  const scenarios = findAllScenarios();

  return response.status(200).json(scenarios);
});

router.get("/admin/test", requireAdmin, (request, response) => {
  return response.status(200).json({
    message: "Admin access granted."
  });
});

router.post("/", requireAdmin, (request, response) => {
  if (!validateScenario(request, response)) {
    return;
  }

  const newScenario = createScenario(request.body);

  return response.status(201).json(newScenario);
});

router.put("/:id", requireAdmin, (request, response) => {
  const scenarioId = parseScenarioId(request, response);

  if (scenarioId === null) {
    return;
  }

  if (!validateScenario(request, response)) {
    return;
  }

  const updatedScenario = updateScenario(
      scenarioId,
      request.body
  );

  if (!updatedScenario) {
    return response.status(404).json({
      error: "Scenario not found."
    });
  }

  return response.status(200).json(updatedScenario);
});

router.delete("/:id", requireAdmin, (request, response) => {
  const scenarioId = parseScenarioId(request, response);

  if (scenarioId === null) {
    return;
  }

  const deleted = deleteScenario(scenarioId);

  if (!deleted) {
    return response.status(404).json({
      error: "Scenario not found."
    });
  }

  return response.status(200).json({
    message: "Scenario deleted successfully."
  });
});

router.get("/:id", (request, response) => {
  const scenarioId = parseScenarioId(request, response);

  if (scenarioId === null) {
    return;
  }

  const scenario = findScenarioById(scenarioId);

  if (!scenario) {
    return response.status(404).json({
      error: "Scenario not found."
    });
  }

  return response.status(200).json(scenario);
});

export default router;