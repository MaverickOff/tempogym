/**
 * @fileoverview Componente de visualización del temporizador.
 * Gestiona la presentación visual de las fases y tiempos.
 * @module components/TimerDisplay
 */

/**
 * Clase que gestiona el display del temporizador.
 */
export class TimerDisplay {
  /**
   * @param {Object} elementos - Referencias a los elementos del DOM
   * @param {HTMLElement} elementos.reps - Elemento para mostrar repeticiones
   * @param {HTMLElement} elementos.fase - Elemento para mostrar la fase actual
   * @param {HTMLElement} elementos.tiempo - Elemento para mostrar el tiempo
   * @param {HTMLElement} elementos.mensaje - Elemento para mostrar mensajes
   */
  constructor(elementos) {
    this.reps = elementos.reps;
    this.fase = elementos.fase;
    this.tiempo = elementos.tiempo;
    this.mensaje = elementos.mensaje;
  }

  /**
   * Alterna entre modo activo (mostrando temporizador) y modo mensaje.
   * @param {boolean} modoActivo - true para mostrar temporizador, false para mostrar mensaje
   * @param {string} mensajeFinal - Texto a mostrar en modo mensaje
   */
  gestionarVisibilidad(modoActivo, mensajeFinal = "") {
    if (modoActivo) {
      this.mensaje.style.display = "none";
      this.reps.style.display = "inline-block";
      this.fase.style.display = "block";
      this.tiempo.style.display = "block";
    } else {
      this.reps.style.display = "none";
      this.fase.style.display = "none";
      this.tiempo.style.display = "none";
      this.mensaje.style.display = "block";

      this.mensaje.className = mensajeFinal.includes("Error")
        ? "text-danger font-weight-bold"
        : "text-success font-weight-bold";
      this.mensaje.textContent = mensajeFinal || "Configura tu serie";
      this.mensaje.style.fontSize = "1.5rem";
    }
  }

  /**
   * Actualiza el texto de la fase actual.
   * @param {string} textoFase - Texto de la fase
   * @param {string} textoRepeticion - Texto de la repetición actual
   */
  actualizarFase(textoFase, textoRepeticion) {
    this.fase.textContent = textoFase;
    this.reps.textContent = textoRepeticion;
  }

  /**
   * Actualiza el tiempo restante.
   * @param {number} segundos - Segundos restantes
   */
  actualizarTiempo(segundos) {
    this.tiempo.textContent = `${segundos}s`;
  }

  /**
   * Muestra un mensaje de pausa.
   */
  mostrarPausa() {
    this.fase.textContent = "⏸️ EN PAUSA";
  }
}