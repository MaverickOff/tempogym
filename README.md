# TempoGym 🏋️‍♂️

Temporizador de entrenamiento con control de tempo para ejercicios de gimnasio. Aplicación web progresiva con interfaz móvil optimizada.

## ✨ Características

- ⏱️ **Temporizador preciso**: Control de tempo para cada fase del ejercicio (bajada, fondo, subida, contracción)
- 🎯 **Rutinas predefinidas**: Sistema de presets para entrenamientos Upper Body y Lower Body
- ⏱️ **Calculadora de volumen de ejercicios**: Mide el volumen de los ejercicios en segundos con resultados en tiempo real
- 🎵 **Feedback de audio**: Pitidos sintéticos y anuncios de voz para guía durante el ejercicio
- 📱 **Interfaz móvil optimizada**: Control táctil por arrastre en inputs numéricos
- 🎨 **Diseño moderno**: Interfaz oscura con acentos en verde neón
- ⚡ **Rendimiento optimizado**: Construido con Vite para máxima velocidad

## 🚀 Instalación y Uso

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MaverickOff/tempogym.git
cd tempogym

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
tempogym/
├── 📄 CHANGELOG.md
├── 🎨 favicon.svg
├── 📄 index.html
├── 📄 package.json
├── 📁 css/
│   ├── 🎨 base.css
│   ├── 🎨 style.css
│   └── 📁 components/
│       ├── 🎨 buttons.css
│       ├── 🎨 cards.css
│       └── 🎨 timer.css
└── 📁 js/
    ├── ⚙️ app.js
    ├── 📁 components/
    │   ├── 🎯 ActionButtons.js
    │   ├── ⚙️ ConfigPanel.js
    │   └── ⏱️ TimerDisplay.js
    ├── 📁 config/
    │   ├── 🔧 app.js
    │   └── 📋 rutinas.js
    └── 📁 modules/
        └── 🔊 audio.js
```

## 🏗️ Arquitectura

### Componentes Principales

- **TimerDisplay**: Gestiona la visualización del temporizador y mensajes
- **ConfigPanel**: Maneja los inputs de configuración y carga de presets
- **ActionButtons**: Controla los botones de acción (empezar, pausar, reanudar)

### Módulos

- **audio.js**: Motor de audio nativo con osciladores y síntesis de voz
- **rutinas.js**: Base de datos de rutinas predefinidas
- **app.js**: Configuración global y constantes

## 🎯 Funcionalidades

### Sistema de Tempo

El temporizador guía al usuario a través de 4 fases:

1. **Bajada**: Controla la velocidad de descenso
2. **Fondo**: Tiempo en posición de estiramiento máximo
3. **Subida**: Velocidad de ascenso
4. **Contracción**: Tiempo de contracción en la cima

### Control Táctil

Los inputs numéricos soportan control por arrastre:
- Arrastrar hacia arriba: Incrementar valor
- Arrastrar hacia abajo: Decrementar valor

### Feedback de Audio

- Pitidos sintéticos para cada segundo
- Anuncios de voz para la última repetición
- Melodía de celebración al completar la serie
 
## 🛠️ Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Flexbox, Grid
- **JavaScript ES6+**: Módulos, async/await, clases
- **Vite**: Build tool y servidor de desarrollo
- **Web Audio API**: Generación de audio nativo
- **Speech Synthesis API**: Síntesis de voz

## 📝 Licencia

ISC

## 👤 Autor

MaverickOff

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para cualquier mejora o corrección.

## 📄 Changelog

Consulta el [CHANGELOG.md](CHANGELOG.md) para ver el historial de cambios.