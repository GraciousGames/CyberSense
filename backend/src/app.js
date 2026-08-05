import express from "express";
import cors from "cors";

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
seedDatabase();

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

app.listen(port, () => {
  console.log(
    `Backend läuft auf http://localhost:${port}`
  );
});