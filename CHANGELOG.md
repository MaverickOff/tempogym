# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.0] - 2026-05-10

### Added
- Interfaz para calcular volumen de ejercicios

## Improved
- Eliminación de código basura y clases innecesarias

## [1.5.0] - 2026-04-30

### Added
- Componentes UI reutilizables (TimerDisplay, ConfigPanel, ActionButtons)
- Configuración centralizada en js/config/ (app.js, rutinas.js)
- Documentación mejorada con JSDoc en todos los módulos
- CHANGELOG.md con formato estándar Keep a Changelog

### Changed
- Reorganización completa de estructura JavaScript:
  - Movido data.js a config/rutinas.js
  - Creada carpeta components/ para componentes UI
  - Mejorada separación de responsabilidades
- Refactorización de app.js para usar arquitectura de componentes
- Mejorada modularidad y escalabilidad del código

### Improved
- **Escalabilidad**: Añadir nuevas funcionalidades es más sencillo gracias a la arquitectura modular
- **Mantenibilidad**: Cada componente tiene su responsabilidad clara y bien definida
- **Reutilización**: Componentes pueden usarse en otros proyectos
- **Documentación**: Código mejor documentado con comentarios JSDoc
- **Arquitectura**: Estructura profesional preparada para crecer

### Technical Details
- Nueva estructura de carpetas:
  ```
  js/
  ├── app.js (lógica principal)
  ├── components/ (UI reutilizables)
  │   ├── TimerDisplay.js
  │   ├── ConfigPanel.js
  │   └── ActionButtons.js
  ├── config/ (configuración y datos)
  │   ├── app.js (constantes globales)
  │   └── rutinas.js (presets de ejercicios)
  └── modules/ (módulos funcionales)
      └── audio.js
  ```

## [1.4.1] - 2026-04-24

### Fixed
- Mejora UI al reanudar la serie
- Al reanudar la serie, el usuario dispone de los segundos de preparación y bajada inicial para sincronizarse de nuevo con el ritmo del ejercicio
- Estilización de la lista de rutinas

## [1.4.0] - 2026-04-23

### Added
- Implementación de CI/CD con Vite y Github Actions para mejorar el rendimiento de la web

## [1.3.0] - 2026-04-21

### Refactored
- La arquitectura completa fue migrada a módulos
- Separación lógica en audio.js, data.js y app.js
- Modularización CSS para separar componentes (tarjetas, botones y timer)
- No hay cambios visuales ni funciones nuevas para el usuario, es una preparación para escalar el proyecto

## [1.2.0] - 2026-04-19

### Added
- Sistema de rutinas predefinidas con menú desplegable (`<optgroup>`)
- Diccionario de datos para las rutinas Upper Body y Lower Body
- Etiqueta de versión visible en el footer de la aplicación

### Changed
- Traducción automática de la 'X' en el tempo a 1 segundo de subida explosiva
- Feedback visual (pequeña animación) en las tarjetas al cargar un ejercicio