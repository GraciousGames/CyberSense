import { Router } from "express";

import {
  createScenario,
  deleteScenario,
  findAllScenarios,
  findScenarioById,
  updateScenario
} from "../repositories/scenarioRepository.js";
import {
  validateScenario
} from "../validation/scenarioValidation.js";

const router = Router();

function parseScenarioId(value) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

router.get("/", (request, response) => {
  const scenarios = findAllScenarios();

  response.status(200).json(scenarios);
});

router.post("/", (request, response) => {
  const errors = validateScenario(request.body);

  if (errors.length > 0) {
    return response.status(400).json({
      message: "The scenario data is invalid.",
      errors
    });
  }

  const scenario = createScenario(request.body);

  return response.status(201).json(scenario);
});

router.get("/:id", (request, response) => {
  const scenarioId = parseScenarioId(request.params.id);

  if (!scenarioId) {
    return response.status(400).json({
      message: "The scenario ID is invalid."
    });
  }

  const scenario = findScenarioById(scenarioId);

  if (!scenario) {
    return response.status(404).json({
      message: "Scenario not found."
    });
  }

  return response.status(200).json(scenario);
});

router.put("/:id", (request, response) => {
  const scenarioId = parseScenarioId(request.params.id);

  if (!scenarioId) {
    return response.status(400).json({
      message: "The scenario ID is invalid."
    });
  }

  const errors = validateScenario(request.body);

  if (errors.length > 0) {
    return response.status(400).json({
      message: "The scenario data is invalid.",
      errors
    });
  }

  const scenario = updateScenario(scenarioId, request.body);

  if (!scenario) {
    return response.status(404).json({
      message: "Scenario not found."
    });
  }

  return response.status(200).json(scenario);
});

router.delete("/:id", (request, response) => {
  const scenarioId = parseScenarioId(request.params.id);

  if (!scenarioId) {
    return response.status(400).json({
      message: "The scenario ID is invalid."
    });
  }

  if (!deleteScenario(scenarioId)) {
    return response.status(404).json({
      message: "Scenario not found."
    });
  }

  return response.status(204).send();
});

export default router;
