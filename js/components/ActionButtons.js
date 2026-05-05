/**
 * @fileoverview Componente de botones de acción.
 * Gestiona los botones de empezar, pausar y reanudar.
 * @module components/ActionButtons
 */

/**
 * Clase que gestiona los botones de acción.
 */
export class ActionButtons {
  /**
   * @param {Object} elementos - Referencias a los elementos del DOM
   * @param {HTMLElement} elementos.empezar - Botón de empezar
   * @param {HTMLElement} elementos.pausar - Botón de pausar/reanudar
   */
  constructor(elementos) {
    this.empezar = elementos.empezar;
    this.pausar = elementos.pausar;
    this.estaPausado = false;
  }

  /**
   * Configura el listener del botón de pausar/reanudar.
   * @param {Function} callback - Función a ejecutar al cambiar estado
   */
  configurarPausa(callback) {
    this.pausar.addEventListener("click", () => {
      this.estaPausado = !this.estaPausado;
      this.pausar.value = this.estaPausado ? "Reanudar" : "Pausar";

      if (this.estaPausado) {
        this.pausar.classList.replace("btn-warning", "btn-success");
      } else {
        this.pausar.classList.replace("btn-success", "btn-warning");
      }

      if (callback) callback(this.estaPausado);
    });
  }

  /**
   * Configura el listener del botón de empezar.
   * @param {Function} callback - Función a ejecutar al empezar
   */
  configurarEmpezar(callback) {
    this.empezar.addEventListener("click", callback);
  }

  /**
   * Establece el estado de ejecución activa.
   * @param {boolean} activa - true si hay una ejecución activa
   */
  setEjecucionActiva(activa) {
    this.empezar.disabled = activa;
    this.pausar.disabled = !activa;
  }

  /**
   * Restablece los botones a su estado inicial.
   */
  restablecer() {
    this.empezar.disabled = false;
    this.pausar.disabled = true;
    this.pausar.value = "Pausar";
    this.pausar.classList.remove("btn-success");
    this.pausar.classList.add("btn-warning");
    this.estaPausado = false;
  }

  /**
   * Obtiene el estado de pausa actual.
   * @returns {boolean} true si está pausado
   */
  getPausado() {
    return this.estaPausado;
  }
}