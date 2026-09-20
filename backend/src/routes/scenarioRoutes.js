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


// Zulässige Klassifikationen eines Trainingsszenarios.
const allowedAnswers = [
  "legitim",
  "phishing"
];


// ---------------------------------------------------------
// Szenariodaten validieren
// ---------------------------------------------------------

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

  // Pflichtfelder müssen vorhanden sein.
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

  // Absätze werden von der API immer als Array erwartet.
  if (!Array.isArray(paragraphs)) {
    response.status(400).json({
      error: "Paragraphs must be an array."
    });

    return false;
  }

  // Ein Szenario darf nur legitim oder Phishing sein.
  if (!allowedAnswers.includes(correctAnswer)) {
    response.status(400).json({
      error: "Invalid correct answer."
    });

    return false;
  }

  // Hinweise sind optional, müssen aber als Array vorliegen.
  if (
      clues !== undefined &&
      !Array.isArray(clues)
  ) {
    response.status(400).json({
      error: "Clues must be an array."
    });

    return false;
  }

  return true;
}


// ---------------------------------------------------------
// Szenario-ID aus der URL prüfen
// ---------------------------------------------------------

function parseScenarioId(request, response) {
  const scenarioId =
      Number(request.params.id);

  if (
      !Number.isInteger(scenarioId) ||
      scenarioId <= 0
  ) {
    response.status(400).json({
      error: "Invalid scenario ID."
    });

    return null;
  }

  return scenarioId;
}


// ---------------------------------------------------------
// GET /api/scenarios
// Alle Szenarien laden
// ---------------------------------------------------------

router.get("/", (request, response) => {
  const scenarios =
      findAllScenarios();

  return response.status(200).json(
      scenarios
  );
});


// ---------------------------------------------------------
// POST /api/scenarios
// Neues Szenario erstellen
// ---------------------------------------------------------

router.post(
    "/",
    requireAdmin,
    (request, response) => {
      if (!validateScenario(request, response)) {
        return;
      }

      const newScenario =
          createScenario(request.body);

      return response.status(201).json(
          newScenario
      );
    }
);


// ---------------------------------------------------------
// PUT /api/scenarios/:id
// Szenario bearbeiten
// ---------------------------------------------------------

router.put(
    "/:id",
    requireAdmin,
    (request, response) => {
      const scenarioId =
          parseScenarioId(request, response);

      if (scenarioId === null) {
        return;
      }

      if (!validateScenario(request, response)) {
        return;
      }

      const updatedScenario =
          updateScenario(
              scenarioId,
              request.body
          );

      if (!updatedScenario) {
        return response.status(404).json({
          error: "Scenario not found."
        });
      }

      return response.status(200).json(
          updatedScenario
      );
    }
);


// ---------------------------------------------------------
// DELETE /api/scenarios/:id
// Szenario löschen
// ---------------------------------------------------------

router.delete(
    "/:id",
    requireAdmin,
    (request, response) => {
      const scenarioId =
          parseScenarioId(request, response);

      if (scenarioId === null) {
        return;
      }

      const deleted =
          deleteScenario(scenarioId);

      if (!deleted) {
        return response.status(404).json({
          error: "Scenario not found."
        });
      }

      return response.status(200).json({
        message: "Scenario deleted successfully."
      });
    }
);


// ---------------------------------------------------------
// GET /api/scenarios/:id
// Einzelnes Szenario laden
// ---------------------------------------------------------

router.get("/:id", (request, response) => {
  const scenarioId =
      parseScenarioId(request, response);

  if (scenarioId === null) {
    return;
  }

  const scenario =
      findScenarioById(scenarioId);

  if (!scenario) {
    return response.status(404).json({
      error: "Scenario not found."
    });
  }

  return response.status(200).json(
      scenario
  );
});


export default router;