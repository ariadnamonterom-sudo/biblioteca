import { useState } from "react";
 
function TareaForm({ onCrear }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
 
  async function manejarSubmit(evento) {
    evento.preventDefault();
    setEnviando(true);
    const creada = await onCrear({ titulo: titulo.trim(), descripcion });
    setEnviando(false);
    if (creada) {
      setTitulo("");
      setDescripcion("");
    }
  }
 
  return (
    <form onSubmit={manejarSubmit}>
      <h2>Nueva tarea</h2>
      <label>
        Título
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          minLength={3}
        />
      </label>
      <label>
        Descripción
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>
      <button type="submit" disabled={enviando}>
        {enviando ? "Creando..." : "Crear tarea"}
      </button>
    </form>
  );
}
 
export default TareaForm;
