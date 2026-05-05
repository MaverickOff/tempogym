/**
 * @fileoverview Motor de audio nativo.
 * Gestiona tanto los osciladores sintéticos como la síntesis de voz.
 * @module modules/audio
 */

// --- 1. CONTEXTO DE AUDIO ---
/**
 * Contexto de audio global.
 * En navegadores móviles, el audio empieza bloqueado y debe ser "despertado".
 */
export const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// --- 2. FUNCIONES DE AUDIO ---

/**
 * Genera un pitido sintético sin necesidad de archivos externos.
 * @param {number} frecuencia - Tono del pitido en Hercios (440 = La)
 * @param {number} duracion - Duración del pitido en segundos
 * @param {string} tipoOnda - Forma del sonido ('sine', 'sawtooth', 'triangle', 'square')
 */
export function emitirPitido(frecuencia = 440, duracion = 0.1, tipoOnda = "sine") {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = tipoOnda;
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
  osc.start();

  // Fade out para evitar clics molestos
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duracion);

  osc.stop(audioCtx.currentTime + duracion);
}

/**
 * Emite una melodía ascendente de 3 notas para celebrar el final de la serie.
 * Secuencia: Do - Mi - Sol
 */
export function emitirSonidoFin() {
  emitirPitido(523.25, 0.3, "sine"); // Do
  setTimeout(() => emitirPitido(659.25, 0.3, "sine"), 200); // Mi
  setTimeout(() => emitirPitido(783.99, 0.6, "sine"), 400); // Sol
}

/**
 * Utiliza el narrador nativo del sistema para anunciar la última repetición.
 */
export function anunciarUltimaRepeticion() {
  const locucion = new SpeechSynthesisUtterance("¡Última!");
  locucion.lang = "es-ES";
  locucion.rate = 1.3;
  locucion.volume = 1;
  window.speechSynthesis.speak(locucion);
}