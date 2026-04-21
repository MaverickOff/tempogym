/**
 * @fileoverview Base de datos de rutinas predefinidas.
 * Actúa como la "memoria" estática de la aplicación.
 */

// Usamos "export const" para permitir que app.js pueda leer este diccionario.
export const rutinasPresets = {
    // Upper Body 1
    // Cada clave (ej: 'ub1_db_bench') es el "value" que pusimos en el <select> del HTML.
    // Los valores son objetos que representan: { repeticiones, bajada, fondo, subida, cima }
    // Nota: Las subidas explosivas ('X') se han traducido a 1 segundo.

    ub1_db_bench: { reps: 6, bajada: 3, fondo: 1, subida: 1, cima: 1 },
    ub1_inc_bench: { reps: 8, bajada: 3, fondo: 1, subida: 1, cima: 1 },
    ub1_pullup: { reps: 7, bajada: 2, fondo: 1, subida: 1, cima: 1 },
    ub1_row: { reps: 12, bajada: 2, fondo: 0, subida: 1, cima: 2 },
    ub1_curl: { reps: 12, bajada: 3, fondo: 0, subida: 1, cima: 1 },
    ub1_triceps: { reps: 12, bajada: 3, fondo: 0, subida: 1, cima: 1 },

    // Lower Body 1
    lb1_squat: { reps: 5, bajada: 3, fondo: 1, subida: 1, cima: 1 },
    lb1_rdl: { reps: 6, bajada: 4, fondo: 0, subida: 1, cima: 1 },
    lb1_legpress: { reps: 10, bajada: 3, fondo: 1, subida: 2, cima: 1 },
    lb1_legext: { reps: 12, bajada: 2, fondo: 0, subida: 1, cima: 2 },
    lb1_calf: { reps: 12, bajada: 2, fondo: 2, subida: 1, cima: 1 },

    // Upper Body 2
    ub2_shoulder: { reps: 8, bajada: 3, fondo: 1, subida: 1, cima: 1 },
    ub2_chinup: { reps: 8, bajada: 2, fondo: 1, subida: 1, cima: 1 },
    ub2_row: { reps: 8, bajada: 2, fondo: 0, subida: 1, cima: 2 },
    ub2_curl: { reps: 10, bajada: 4, fondo: 0, subida: 1, cima: 1 },
    ub2_lateral: { reps: 12, bajada: 2, fondo: 0, subida: 1, cima: 2 },
    ub2_triceps: { reps: 12, bajada: 3, fondo: 1, subida: 1, cima: 0 },

    // Lower Body 2
    lb2_deadlift: { reps: 6, bajada: 2, fondo: 1, subida: 1, cima: 1 },
    lb2_bulgarian: { reps: 8, bajada: 3, fondo: 1, subida: 1, cima: 0 },
    lb2_legpress: { reps: 10, bajada: 3, fondo: 1, subida: 2, cima: 1 },
    lb2_legcurl: { reps: 12, bajada: 2, fondo: 0, subida: 1, cima: 2 },
    lb2_calf: { reps: 10, bajada: 2, fondo: 2, subida: 1, cima: 1 }
};