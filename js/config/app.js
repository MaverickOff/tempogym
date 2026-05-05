/**
 * @fileoverview Configuración global de la aplicación.
 * Define constantes y valores por defecto.
 * @module config/app
 */

/**
 * Configuración de audio para cada fase del ejercicio.
 */
export const audioConfig = {
  preparacion: {
    frecuencia: 600,
    duracion: 0.1,
    onda: "sine"
  },
  bajada: {
    frecuencia: 300,
    duracion: 0.3,
    onda: "triangle"
  },
  fondo: {
    frecuencia: 150,
    duracion: 0.05,
    onda: "square"
  },
  subida: {
    frecuencia: 500,
    duracion: 0.2,
    onda: "sawtooth"
  },
  contraccion: {
    frecuencia: 900,
    duracion: 0.08,
    onda: "sine"
  }
};

/**
 * Límites de seguridad para los inputs.
 */
export const limites = {
  maxSegundos: 60,
  maxRepeticiones: 100,
  sensibilidadArrastre: 25
};

/**
 * Textos y mensajes de la aplicación.
 */
export const textos = {
  fasePreparacion: "⏳ Prepárate",
  faseBajada: "⬇️ BAJANDO",
  faseFondo: "⏸️ FONDO",
  faseSubida: "⬆️ SUBIENDO",
  faseContraccion: "💪 CONTRAE",
  pausa: "⏸️ EN PAUSA",
  preparacion: "Preparación",
  repeticion: "Repetición",
  serieCompletada: "¡Serie completada! 🔥",
  errorRepeticiones: "Error: Añade al menos 1 repetición.",
  configurarSerie: "Configura tu serie",
  ultimaRepeticion: "¡Última!"
};

/**
 * Configuración de síntesis de voz.
 */
export const vozConfig = {
  lang: "es-ES",
  rate: 1.3,
  volume: 1
};