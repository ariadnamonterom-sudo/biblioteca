import prisma from "../lib/prisma.js";

export async function listarTareas(req, res) {
  try {
    const tareas = await prisma.tarea.findMany({
      orderBy: { id: "asc" }
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener las tareas" });
  }
}

export async function obtenerTarea(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const tarea = await prisma.tarea.findUnique({
      where: { id }
    });

    if (!tarea) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener la tarea" });
  }
}

export async function crearTarea(req, res) {
  try {
    const { titulo, descripcion } = req.body;

    const tarea = await prisma.tarea.create({
      data: {
        titulo: titulo.trim(),
        descripcion: descripcion?.trim() || null
      }
    });

    res.status(201).json(tarea);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear la tarea" });
  }
}

export async function actualizarTarea(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.tarea.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    const { titulo, descripcion, completada } = req.body;
    const datos = {};

    if (titulo !== undefined) {
      if (typeof titulo !== "string" || titulo.trim().length < 3) {
        return res.status(400).json({
          error: "El titulo debe tener al menos 3 caracteres"
        });
      }
      datos.titulo = titulo.trim();
    }

    if (descripcion !== undefined) {
      datos.descripcion =
        typeof descripcion === "string" && descripcion.trim()
          ? descripcion.trim()
          : null;
    }

    if (completada !== undefined) {
      if (typeof completada !== "boolean") {
        return res.status(400).json({
          error: "completada debe ser true o false"
        });
      }
      datos.completada = completada;
    }

    const tarea = await prisma.tarea.update({
      where: { id },
      data: datos
    });

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar la tarea" });
  }
}

export async function eliminarTarea(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.tarea.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    await prisma.tarea.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar la tarea" });
  }
}