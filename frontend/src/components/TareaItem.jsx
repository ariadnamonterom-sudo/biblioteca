function TareaItem({ tarea, onCambiarEstado, onEliminar }) {
  return (
    <article>
      <h3>{tarea.titulo}</h3>
      {tarea.descripcion && <p>{tarea.descripcion}</p>}
      <p>Estado: {tarea.completada ? "Completada" : "Pendiente"}</p>
      <button onClick={() => onCambiarEstado(tarea)}>
        {tarea.completada ? "Reabrir" : "Completar"}
      </button>
      <button onClick={() => onEliminar(tarea.id)}>Eliminar</button>
    </article>
  );
}
 
export default TareaItem;
