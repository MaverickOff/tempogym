/**
 * @fileoverview Módulo de Calculadora de Volumen de Entrenamiento.
 * Calcula el volumen total (Peso × Repeticiones) de forma dinámica.
 * @module VolumeCalculator
 */

/**
 * Clase que gestiona la calculadora de volumen de entrenamiento.
 */
export class VolumeCalculator {
  /**
   * @param {Object} elementos - Referencias a los elementos del DOM
   * @param {HTMLElement} elementos.contenedor - Contenedor de los sets
   * @param {HTMLElement} elementos.volumenTotal - Elemento para mostrar el volumen total
   * @param {HTMLElement} elementos.btnAnadir - Botón para añadir set
   * @param {HTMLElement} elementos.btnEliminar - Botón para eliminar último set
   */
  constructor(elementos) {
    this.contenedor = elementos.contenedor;
    this.volumenTotal = elementos.volumenTotal;
    this.btnAnadir = elementos.btnAnadir;
    this.btnEliminar = elementos.btnEliminar;
    this.sets = [];
    this.setCounter = 0;
  }

  /**
   * Inicializa la calculadora con un set por defecto.
   */
  inicializar() {
    this.anadirSet();
    this.configurarEventos();
    this.actualizarVolumen();
  }

  /**
   * Configura los eventos de los botones.
   */
  configurarEventos() {
    this.btnAnadir.addEventListener("click", () => this.anadirSet());
    this.btnEliminar.addEventListener("click", () => this.eliminarUltimoSet());
  }

  /**
   * Añade un nuevo set al listado.
   */
  anadirSet() {
    this.setCounter++;
    const setId = this.setCounter;

    const setRow = document.createElement("div");
    setRow.className = "set-row row no-gutters mb-2";
    setRow.id = `set-${setId}`;
    setRow.setAttribute("role", "group");
    setRow.setAttribute("aria-label", `Set ${setId}`);

    const pesoCol = document.createElement("div");
    pesoCol.className = "col-6 p-1";

    const pesoCard = document.createElement("div");
    pesoCard.className = "config-card";

    const pesoLabel = document.createElement("label");
    pesoLabel.htmlFor = `peso-${setId}`;
    pesoLabel.textContent = "Peso (kg)";
    pesoLabel.setAttribute("aria-hidden", "true");

    const pesoInput = document.createElement("input");
    pesoInput.type = "number";
    pesoInput.id = `peso-${setId}`;
    pesoInput.value = "";
    pesoInput.min = "0";
    pesoInput.max = "500";
    pesoInput.step = "0.5";
    pesoInput.placeholder = "0";
    pesoInput.setAttribute("aria-label", `Peso del set ${setId} en kilogramos`);
    pesoInput.setAttribute("data-set-id", setId);
    pesoInput.setAttribute("data-tipo", "peso");

    pesoCard.appendChild(pesoLabel);
    pesoCard.appendChild(pesoInput);
    pesoCol.appendChild(pesoCard);

    const repsCol = document.createElement("div");
    repsCol.className = "col-6 p-1";

    const repsCard = document.createElement("div");
    repsCard.className = "config-card";

    const repsLabel = document.createElement("label");
    repsLabel.htmlFor = `reps-${setId}`;
    repsLabel.textContent = "Reps";
    repsLabel.setAttribute("aria-hidden", "true");

    const repsInput = document.createElement("input");
    repsInput.type = "number";
    repsInput.id = `reps-${setId}`;
    repsInput.value = "";
    repsInput.min = "0";
    repsInput.max = "100";
    repsInput.placeholder = "0";
    repsInput.setAttribute("aria-label", `Repeticiones del set ${setId}`);
    repsInput.setAttribute("data-set-id", setId);
    repsInput.setAttribute("data-tipo", "reps");

    repsCard.appendChild(repsLabel);
    repsCard.appendChild(repsInput);
    repsCol.appendChild(repsCard);

    setRow.appendChild(pesoCol);
    setRow.appendChild(repsCol);

    this.contenedor.appendChild(setRow);

    this.sets.push({ id: setId, peso: pesoInput, reps: repsInput });

    pesoInput.addEventListener("input", () => this.actualizarVolumen());
    repsInput.addEventListener("input", () => this.actualizarVolumen());

    this.actualizarEstadoBotones();
  }

  /**
   * Elimina el último set del listado.
   */
  eliminarUltimoSet() {
    if (this.sets.length <= 1) {
      return;
    }

    const ultimoSet = this.sets.pop();
    const setRow = document.getElementById(`set-${ultimoSet.id}`);

    if (setRow) {
      setRow.remove();
    }

    this.actualizarVolumen();
    this.actualizarEstadoBotones();
  }

  /**
   * Calcula y actualiza el volumen total.
   */
  actualizarVolumen() {
    let volumenTotal = 0;

    this.sets.forEach((set) => {
      const rawValue = parseFloat(set.peso.value) || 0;
      const peso = rawValue % 0.25 === 0 ? rawValue : 0;
      const reps = parseFloat(set.reps.value) || 0;
      volumenTotal += peso * reps;
    });

    this.volumenTotal.textContent = `${volumenTotal.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} kg`;
  }

  /**
   * Actualiza el estado de los botones.
   */
  actualizarEstadoBotones() {
    this.btnEliminar.disabled = this.sets.length <= 1;
  }

  /**
   * Limpia todos los sets y reinicia la calculadora.
   */
  reiniciar() {
    this.contenedor.innerHTML = "";
    this.sets = [];
    this.setCounter = 0;
    this.inicializar();
  }
}
