import prisma from "../src/lib/prisma.js"; 
async function main() {
  await prisma.tarea.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      titulo: "Desplegar aplicación en Render",
      descripcion: "Tarea inicial generada automáticamente",
      completada: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
