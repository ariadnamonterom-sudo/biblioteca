import { Router } from "express";
import {
  listarTareas,
  obtenerTarea,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from "../controllers/tareas.controller.js";
import { validarTarea } from "../middleware/validarTarea.js";
import { comprobarApiKey } from "../middleware/apiKey.js";

const router = Router();

router.get("/", listarTareas);
router.get("/:id", obtenerTarea);
router.post("/", comprobarApiKey, validarTarea, crearTarea);
router.patch("/:id", comprobarApiKey, actualizarTarea);
router.delete("/:id", comprobarApiKey, eliminarTarea);

export default router;
