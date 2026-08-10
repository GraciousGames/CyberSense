import express from "express";
import cors from "cors";
import { pathToFileURL } from "node:url";

import {
  initDatabase
} from "./database/initDatabase.js";

import {
  seedDatabase
} from "./database/seedDatabase.js";

import scenarioRoutes from "./routes/scenarioRoutes.js";

const app = express();
const port = 3000;

initDatabase();

if (process.env.CYBERSENSE_SEED_DATABASE !== "false") {
  seedDatabase();
}

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

app.get("/api/health", (request, response) => {
  response.status(200).json({
    status: "ok",
    message: "CyberSense-Backend läuft."
  });
});

app.use("/api/scenarios", scenarioRoutes);

app.use((request, response) => {
  response.status(404).json({
    message: "Endpunkt wurde nicht gefunden."
  });
});

app.use((error, request, response, next) => {
  console.error(error);

  if (response.headersSent) {
    return next(error);
  }

  return response.status(500).json({
    message: "An unexpected server error occurred."
  });
});

const entryFileUrl = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : "";

if (import.meta.url === entryFileUrl) {
  app.listen(port, () => {
    console.log(
      `Backend läuft auf http://localhost:${port}/api/scenarios.`
    );
  });
}

export default app;
