/**
 * @fileoverview Motor de audio nativo.
 * Gestiona tanto los osciladores sintéticos (pitidos) como la síntesis de voz.
 */

// 1. Inicializamos el contexto de audio. 
// Es el "cerebro" que permite al navegador crear sonidos desde cero.
// Lo exportamos porque en navegadores móviles (iOS/Android), el audio empieza bloqueado 
// y debemos "despertarlo" (resume) cuando el usuario pulsa el botón "Empezar" en app.js.
export const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Genera un pitido sintético sin necesidad de cargar archivos .mp3
 * @param {number} frecuencia - Tono del pitido en Hercios (ej: 440 es la nota La).
 * @param {number} duracion - Cuánto dura el pitido en segundos.
 * @param {string} tipoOnda - Forma del sonido ('sine' es suave, 'sawtooth' es más agresivo).
 */
export function emitirPitido(frecuencia = 440, duracion = 0.1, tipoOnda = "sine") {
    const osc = audioCtx.createOscillator(); // Crea el sonido
    const gain = audioCtx.createGain();      // Controla el volumen

    osc.type = tipoOnda;
    osc.connect(gain);
    gain.connect(audioCtx.destination); // Conecta el volumen a los altavoces

    // Establecemos el tono y encendemos el sonido
    osc.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
    osc.start();

    // Hacemos que el volumen baje progresivamente para que el pitido no termine de golpe (evita "clics" molestos)
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duracion);
    
    // Apagamos el oscilador
    osc.stop(audioCtx.currentTime + duracion);
}

/**
 * Emite una melodía ascendente de 3 notas para celebrar el final de la serie.
 */
export function emitirSonidoFin() {
    emitirPitido(523.25, 0.3, "sine"); // Do
    // Usamos setTimeout para que la siguiente nota suene un poco después
    setTimeout(() => emitirPitido(659.25, 0.3, "sine"), 200); // Mi
    setTimeout(() => emitirPitido(783.99, 0.6, "sine"), 400); // Sol
}

/**
 * Utiliza el narrador nativo del móvil para hablar.
 */
export function anunciarUltimaRepeticion() {
    const locucion = new SpeechSynthesisUtterance("¡Última!");
    locucion.lang = "es-ES"; // Forzamos el acento en español
    locucion.rate = 1.3;     // Lo aceleramos un poco para que no interrumpa el tempo
    locucion.volume = 1;
    window.speechSynthesis.speak(locucion);
}