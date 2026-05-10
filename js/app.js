/**
 * @fileoverview Lógica central de TempoGym.
 * Conecta la interfaz de usuario con los datos y el audio.
 * @module app
 */

// --- 1. IMPORTACIONES ---
import { rutinasPresets } from "./config/rutinas.js";
import { audioConfig, limites, textos, vozConfig } from "./config/app.js";
import {
  audioCtx,
  emitirPitido,
  emitirSonidoFin,
  anunciarUltimaRepeticion,
} from "./modules/audio.js";
import { TimerDisplay } from "./components/TimerDisplay.js";
import { ConfigPanel } from "./components/ConfigPanel.js";
import { ActionButtons } from "./components/ActionButtons.js";
import { VolumeCalculator } from "./components/VolumeCalculator.js";
import { SPANavigation } from "./modules/SPANavigation.js";

// --- 2. INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
  // --- 3. REFERENCIAS AL DOM ---
  const elementosDOM = {
    selector: document.getElementById("preset-selector"),
    inputs: document.querySelectorAll('.config-card input[type="number"]'),
    display: {
      reps: document.getElementById("display-reps"),
      fase: document.getElementById("display-fase"),
      tiempo: document.getElementById("display-tiempo"),
      mensaje: document.getElementById("display-mensaje")
    },
    botones: {
      empezar: document.getElementById("btnEmpezar"),
      pausar: document.getElementById("btnPausar")
    }
  };

  // --- 4. COMPONENTES ---
  const timerDisplay = new TimerDisplay(elementosDOM.display);
  const configPanel = new ConfigPanel({
    selector: elementosDOM.selector,
    inputs: elementosDOM.inputs
  });
  const actionButtons = new ActionButtons(elementosDOM.botones);

  // --- 5. NAVEGACIÓN SPA Y CALCULADORA ---
  const spaNavigation = new SPANavigation({
    navbar: document.querySelector(".spa-navbar"),
    btnTemporizador: document.getElementById("nav-temporizador"),
    btnCalculadora: document.getElementById("nav-calculadora"),
    vistaTemporizador: document.getElementById("vista-temporizador"),
    vistaCalculadora: document.getElementById("vista-calculadora")
  });

  const volumeCalculator = new VolumeCalculator({
    contenedor: document.getElementById("sets-container"),
    volumenTotal: document.getElementById("volumen-total"),
    btnAnadir: document.getElementById("btn-anadir-set"),
    btnEliminar: document.getElementById("btn-eliminar-set")
  });

  // Inicializar navegación y calculadora
  spaNavigation.inicializar();
  volumeCalculator.inicializar();

  // --- 6. ESTADO GLOBAL ---
  let ejecucionActiva = false;
  let textoRepeticionActual = "";

  // --- 7. CONFIGURACIÓN DE COMPONENTES ---
  configPanel.configurarCargaPresets(rutinasPresets);
  configPanel.configurarControlTactil(limites.sensibilidadArrastre);

  actionButtons.configurarPausa((estaPausado) => {
    if (estaPausado) {
      timerDisplay.mostrarPausa();
    }
  });

  actionButtons.configurarEmpezar(async () => {
    if (ejecucionActiva) return;

    // Despertar el motor de audio
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    // Obtener valores de configuración
    const config = configPanel.obtenerValores();

    if (config.reps <= 0) {
      timerDisplay.gestionarVisibilidad(false, textos.errorRepeticiones);
      return;
    }

    // Configurar estado inicial
    ejecucionActiva = true;
    actionButtons.setEjecucionActiva(true);
    actionButtons.restablecer();
    actionButtons.setEjecucionActiva(true);

    timerDisplay.gestionarVisibilidad(true);

    // --- 8. EJECUCIÓN DEL TEMPORIZADOR ---
    await ejecutarTemporizador(config);

    // --- 9. FINALIZACIÓN ---
    emitirSonidoFin();
    timerDisplay.gestionarVisibilidad(false, textos.serieCompletada);
    actionButtons.restablecer();
    ejecucionActiva = false;
  });

  // --- 10. FUNCIONES AUXILIARES ---

  /**
   * Crea una pausa exacta de 1 segundo.
   * @returns {Promise<void>}
   */
  const esperarSegundo = () =>
    new Promise((resolve) => setTimeout(resolve, 1000));

  /**
   * Ejecuta una fase específica del ejercicio.
   * @param {string} nombreFase - Nombre de la fase
   * @param {number} segundos - Duración en segundos
   * @param {Object} configAudio - Configuración de audio
   * @returns {Promise<boolean>} true si se completó, false si se pausó
   */
  const ejecutarFase = async (nombreFase, segundos, configAudio) => {
    if (segundos <= 0) return true;

    timerDisplay.actualizarFase(nombreFase, textoRepeticionActual);

    for (let i = segundos; i > 0; i--) {
      if (actionButtons.getPausado()) {
        while (actionButtons.getPausado()) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return false;
      }

      emitirPitido(
        configAudio.frecuencia,
        configAudio.duracion,
        configAudio.onda
      );
      timerDisplay.actualizarTiempo(i);
      await esperarSegundo();
    }
    return true;
  };

  /**
   * Ejecuta el ciclo completo del temporizador.
   * @param {Object} config - Configuración del ejercicio
   */
  const ejecutarTemporizador = async (config) => {
    let r = 1;
    let necesitaPrep = true;

    while (r <= config.reps && ejecucionActiva) {
      // Fase de preparación
      if (necesitaPrep) {
        textoRepeticionActual = textos.preparacion;
        let prepCompletada = await ejecutarFase(
          textos.fasePreparacion,
          config.prep,
          audioConfig.preparacion
        );

        if (!prepCompletada) continue;
        necesitaPrep = false;
      }

      // Fase de repeticiones
      textoRepeticionActual = `${textos.repeticion} ${r} de ${config.reps}`;
      if (r === config.reps && config.reps > 1) {
        anunciarUltimaRepeticion();
      }

      // Ejecutar fases del ejercicio
      let completado = await ejecutarFase(
        textos.faseBajada,
        config.bajada,
        audioConfig.bajada
      );
      if (!completado) {
        necesitaPrep = true;
        continue;
      }

      completado = await ejecutarFase(
        textos.faseFondo,
        config.fondo,
        audioConfig.fondo
      );
      if (!completado) {
        necesitaPrep = true;
        continue;
      }

      completado = await ejecutarFase(
        textos.faseSubida,
        config.subida,
        audioConfig.subida
      );
      if (!completado) {
        necesitaPrep = true;
        continue;
      }

      completado = await ejecutarFase(
        textos.faseContraccion,
        config.contra,
        audioConfig.contraccion
      );
      if (!completado) {
        necesitaPrep = true;
        continue;
      }

      r++;
    }
  };
});