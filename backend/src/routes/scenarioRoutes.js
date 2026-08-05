import { Router } from "express";
import scenarios from "../data/scenarios.js";

const router = Router();

router.get("/", (request, response) => {
  response.status(200).json(scenarios);
});

router.get("/:id", (request, response) => {
  const scenarioId = Number(request.params.id);

  const scenario = scenarios.find(
    (currentScenario) => currentScenario.id === scenarioId
  );

  if (!scenario) {
    return response.status(404).json({
      message: "Szenario wurde nicht gefunden."
    });
  }

  return response.status(200).json(scenario);
});

export default router;