import express from "express";
import cors from "cors";
import tareasRouter from "./routes/tareas.routes.js";
import { logger } from "./middleware/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

const origenes = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(cors({ origin: origenes }));
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({ estado: "ok" });
});

app.use("/api/tareas", tareasRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
