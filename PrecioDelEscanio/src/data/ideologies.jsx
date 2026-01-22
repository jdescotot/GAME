// src/data/ideologies.js

export const IDEOLOGY_TYPES = {
  FAR_LEFT: 'FAR_LEFT',
  LEFT: 'LEFT',
  CENTER_LEFT: 'CENTER_LEFT',
  GREEN: 'GREEN',
  CENTER: 'CENTER',
  CENTER_RIGHT: 'CENTER_RIGHT',
  RIGHT: 'RIGHT',
  LIBERTARIAN: 'LIBERTARIAN',
  FAR_RIGHT: 'FAR_RIGHT',
  POPULIST: 'POPULIST',
  ANARCHIST: 'ANARCHIST',
  INDIGENOUS: 'INDIGENOUS' // Minorías/Regionalistas
};

// Configuración Maestra
export const IDEOLOGIES = {
  [IDEOLOGY_TYPES.FAR_LEFT]: {
    id: IDEOLOGY_TYPES.FAR_LEFT,
    label: "Comunismo / Extrema Izquierda",
    shortLabel: "Ext. Izq",
    color: "#b91c1c", // Rojo oscuro
    bg: "rgba(185, 28, 28, 0.2)",
    allies: [IDEOLOGY_TYPES.LEFT, IDEOLOGY_TYPES.ANARCHIST, IDEOLOGY_TYPES.POPULIST],
    opponents: [IDEOLOGY_TYPES.RIGHT, IDEOLOGY_TYPES.FAR_RIGHT, IDEOLOGY_TYPES.LIBERTARIAN]
  },
  [IDEOLOGY_TYPES.LEFT]: {
    id: IDEOLOGY_TYPES.LEFT,
    label: "Socialdemocracia",
    shortLabel: "Soc. Dem",
    color: "#ef4444", // Rojo estándar
    bg: "rgba(239, 68, 68, 0.2)",
    allies: [IDEOLOGY_TYPES.FAR_LEFT, IDEOLOGY_TYPES.GREEN, IDEOLOGY_TYPES.CENTER_LEFT],
    opponents: [IDEOLOGY_TYPES.FAR_RIGHT, IDEOLOGY_TYPES.LIBERTARIAN]
  },
  [IDEOLOGY_TYPES.GREEN]: {
    id: IDEOLOGY_TYPES.GREEN,
    label: "Ecologismo",
    shortLabel: "Verdes",
    color: "#22c55e", // Verde vibrante
    bg: "rgba(34, 197, 94, 0.2)",
    allies: [IDEOLOGY_TYPES.LEFT, IDEOLOGY_TYPES.CENTER_LEFT],
    opponents: [IDEOLOGY_TYPES.FAR_RIGHT, IDEOLOGY_TYPES.RIGHT]
  },
  [IDEOLOGY_TYPES.CENTER_LEFT]: {
    id: IDEOLOGY_TYPES.CENTER_LEFT,
    label: "Progresismo / Centro Izquierda",
    shortLabel: "C. Izq",
    color: "#f97316", // Naranja
    bg: "rgba(249, 115, 22, 0.2)",
    allies: [IDEOLOGY_TYPES.LEFT, IDEOLOGY_TYPES.GREEN, IDEOLOGY_TYPES.CENTER],
    opponents: [IDEOLOGY_TYPES.FAR_RIGHT]
  },
  [IDEOLOGY_TYPES.CENTER]: {
    id: IDEOLOGY_TYPES.CENTER,
    label: "Liberalismo / Centro",
    shortLabel: "Centro",
    color: "#eab308", // Amarillo
    bg: "rgba(234, 179, 8, 0.2)",
    allies: [IDEOLOGY_TYPES.CENTER_LEFT, IDEOLOGY_TYPES.CENTER_RIGHT],
    opponents: [IDEOLOGY_TYPES.ANARCHIST, IDEOLOGY_TYPES.FAR_LEFT, IDEOLOGY_TYPES.FAR_RIGHT]
  },
  [IDEOLOGY_TYPES.CENTER_RIGHT]: {
    id: IDEOLOGY_TYPES.CENTER_RIGHT,
    label: "Democracia Cristiana / Centro Derecha",
    shortLabel: "C. Der",
    color: "#3b82f6", // Azul claro
    bg: "rgba(59, 130, 246, 0.2)",
    allies: [IDEOLOGY_TYPES.CENTER, IDEOLOGY_TYPES.RIGHT, IDEOLOGY_TYPES.LIBERTARIAN],
    opponents: [IDEOLOGY_TYPES.FAR_LEFT, IDEOLOGY_TYPES.ANARCHIST]
  },
  [IDEOLOGY_TYPES.RIGHT]: {
    id: IDEOLOGY_TYPES.RIGHT,
    label: "Conservadurismo",
    shortLabel: "Derecha",
    color: "#1e40af", // Azul fuerte
    bg: "rgba(30, 64, 175, 0.2)",
    allies: [IDEOLOGY_TYPES.CENTER_RIGHT, IDEOLOGY_TYPES.FAR_RIGHT, IDEOLOGY_TYPES.LIBERTARIAN],
    opponents: [IDEOLOGY_TYPES.LEFT, IDEOLOGY_TYPES.FAR_LEFT, IDEOLOGY_TYPES.GREEN]
  },
  [IDEOLOGY_TYPES.FAR_RIGHT]: {
    id: IDEOLOGY_TYPES.FAR_RIGHT,
    label: "Nacionalismo / Extrema Derecha",
    shortLabel: "Ext. Der",
    color: "#1e3a8a", // Azul muy oscuro casi negro
    bg: "rgba(30, 58, 138, 0.2)",
    allies: [IDEOLOGY_TYPES.RIGHT, IDEOLOGY_TYPES.POPULIST],
    opponents: [IDEOLOGY_TYPES.LEFT, IDEOLOGY_TYPES.FAR_LEFT, IDEOLOGY_TYPES.GREEN, IDEOLOGY_TYPES.INDIGENOUS]
  },
  [IDEOLOGY_TYPES.LIBERTARIAN]: {
    id: IDEOLOGY_TYPES.LIBERTARIAN,
    label: "Libertarismo",
    shortLabel: "Libertario",
    color: "#8b5cf6", // Violeta
    bg: "rgba(139, 92, 246, 0.2)",
    allies: [IDEOLOGY_TYPES.RIGHT, IDEOLOGY_TYPES.CENTER_RIGHT],
    opponents: [IDEOLOGY_TYPES.FAR_LEFT, IDEOLOGY_TYPES.LEFT, IDEOLOGY_TYPES.POPULIST]
  },
  [IDEOLOGY_TYPES.ANARCHIST]: {
    id: IDEOLOGY_TYPES.ANARCHIST,
    label: "Anarquismo",
    shortLabel: "Anarq",
    color: "#171717", // Negro
    bg: "rgba(0, 0, 0, 0.2)",
    allies: [IDEOLOGY_TYPES.FAR_LEFT],
    opponents: [IDEOLOGY_TYPES.RIGHT, IDEOLOGY_TYPES.FAR_RIGHT, IDEOLOGY_TYPES.CENTER]
  },
  [IDEOLOGY_TYPES.POPULIST]: {
    id: IDEOLOGY_TYPES.POPULIST,
    label: "Populismo (Transversal)",
    shortLabel: "Populista",
    color: "#db2777", // Rosa fuerte
    bg: "rgba(219, 39, 119, 0.2)",
    allies: [IDEOLOGY_TYPES.FAR_LEFT, IDEOLOGY_TYPES.FAR_RIGHT], // Teoría de la herradura
    opponents: [IDEOLOGY_TYPES.CENTER, IDEOLOGY_TYPES.LIBERTARIAN]
  },
  [IDEOLOGY_TYPES.INDIGENOUS]: {
    id: IDEOLOGY_TYPES.INDIGENOUS,
    label: "Movimiento Indígena/Regional",
    shortLabel: "Indígena",
    color: "#14b8a6", // Turquesa
    bg: "rgba(20, 184, 166, 0.2)",
    allies: [IDEOLOGY_TYPES.LEFT, IDEOLOGY_TYPES.GREEN],
    opponents: [IDEOLOGY_TYPES.FAR_RIGHT, IDEOLOGY_TYPES.RIGHT]
  }
};