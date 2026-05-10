/**
 * @fileoverview Módulo de navegación SPA (Single Page Application).
 * Gestiona la navegación entre vistas sin recargas de página.
 * @module SPANavigation
 */

/**
 * Clase que gestiona la navegación SPA.
 */
export class SPANavigation {
  /**
   * @param {Object} elementos - Referencias a los elementos del DOM
   * @param {HTMLElement} elementos.navbar - Barra de navegación
   * @param {HTMLElement} elementos.btnTemporizador - Botón de temporizador
   * @param {HTMLElement} elementos.btnCalculadora - Botón de calculadora
   * @param {HTMLElement} elementos.vistaTemporizador - Vista del temporizador
   * @param {HTMLElement} elementos.vistaCalculadora - Vista de la calculadora
   */
  constructor(elementos) {
    this.navbar = elementos.navbar;
    this.btnTemporizador = elementos.btnTemporizador;
    this.btnCalculadora = elementos.btnCalculadora;
    this.vistaTemporizador = elementos.vistaTemporizador;
    this.vistaCalculadora = elementos.vistaCalculadora;
    this.vistaActual = "temporizador";
  }

  /**
   * Inicializa la navegación SPA.
   */
  inicializar() {
    this.configurarEventos();
    this.actualizarVistas();
  }

  /**
   * Configura los eventos de navegación.
   */
  configurarEventos() {
    this.btnTemporizador.addEventListener("click", () => this.navegarA("temporizador"));
    this.btnCalculadora.addEventListener("click", () => this.navegarA("calculadora"));

    document.addEventListener("keydown", (e) => {
      if (e.altKey) {
        if (e.key === "1") {
          e.preventDefault();
          this.navegarA("temporizador");
        } else if (e.key === "2") {
          e.preventDefault();
          this.navegarA("calculadora");
        }
      }
    });
  }

  /**
   * Navega a la vista especificada.
   * @param {string} vista - Vista a la que navegar ("temporizador" o "calculadora")
   */
  navegarA(vista) {
    if (this.vistaActual === vista) {
      return;
    }

    this.vistaActual = vista;
    this.actualizarVistas();
  }

  /**
   * Actualiza la visibilidad de las vistas y el estado de los botones.
   */
  actualizarVistas() {
    const esTemporizador = this.vistaActual === "temporizador";

    this.vistaTemporizador.hidden = !esTemporizador;
    this.vistaCalculadora.hidden = esTemporizador;

    this.vistaTemporizador.setAttribute("aria-hidden", !esTemporizador);
    this.vistaCalculadora.setAttribute("aria-hidden", esTemporizador);

    this.btnTemporizador.setAttribute("aria-selected", esTemporizador);
    this.btnCalculadora.setAttribute("aria-selected", !esTemporizador);

    this.btnTemporizador.classList.toggle("active", esTemporizador);
    this.btnCalculadora.classList.toggle("active", !esTemporizador);

    this.btnTemporizador.tabIndex = esTemporizador ? -1 : 0;
    this.btnCalculadora.tabIndex = !esTemporizador ? -1 : 0;
  }

  /**
   * Obtiene la vista actual.
   * @returns {string} Vista actual
   */
  getVistaActual() {
    return this.vistaActual;
  }
}
