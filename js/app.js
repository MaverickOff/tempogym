/**
 * @fileoverview Lógica central de TempoGym.
 * Conecta la interfaz de usuario (DOM) con los datos y el audio.
 */

// --- 1. IMPORTACIONES ---
// Traemos las funciones específicas que necesitamos de nuestros módulos.
import { rutinasPresets } from "./modules/data.js";
import {
  audioCtx,
  emitirPitido,
  emitirSonidoFin,
  anunciarUltimaRepeticion,
} from "./modules/audio.js";

// Esperamos a que todo el HTML esté cargado antes de ejecutar Javascript
document.addEventListener("DOMContentLoaded", () => {
  // --- 2. REFERENCIAS AL DOM ---
  // Guardamos los elementos de la pantalla en variables para no tener que buscarlos continuamente.
  const presetSelector = document.getElementById("preset-selector");
  const btnEmpezar = document.getElementById("btnEmpezar");
  const btnPausar = document.getElementById("btnPausar");
  const displayReps = document.getElementById("display-reps");
  const displayFase = document.getElementById("display-fase");
  const displayTiempo = document.getElementById("display-tiempo");
  const displayMensaje = document.getElementById("display-mensaje");
  const inputsNumericos = document.querySelectorAll(
    '.config-card input[type="number"]',
  );

  // --- 3. ESTADO GLOBAL ---
  // Variables que recuerdan en qué punto de la aplicación estamos.
  let estaPausado = false;
  let ejecucionActiva = false;
  let textoRepeticionActual = "";

  // --- 4. CARGA DE PRESETS ---
  // Escucha cuando el usuario cambia la opción en el menú desplegable.
  presetSelector.addEventListener("change", (e) => {
    const rutinaId = e.target.value; // Ej: 'ub1_db_bench'
    const datos = rutinasPresets[rutinaId]; // Buscamos esos datos en nuestro archivo data.js

    if (datos) {
      // Rellenamos los inputs de la pantalla con los datos cargados
      document.getElementById("reps").value = datos.reps;
      document.getElementById("fase_bajada").value = datos.bajada;
      document.getElementById("fase_fondo").value = datos.fondo;
      document.getElementById("fase_subida").value = datos.subida;
      document.getElementById("fase_contraccion").value = datos.cima;

      // Animación visual (escala ligeramente hacia abajo y luego recupera su tamaño)
      const cards = document.querySelectorAll(".config-card");
      cards.forEach((card) => {
        card.style.transform = "scale(0.95)";
        setTimeout(() => (card.style.transform = "scale(1)"), 150);
      });

      // Oculta el teclado/menú nativo del móvil tras seleccionar
      presetSelector.blur();
    }
  });

  // --- 5. FUNCIONES DE TIEMPO Y UI ---

  /**
   * Crea una pausa exacta de 1 segundo.
   * Usamos Promesas para que el código asíncrono (async/await) espere sin bloquear el navegador.
   */
  const esperarSegundo = () =>
    new Promise((resolve) => setTimeout(resolve, 1000));

  /**
   * Alterna qué textos gigantes se ven en el centro de la pantalla.
   */
  const gestionarVisibilidadDisplay = (modoActivo, mensajeFinal = "") => {
    if (modoActivo) {
      displayMensaje.style.display = "none";
      displayReps.style.display = "inline-block";
      displayFase.style.display = "block";
      displayTiempo.style.display = "block";
    } else {
      displayReps.style.display = "none";
      displayFase.style.display = "none";
      displayTiempo.style.display = "none";
      displayMensaje.style.display = "block";
      // Cambia a rojo si el mensaje incluye la palabra "Error", verde si es éxito.
      displayMensaje.className = mensajeFinal.includes("Error")
        ? "text-danger font-weight-bold"
        : "text-success font-weight-bold";
      displayMensaje.textContent = mensajeFinal || "Configura tu serie";
      displayMensaje.style.fontSize = "1.5rem";
    }
  };

  /**
   * El corazón del cronómetro. Devuelve 'true' si terminó limpia,
   * o 'false' si el usuario pausó la aplicación a la mitad.
   */
  const ejecutarFase = async (nombreFase, segundos, configAudio) => {
    if (segundos <= 0) return true; // Si es 0s, se completa al instante

    displayFase.textContent = nombreFase;
    displayReps.textContent = textoRepeticionActual;

    for (let i = segundos; i > 0; i--) {
      if (estaPausado) {
        // Se queda atrapado aquí esperando a que pulses reanudar
        while (estaPausado) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        // ¡El usuario ha reanudado! Cancelamos la fase actual devolviendo false
        return false;
      }

      emitirPitido(
        configAudio.frecuencia,
        configAudio.duracion,
        configAudio.onda,
      );
      displayTiempo.textContent = `${i}s`;
      await esperarSegundo();
    }
    return true; // Fase completada entera sin pausas
  };

  // --- 6. GESTIÓN TÁCTIL (Deslizar para cambiar números) ---
  inputsNumericos.forEach((input) => {
    let isDragging = false;
    let startY = 0;
    let startValue = 0;

    // Cuando el usuario toca el input...
    input.addEventListener("pointerdown", (e) => {
      isDragging = true;
      startY = e.clientY; // Guarda la posición inicial del dedo en el eje Y (vertical)
      startValue = parseInt(input.value) || 0;
      input.setPointerCapture(e.pointerId); // Evita que la pantalla haga scroll al arrastrar
      input.blur(); // Oculta el teclado del móvil
      e.preventDefault();
    });

    // Mientras arrastra el dedo...
    input.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const diferencia = startY - e.clientY;
      const sensibilidad = 25; // Cuántos píxeles hay que mover el dedo para cambiar 1 número
      const cambioAproximado = Math.floor(diferencia / sensibilidad);

      let nuevoValor = startValue + cambioAproximado;

      // Límites: No permite bajar de 0 ni subir del máximo establecido en el HTML (max="60")
      const max = parseInt(input.getAttribute("max")) || 100;
      if (nuevoValor < 0) nuevoValor = 0;
      if (nuevoValor > max) nuevoValor = max;

      input.value = nuevoValor;
    });

    // Al levantar el dedo...
    const stopDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        input.releasePointerCapture(e.pointerId);
      }
    };

    input.addEventListener("pointerup", stopDrag);
    input.addEventListener("pointercancel", stopDrag);
  });

  // --- 7. BOTONES PRINCIPALES ---

  btnPausar.addEventListener("click", () => {
    estaPausado = !estaPausado;
    btnPausar.value = estaPausado ? "Reanudar" : "Pausar";

    if (estaPausado) {
      btnPausar.classList.replace("btn-warning", "btn-success");
      displayFase.textContent = "⏸️ EN PAUSA"; // Feedback visual instantáneo
    } else {
      btnPausar.classList.replace("btn-success", "btn-warning");
    }
  });

  btnEmpezar.addEventListener("click", async () => {
    if (ejecucionActiva) return; // Evita que empiece dos veces si haces doble clic

    // Despierta el motor de audio (requerimiento estricto de navegadores móviles)
    if (audioCtx.state === "suspended") audioCtx.resume();

    // Lee los números actuales en pantalla y evita que pasen de ciertos límites de seguridad
    const prep = Math.min(
      parseInt(document.getElementById("fase_prep").value) || 0,
      60,
    );
    const bajada = Math.min(
      parseInt(document.getElementById("fase_bajada").value) || 0,
      60,
    );
    const fondo = Math.min(
      parseInt(document.getElementById("fase_fondo").value) || 0,
      60,
    );
    const subida = Math.min(
      parseInt(document.getElementById("fase_subida").value) || 0,
      60,
    );
    const contra = Math.min(
      parseInt(document.getElementById("fase_contraccion").value) || 0,
      60,
    );
    const reps = Math.min(
      parseInt(document.getElementById("reps").value) || 0,
      100,
    );

    if (reps <= 0) {
      gestionarVisibilidadDisplay(false, "Error: Añade al menos 1 repetición.");
      return;
    }

    // Configuración inicial de botones
    ejecucionActiva = true;
    btnEmpezar.disabled = true;
    btnPausar.disabled = false;
    btnPausar.value = "Pausar";
    btnPausar.classList.remove("btn-success");
    btnPausar.classList.add("btn-warning");

    gestionarVisibilidadDisplay(true);

    // --- FASE 1 y 2: Bucle inteligente ---
    let r = 1; // Contador de repeticiones
    let necesitaPrep = true;

    while (r <= reps && ejecucionActiva) {
      // Si acabamos de reanudar (o es el inicio), hacemos la fase de preparación
      if (necesitaPrep) {
        textoRepeticionActual = "Preparación";
        let prepCompletada = await ejecutarFase("⏳ Prepárate", prep, {
          frecuencia: 600,
          duracion: 0.1,
          onda: "sine",
        });

        if (!prepCompletada) continue; // Si pausó durante la prep, vuelve al inicio del while
        necesitaPrep = false;
      }

      textoRepeticionActual = `Repetición ${r} de ${reps}`;
      // Si es la última repetición (y hay más de 1), avisa por voz
      if (r === reps && reps > 1) anunciarUltimaRepeticion();

      // Ejecuta cada fase. Si alguna devuelve 'false' (fue pausada), activamos necesitaPrep
      // y usamos 'continue' para abortar esta repetición y empezarla de cero.

      let completado = await ejecutarFase("⬇️ BAJANDO", bajada, {
        frecuencia: 300,
        duracion: 0.3,
        onda: "triangle",
      });
      if (!completado) {
        necesitaPrep = true;
        continue;
      }

      completado = await ejecutarFase("⏸️ FONDO", fondo, {
        frecuencia: 150,
        duracion: 0.05,
        onda: "square",
      });
      if (!completado) {
        necesitaPrep = true;
        continue;
      }

      completado = await ejecutarFase("⬆️ SUBIENDO", subida, {
        frecuencia: 500,
        duracion: 0.2,
        onda: "sawtooth",
      });
      if (!completado) {
        necesitaPrep = true;
        continue;
      }

      completado = await ejecutarFase("💪 CONTRAE", contra, {
        frecuencia: 900,
        duracion: 0.08,
        onda: "sine",
      });
      if (!completado) {
        necesitaPrep = true;
        continue;
      }

      // Solo suma 1 a la repetición si TODAS las fases se hicieron del tirón
      r++;
    }

    // FASE 3: Finalización y limpieza
    emitirSonidoFin();
    gestionarVisibilidadDisplay(false, "¡Serie completada! 🔥");

    // Restaura los botones a su estado original
    ejecucionActiva = false;
    btnEmpezar.disabled = false;
    btnPausar.disabled = true;
    btnPausar.value = "Pausar";
    btnPausar.classList.replace("btn-success", "btn-warning");
  });
});
