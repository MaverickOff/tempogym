document.addEventListener('DOMContentLoaded', () => {
    const btnEmpezar = document.getElementById('btnEmpezar');
    const btnPausar = document.getElementById('btnPausar');
    const textoDisplay = document.getElementById('texto');
    
    let estaPausado = false;
    let ejecucionActiva = false;
    let textoRepeticionActual = ""; // Nueva variable para saber en qué repetición estamos

    // --- SISTEMA DE AUDIO AVANZADO ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
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

    function emitirSonidoFin() {
        emitirPitido(523.25, 0.3, 'sine');
        setTimeout(() => emitirPitido(659.25, 0.3, 'sine'), 200);
        setTimeout(() => emitirPitido(783.99, 0.6, 'sine'), 400);
    }

    // --- LÓGICA DE CONTROL ---
    const esperarSegundo = () => new Promise(resolve => setTimeout(resolve, 1000));

    const checkPausa = async () => {
        while (estaPausado) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    // La función ahora muestra la repetición actual junto con el temporizador
    const ejecutarFase = async (nombreFase, segundos, configAudio) => {
        if (segundos <= 0) return;
        for (let i = segundos; i > 0; i--) {
            await checkPausa();
            
            emitirPitido(configAudio.frecuencia, configAudio.duracion, configAudio.onda);
            
            // Inyectamos el texto de la repetición arriba del temporizador
            textoDisplay.innerHTML = `
                <h5 class="text-primary mb-2">${textoRepeticionActual}</h5>
                <h3>${nombreFase}</h3>
                <h1 style="font-size: 4rem;">${i}s</h1>
            `;
            await esperarSegundo();
        }
    };

    const inputsNumericos = document.querySelectorAll('.config-card input[type="number"]');

    inputsNumericos.forEach(input => {
        let isDragging = false;
        let startY = 0;
        let startValue = 0;

        // Cuando el usuario toca el número
        input.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startY = e.clientY; // Guardamos en qué píxel de la pantalla tocó
            startValue = parseInt(input.value) || 0; // Guardamos el valor actual
            
            // Forzamos al navegador a seguir el dedo incluso si se sale del número
            input.setPointerCapture(e.pointerId); 
            
            // Evitamos que se abra el teclado en algunos móviles
            input.blur(); 
            e.preventDefault();
        });

        // Mientras desliza el dedo
        input.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            const currentY = e.clientY;
            // Calculamos la distancia: hacia arriba es positivo, hacia abajo negativo
            const diferencia = startY - currentY; 

            // Sensibilidad: Cuántos píxeles hay que mover el dedo para que el número cambie en 1
            // 25 píxeles suele ser muy cómodo en móviles
            const sensibilidad = 25; 
            const cambioAproximado = Math.floor(diferencia / sensibilidad);

            let nuevoValor = startValue + cambioAproximado;

            // Evitamos que pongan números negativos
            if (nuevoValor < 0) nuevoValor = 0;

            // Actualizamos el valor visualmente
            input.value = nuevoValor;
        });

        // Cuando suelta el dedo
        const stopDrag = (e) => {
            if (isDragging) {
                isDragging = false;
                input.releasePointerCapture(e.pointerId);
            }
        };

        input.addEventListener('pointerup', stopDrag);
        input.addEventListener('pointercancel', stopDrag);
    });


    // --- EVENTOS DE BOTONES ---
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

        const prep = parseInt(document.getElementById('fase_prep').value) || 0;
        const bajada = parseInt(document.getElementById('fase_bajada').value) || 0;
        const fondo = parseInt(document.getElementById('fase_fondo').value) || 0;
        const subida = parseInt(document.getElementById('fase_subida').value) || 0;
        const contra = parseInt(document.getElementById('fase_contraccion').value) || 0;
        const reps = parseInt(document.getElementById('reps').value) || 0;

        if (reps <= 0) {
            textoDisplay.innerHTML = '<span class="text-danger">Añade al menos 1 repetición.</span>';
            return;
        }

        ejecucionActiva = true;
        btnEmpezar.disabled = true;
        btnPausar.disabled = false;
        btnPausar.value = "Pausar";
        btnPausar.className = "btn btn-warning";

        // 1. Fase de Preparación
        textoRepeticionActual = "Preparación"; // Texto durante la preparación
        await ejecutarFase("⏳ Prepárate", prep, { frecuencia: 600, duracion: 0.1, onda: 'sine' });

        // 2. Bucle de la serie (SIN PAUSAS ENTRE REPETICIONES)
        for (let r = 1; r <= reps; r++) {
            await checkPausa();
            
            // Actualizamos la variable para que ejecutarFase la pinte automáticamente
            textoRepeticionActual = `Repetición ${r} de ${reps}`;
            
            await ejecutarFase("⬇️ BAJANDO", bajada, { frecuencia: 300, duracion: 0.3, onda: 'triangle' });
            await ejecutarFase("⏸️ FONDO", fondo, { frecuencia: 150, duracion: 0.05, onda: 'square' });
            await ejecutarFase("⬆️ SUBIENDO", subida, { frecuencia: 500, duracion: 0.2, onda: 'sawtooth' });
            await ejecutarFase("💪 CONTRAE", contra, { frecuencia: 900, duracion: 0.08, onda: 'sine' });
        }

        // 3. Finalización
        emitirSonidoFin();
        textoDisplay.innerHTML = "<h2 class='text-success'>¡Serie completada! 🔥</h2>";
        
        ejecucionActiva = false;
        btnEmpezar.disabled = false;
        btnPausar.disabled = true;
        btnPausar.value = "Pausar";
        btnPausar.classList.replace('btn-success', 'btn-warning');
    });
});