/**
 * @fileoverview Lógica central de la aplicación Paulbase Cloud.
 * Gestiona el temporizador de ejercicios, síntesis de voz, generación
 * de osciladores de audio y la interacción táctil adaptada a dispositivos móviles.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a botones
    const btnEmpezar = document.getElementById('btnEmpezar');
    const btnPausar = document.getElementById('btnPausar');
    
    // Referencias a los nodos de visualización (Optimizados para evitar innerHTML)
    const displayReps = document.getElementById('display-reps');
    const displayFase = document.getElementById('display-fase');
    const displayTiempo = document.getElementById('display-tiempo');
    const displayMensaje = document.getElementById('display-mensaje');
    const inputsNumericos = document.querySelectorAll('.config-card input[type="number"]');
    
    // Estado global de la aplicación
    let estaPausado = false;
    let ejecucionActiva = false;
    let textoRepeticionActual = ""; 

    // Inicialización del contexto de audio web
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    /**
     * Genera un tono sintetizado utilizando la Web Audio API.
     * @param {number} frecuencia - Frecuencia del sonido en Hz.
     * @param {number} duracion - Duración del tono en segundos.
     * @param {string} tipoOnda - Tipo de onda ('sine', 'square', 'sawtooth', 'triangle').
     */
    function emitirPitido(frecuencia = 440, duracion = 0.1, tipoOnda = 'sine') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = tipoOnda; 
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
        osc.start();
        
        gain.gain.setValueAtTime(1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duracion);
        osc.stop(audioCtx.currentTime + duracion);
    }

    /**
     * Emite una secuencia de tonos ascendentes indicando el final de la serie.
     */
    function emitirSonidoFin() {
        emitirPitido(523.25, 0.3, 'sine');
        setTimeout(() => emitirPitido(659.25, 0.3, 'sine'), 200);
        setTimeout(() => emitirPitido(783.99, 0.6, 'sine'), 400);
    }

    /**
     * Promesa que resuelve después de 1 segundo. Utilizada para el tick del reloj.
     * @returns {Promise<void>}
     */
    const esperarSegundo = () => new Promise(resolve => setTimeout(resolve, 1000));

    /**
     * Detiene la ejecución asíncrona mediante un bucle while si el estado es 'Pausado'.
     * @returns {Promise<void>}
     */
    const checkPausa = async () => {
        while (estaPausado) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    /**
     * Muestra u oculta los elementos del DOM dependiendo del estado del cronómetro.
     * @param {boolean} modoActivo - True si el cronómetro está corriendo.
     * @param {string} [mensajeFinal] - Texto a mostrar cuando se detiene el cronómetro.
     */
    const gestionarVisibilidadDisplay = (modoActivo, mensajeFinal = "") => {
        if (modoActivo) {
            displayMensaje.style.display = 'none';
            displayReps.style.display = 'inline-block';
            displayFase.style.display = 'block';
            displayTiempo.style.display = 'block';
        } else {
            displayReps.style.display = 'none';
            displayFase.style.display = 'none';
            displayTiempo.style.display = 'none';
            displayMensaje.style.display = 'block';
            
            // Usamos className y textContent para evitar inyección XSS
            displayMensaje.className = mensajeFinal.includes("Error") ? "text-danger font-weight-bold" : "text-success font-weight-bold";
            displayMensaje.textContent = mensajeFinal || "Configura tu serie";
            displayMensaje.style.fontSize = "1.5rem";
        }
    };

    /**
     * Ejecuta el conteo regresivo de una fase específica del ejercicio.
     * @param {string} nombreFase - Nombre de la fase actual (ej. "SUBIENDO").
     * @param {number} segundos - Duración de la fase.
     * @param {Object} configAudio - Parámetros de audio {frecuencia, duracion, onda}.
     */
    const ejecutarFase = async (nombreFase, segundos, configAudio) => {
        if (segundos <= 0) return;
        
        displayFase.textContent = nombreFase;
        displayReps.textContent = textoRepeticionActual;

        for (let i = segundos; i > 0; i--) {
            await checkPausa();
            emitirPitido(configAudio.frecuencia, configAudio.duracion, configAudio.onda);
            displayTiempo.textContent = `${i}s`;
            await esperarSegundo();
        }
    };

    /* --- GESTIÓN DE EVENTOS TÁCTILES PARA INPUTS --- */
    inputsNumericos.forEach(input => {
        let isDragging = false;
        let startY = 0;
        let startValue = 0;

        input.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startValue = parseInt(input.value) || 0;
            input.setPointerCapture(e.pointerId); 
            input.blur(); 
            e.preventDefault();
        });

        input.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const diferencia = startY - e.clientY; 
            const sensibilidad = 25; 
            const cambioAproximado = Math.floor(diferencia / sensibilidad);

            let nuevoValor = startValue + cambioAproximado;
            
            // Sanitización de límites min/max durante el arrastre
            const max = parseInt(input.getAttribute('max')) || 100;
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

        input.addEventListener('pointerup', stopDrag);
        input.addEventListener('pointercancel', stopDrag);
    });

    /* --- GESTIÓN DE CONTROLES DEL REPRODUCTOR --- */
    btnPausar.addEventListener('click', () => {
        estaPausado = !estaPausado;
        btnPausar.value = estaPausado ? "Reanudar" : "Pausar";
        
        if(estaPausado) {
            btnPausar.classList.replace('btn-warning', 'btn-success');
        } else {
            btnPausar.classList.replace('btn-success', 'btn-warning');
        }
    });

    btnEmpezar.addEventListener('click', async () => {
        if (ejecucionActiva) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Extracción y sanitización de datos (Prevención de Denegación de Servicio)
        const prep = Math.min(parseInt(document.getElementById('fase_prep').value) || 0, 60);
        const bajada = Math.min(parseInt(document.getElementById('fase_bajada').value) || 0, 60);
        const fondo = Math.min(parseInt(document.getElementById('fase_fondo').value) || 0, 60);
        const subida = Math.min(parseInt(document.getElementById('fase_subida').value) || 0, 60);
        const contra = Math.min(parseInt(document.getElementById('fase_contraccion').value) || 0, 60);
        const reps = Math.min(parseInt(document.getElementById('reps').value) || 0, 100);

        if (reps <= 0) {
            gestionarVisibilidadDisplay(false, "Error: Añade al menos 1 repetición.");
            return;
        }

        // Configuración inicial de UI para ejecución
        ejecucionActiva = true;
        btnEmpezar.disabled = true;
        btnPausar.disabled = false;
        btnPausar.value = "Pausar";
        
        btnPausar.classList.remove('btn-success');
        btnPausar.classList.add('btn-warning');
        
        gestionarVisibilidadDisplay(true);

        // Fase 1: Preparación
        textoRepeticionActual = "Preparación";
        await ejecutarFase("⏳ Prepárate", prep, { frecuencia: 600, duracion: 0.1, onda: 'sine' });

        // Fase 2: Ciclo de Trabajo
        for (let r = 1; r <= reps; r++) {
            await checkPausa();
            textoRepeticionActual = `Repetición ${r} de ${reps}`;

            // Aviso de síntesis de voz
            if (r === reps && reps > 1) {
                const locucion = new SpeechSynthesisUtterance("¡Última!");
                locucion.lang = "es-ES";
                locucion.rate = 1.3;
                locucion.volume = 1;
                window.speechSynthesis.speak(locucion);
            }
            
            await ejecutarFase("⬇️ BAJANDO", bajada, { frecuencia: 300, duracion: 0.3, onda: 'triangle' });
            await ejecutarFase("⏸️ FONDO", fondo, { frecuencia: 150, duracion: 0.05, onda: 'square' });
            await ejecutarFase("⬆️ SUBIENDO", subida, { frecuencia: 500, duracion: 0.2, onda: 'sawtooth' });
            await ejecutarFase("💪 CONTRAE", contra, { frecuencia: 900, duracion: 0.08, onda: 'sine' });
        }

        // Fase 3: Finalización
        emitirSonidoFin();
        gestionarVisibilidadDisplay(false, "¡Serie completada! 🔥");
        
        // Restauración de UI
        ejecucionActiva = false;
        btnEmpezar.disabled = false;
        btnPausar.disabled = true;
        btnPausar.value = "Pausar";
        btnPausar.classList.replace('btn-success', 'btn-warning');
    });
});