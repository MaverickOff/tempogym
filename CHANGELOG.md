# Registro de Cambios (Changelog)
Todos los cambios notables de este proyecto se documentarán en este archivo.

## [1.4.1] - 2026-04-24
### Fix: mejora UI al reanudar la serie
- Al reanudar la serie, el usuario dispone de los segundos de preparación y bajada inicial para sincronizarse de nuevo con el ritmo del ejercicio.
- Estilización de la lista de rutinas.

## [1.4.0] - 2026-04-23
### Empaquetado
- Implementación de CI/CD con Vite y Github Actions para mejorar el rendimiento de la web.

## [1.3.0] - 2026-04-21
### Refactorizado
- La arquitectura completa fue migrada a módulos. Separación lógica en audio.js, data.js y app.js.
- Modularización CSS para separar componentes (tarjetas, botones y timer).
- No hay cambios visuales ni funciones nuevas para el usuario, es una preparación para escalar el proyecto.

## [1.2.0] - 2026-04-19
### Añadido
- Sistema de rutinas predefinidas con menú desplegable (`<optgroup>`).
- Diccionario de datos para las rutinas Upper Body y Lower Body.
- Etiqueta de versión visible en el footer de la aplicación.

### Cambiado
- Traducción automática de la 'X' en el tempo a 1 segundo de subida explosiva.
- Feedback visual (pequeña animación) en las tarjetas al cargar un ejercicio.