/**
 * @fileoverview Componente del panel de configuración.
 * Gestiona los inputs de configuración y la carga de presets.
 * @module components/ConfigPanel
 */

/**
 * Clase que gestiona el panel de configuración.
 */
export class ConfigPanel {
  /**
   * @param {Object} elementos - Referencias a los elementos del DOM
   * @param {HTMLElement} elementos.selector - Selector de presets
   * @param {NodeList} elementos.inputs - Lista de inputs numéricos
   */
  constructor(elementos) {
    this.selector = elementos.selector;
    this.inputs = elementos.inputs;
  }

  /**
   * Configura el listener para cargar presets.
   * @param {Object} presets - Diccionario de presets
   */
  configurarCargaPresets(presets) {
    this.selector.addEventListener("change", (e) => {
      const rutinaId = e.target.value;
      const datos = presets[rutinaId];

      if (datos) {
        this.cargarDatos(datos);
        this.animarCarga();
        this.selector.blur();
      }
    });
  }

  /**
   * Carga los datos de un preset en los inputs.
   * @param {Object} datos - Datos del preset
   */
  cargarDatos(datos) {
    document.getElementById("reps").value = datos.reps;
    document.getElementById("fase_bajada").value = datos.bajada;
    document.getElementById("fase_fondo").value = datos.fondo;
    document.getElementById("fase_subida").value = datos.subida;
    document.getElementById("fase_contraccion").value = datos.cima;
  }

  /**
   * Aplica una animación visual al cargar datos.
   */
  animarCarga() {
    const cards = document.querySelectorAll(".config-card");
    cards.forEach((card) => {
      card.style.transform = "scale(0.95)";
      setTimeout(() => (card.style.transform = "scale(1)"), 150);
    });
  }

  /**
   * Configura el control táctil por arrastre en los inputs.
   * @param {number} sensibilidad - Píxeles necesarios para cambiar 1 unidad
   */
  configurarControlTactil(sensibilidad = 25) {
    this.inputs.forEach((input) => {
      let isDragging = false;
      let startY = 0;
      let startValue = 0;

      input.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startY = e.clientY;
        startValue = parseInt(input.value) || 0;
        input.setPointerCapture(e.pointerId);
        input.blur();
        e.preventDefault();
      });

      input.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const diferencia = startY - e.clientY;
        const cambioAproximado = Math.floor(diferencia / sensibilidad);

        let nuevoValor = startValue + cambioAproximado;

        const max = parseInt(input.getAttribute("max")) || 100;
        if (nuevoValor < 0) nuevoValor = 0;
        if (nuevoValor > max) nuevoValor = max;

        input.value = nuevoValor;
      });

      const stopDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          input.releasePointerCapture(e.pointerId);
        }
      };

      input.addEventListener("pointerup", stopDrag);
      input.addEventListener("pointercancel", stopDrag);
    });
  }

  /**
   * Obtiene los valores actuales de configuración.
   * @returns {Object} Objeto con los valores de configuración
   */
  obtenerValores() {
    return {
      prep: Math.min(parseInt(document.getElementById("fase_prep").value) || 0, 60),
      bajada: Math.min(parseInt(document.getElementById("fase_bajada").value) || 0, 60),
      fondo: Math.min(parseInt(document.getElementById("fase_fondo").value) || 0, 60),
      subida: Math.min(parseInt(document.getElementById("fase_subida").value) || 0, 60),
      contra: Math.min(parseInt(document.getElementById("fase_contraccion").value) || 0, 60),
      reps: Math.min(parseInt(document.getElementById("reps").value) || 0, 100)
    };
  }
}