import { useCallback, useEffect, useState } from "react";

import TareaItem from "./components/TareaItem";
import { obtenerTareas, crearTarea, modificarTarea, eliminarTarea }
  from "./services/tareasApi";
import TareaForm from "./components/TareaForm";

 
function App() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
 
  const cargarTareas = useCallback(async () => {
    try {
      setErrorCarga("");
      setTareas(await obtenerTareas());
    } catch (err) {
      setErrorCarga(err.message);
    }
  }, []);
 
  useEffect(() => {
    cargarTareas().finally(() => setCargando(false));
  }, [cargarTareas]);
 
  function reintentar() {
    setCargando(true);
    cargarTareas().finally(() => setCargando(false));
  }
  const [aviso, setAviso] = useState(null);   // { tipo: "ok" | "error", texto }
 
function mostrarAviso(tipo, texto) {
  setAviso({ tipo, texto });
}
 
async function manejarCrear(datos) {
  try {
    const nueva = await crearTarea(datos);
    setTareas((actuales) => [...actuales, nueva]);   // copia nueva, sin push
    mostrarAviso("ok", "Tarea creada");
    return true;                                      // el formulario se vacía
  } catch (err) {
    mostrarAviso("error", err.message);
    return false;                                     // conserva lo escrito
  }
  
}
async function manejarCambiarEstado(tarea) {
  const cambios = { completada: !tarea.completada };
  try {
    const actualizada = await modificarTarea(tarea.id, cambios);
    setTareas((actuales) =>
      actuales.map((t) =>
        // copia nueva; si la API no devuelve la tarea, aplicamos el cambio local
        t.id === tarea.id ? { ...t, ...cambios, ...actualizada } : t
      )
    );
    mostrarAviso("ok", "Tarea actualizada");
  } catch (err) {
    mostrarAviso("error", err.message);
  }
}
async function manejarEliminar(id) {
  if (!window.confirm("¿Eliminar esta tarea?")) return;
  try {
    await eliminarTarea(id);
    setTareas((actuales) => actuales.filter((t) => t.id !== id));
    mostrarAviso("ok", "Tarea eliminada");
  } catch (err) {
    mostrarAviso("error", err.message);
  }
}
const [apiKey, setApiKey] = useState(
  () => sessionStorage.getItem("apiKey") ?? ""
);
 
function guardarApiKey() {
  sessionStorage.setItem("apiKey", apiKey);
  mostrarAviso("ok", "Clave guardada durante la sesión");
}
 
  return (
    <main>
      <h1>Gestor de tareas</h1>
      {cargando && <p>Cargando...</p>}
      {!cargando && errorCarga && (
        <div role="alert">
          <p>{errorCarga}</p>
          <button onClick={reintentar}>Reintentar</button>
        </div>
      )}
      {!cargando && !errorCarga && tareas.length === 0 && <p>No hay tareas.</p>}
 
{!cargando && !errorCarga && tareas.map((tarea) => (
  <TareaItem
    key={tarea.id}
    tarea={tarea}
    onCambiarEstado={manejarCambiarEstado}
    onEliminar={manejarEliminar}
  />
))}
{aviso && (
  <p className={`aviso aviso-${aviso.tipo}`} role="status">
    {aviso.texto}
  </p>
)}
 <section>
  <h2>Acceso a operaciones protegidas</h2>
  <input
    type="password"
    value={apiKey}
    onChange={(e) => setApiKey(e.target.value)}
    placeholder="API key"
  />
  <button onClick={guardarApiKey}>Guardar durante la sesión</button>
</section>

<TareaForm onCrear={manejarCrear} />
    </main>
  );
}






 
export default App;
