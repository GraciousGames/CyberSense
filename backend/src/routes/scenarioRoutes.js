import { Router } from "express";

import {
  findAllScenarios,
  findScenarioById
} from "../repositories/scenarioRepository.js";

const router = Router();

router.get("/", (request, response) => {
  const scenarios = findAllScenarios();

  response.status(200).json(scenarios);
});

router.get("/:id", (request, response) => {
  const scenarioId = Number(request.params.id);

  if (!Number.isInteger(scenarioId) || scenarioId <= 0) {
    return response.status(400).json({
      message: "Die Szenario-ID ist ungültig."
    });
  }

  const scenario = findScenarioById(scenarioId);

  if (!scenario) {
    return response.status(404).json({
      message: "Szenario wurde nicht gefunden."
    });
  }

  return response.status(200).json(scenario);
});

export default router;