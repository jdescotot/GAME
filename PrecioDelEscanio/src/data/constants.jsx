export const FACTIONS = [
    // === IZQUIERDA Y EXTREMA IZQUIERDA ===
    { 
        id: 'far_left', // Base de: FAR_LEFT
        name: 'Revolucionarios', 
        x: 5, y: 80, // Economía controlada + Autoritarismo de partido
        population: 10, // 10% de la población
        color: 'bg-red-900', 
        radius: 5,
        desc: 'Anti-capitalistas radicales, buscan la revolución.' 
    },
    { 
        id: 'com', // Base de: LEFT (Sindicatos)
        name: 'Clase Obrera Organizada', 
        x: 20, y: 60, // Izquierda económica, socialmente moderados
        population: 20, 
        color: 'bg-red-600', 
        radius: 35,
        desc: 'Derechos laborales, servicios públicos fuertes.' 
    },
    { 
        id: 'anarchist', // Base de: ANARCHIST (NUEVO)
        name: 'Progresistas', 
        x: 10, y: 10, // Economía comunal + Cero estado
        population: 5, 
        color: 'bg-gray-800', 
        radius: 5,
        desc: 'Autogestión, contra toda autoridad.' 
    },

    // === CENTRO Y ECOLOGISMO ===
    { 
        id: 'green', // Base de: GREEN (NUEVO)
        name: 'Ecologistas', 
        x: 35, y: 40, // Izquierda moderada + Libertad social
        population: 10, 
        color: 'bg-emerald-600', 
        radius: 10,
        desc: 'Sostenibilidad, justicia climática.' 
    },
    { 
        id: 'lib', // Base de: CENTER / MINOR
        name: 'Progresistas Urbanos', 
        x: 45, y: 30, // Centro económico + Libertades civiles
        population: 15, 
        color: 'bg-indigo-500', 
        radius: 20,
        desc: 'Derechos civiles, educación laica, globalismo.' 
    },
    { 
        id: 'pop', // Base de: POPULIST
        name: 'Desencantados / Indecisos', 
        x: 50, y: 50, // Centro absoluto (o apolíticos)
        population: 35, // Un gran bloque que decide elecciones
        color: 'bg-gray-400', 
        radius: 30,
        desc: 'Sin ideología fija, votan por carisma o contra el sistema.' 
    },

    // === DERECHA Y EXTREMA DERECHA ===
    { 
        id: 'cap', // Base de: RIGHT (Sector Empresarial)
        name: 'Libertarios de Mercado', 
        x: 90, y: 20, // Mercado libre absoluto + Poca intervención estatal
        population: 8, 
        color: 'bg-yellow-500', 
        radius: 35,
        desc: 'Bajos impuestos, estado mínimo, libre comercio.' 
    },
    { 
        id: 'conserv', // Base de: RIGHT (Conservadores)
        name: 'Conservadores Tradicionales', 
        x: 75, y: 75, // Derecha económica + Orden social
        population: 12, 
        color: 'bg-blue-600', 
        radius: 25,
        desc: 'Familia, religión, orden institucional.' 
    },
    { 
        id: 'far_right', // Base de: FAR_RIGHT
        name: 'Nacionalistas', 
        x: 95, y: 90, // Proteccionismo + Autoritarismo extremo
        population: 5, 
        color: 'bg-black', 
        radius: 10,
        desc: 'Identidad nacional, fronteras cerradas, mano dura.' 
    },
];

export const LAWS = [
  // === Leves iniciales (ajustadas) ===
  { title: "Privatización del Agua", type: "economic", favor: "FAR_RIGHT", fiscalCost: -2200, impact: { chaos: 10, approvalLeft: -20, approvalRight: 10 } },
  { title: "Salud Universal Gratuita", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: 2800, impact: { chaos: -5, approvalLeft: 20, approvalRight: -10 } },
  { title: "Ley de Mano Dura", type: "security", favor: "FAR_RIGHT", fiscalCost: 900, impact: { chaos: -20, approvalLeft: -20, approvalRight: 20 } },
  { title: "Subsidio al Desempleo", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: 1800, impact: { chaos: -5, approvalLeft: 15, approvalRight: -15 } },
  { title: "Recorte a la Cultura", type: "economic", favor: ["RIGHT", "CENTER"], fiscalCost: -400, impact: { chaos: 5, approvalLeft: -10, approvalRight: 5 } },

  // === Derecha (reclasificadas y ajustadas) ===
  { title: "Reforma de Impuesto Plano", type: "economic", favor: "FAR_RIGHT", fiscalCost: -2000, impact: { chaos: 10, approvalLeft: -25, approvalRight: 22 } },
  { title: "Ampliación de Seguridad Fronteriza", type: "security", favor: "FAR_RIGHT", fiscalCost: 1000, impact: { chaos: -5, approvalLeft: -20, approvalRight: 28 } },
  { title: "Desregulación de Trámites para Pymes", type: "economic", favor: ["RIGHT", "CENTER"], fiscalCost: -1000, impact: { chaos: 5, approvalLeft: -10, approvalRight: 20 } },
  { title: "Penas Mínimas Obligatorias para Narcotráfico", type: "security", favor: "FAR_RIGHT", fiscalCost: 800, impact: { chaos: -15, approvalLeft: -30, approvalRight: 25 } },
  { title: "Incentivos Fiscales para Combustibles Fósiles", type: "economic", favor: ["RIGHT", "CENTER"], fiscalCost: -1500, impact: { chaos: 15, approvalLeft: -28, approvalRight: 24 } },
  { title: "Prohibición de Ideología de Género en Escuelas Públicas", type: "social", favor: "FAR_RIGHT", fiscalCost: -150, impact: { chaos: 25, approvalLeft: -35, approvalRight: 30 } },
  { title: "Privatización del Transporte Público", type: "economic", favor: "FAR_RIGHT", fiscalCost: -1800, impact: { chaos: 20, approvalLeft: -22, approvalRight: 18 } },
  { title: "Subsidios a la Industria de Defensa Nacional", type: "economic", favor: ["RIGHT", "CENTER"], fiscalCost: 1200, impact: { chaos: -8, approvalLeft: -15, approvalRight: 26 } },
  { title: "Ley de Restauración de la Libertad Religiosa", type: "social", favor: ["RIGHT", "CENTER"], fiscalCost: -200, impact: { chaos: 18, approvalLeft: -24, approvalRight: 27 } },
  { title: "Deportación Acelerada de Delincuentes Indocumentados", type: "security", favor: "FAR_RIGHT", fiscalCost: 500, impact: { chaos: 5, approvalLeft: -27, approvalRight: 32 } },

  // === Izquierda (reclasificadas y ajustadas) ===
  { title: "Educación Universitaria Pública y Gratuita", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: 2200, impact: { chaos: -10, approvalLeft: 26, approvalRight: -22 } },
  { title: "Fondo para Transición Energética Verde", type: "economic", favor: ["GREEN", "LEFT"], fiscalCost: 2500, impact: { chaos: 8, approvalLeft: 28, approvalRight: -25 } },
  { title: "Control de Precios de Alquiler en Ciudades", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: 800, impact: { chaos: 12, approvalLeft: 24, approvalRight: -30 } },
  { title: "Subsidio Universal de Cuidado Infantil", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: 1900, impact: { chaos: -15, approvalLeft: 30, approvalRight: -18 } },
  { title: "Prohibición de Plásticos de Un Solo Uso", type: "economic", favor: "GREEN", fiscalCost: 600, impact: { chaos: 10, approvalLeft: 22, approvalRight: -20 } },
  { title: "Representación Obrera en Directorios Empresariales", type: "economic", favor: ["LEFT", "CENTER"], fiscalCost: 500, impact: { chaos: 5, approvalLeft: 25, approvalRight: -28 } },
  { title: "Descriminalización de Tenencia de Drogas", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: -400, impact: { chaos: 18, approvalLeft: 27, approvalRight: -32 } },
  { title: "Programa Piloto de Jornada Laboral de 4 Días", type: "economic", favor: ["LEFT", "CENTER"], fiscalCost: 1000, impact: { chaos: -5, approvalLeft: 29, approvalRight: -15 } },
  { title: "Impuesto a la Riqueza sobre Activos > $10M", type: "economic", favor: "FAR_LEFT", fiscalCost: -1700, impact: { chaos: 15, approvalLeft: 30, approvalRight: -35 } },
  { title: "Iniciativa Nacional de Construcción de Vivienda", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: 3000, impact: { chaos: -20, approvalLeft: 32, approvalRight: -20 } },

  // === Políticas Verdes ===
  { title: "Impuesto al Carbono con Dividendo Ciudadano", type: "economic", favor: ["GREEN", "CENTER"], fiscalCost: -1200, impact: { chaos: 12, approvalLeft: 25, approvalRight: -22 } },
  { title: "Programa Nacional de Reforestación y Restauración de Suelos", type: "economic", favor: ["GREEN", "LEFT"], fiscalCost: 1800, impact: { chaos: -10, approvalLeft: 20, approvalRight: 15 } },

  // === Políticas Nucleares ===
  { title: "Inversión en Centrales Nucleares de Nueva Generación", type: "economic", favor: ["RIGHT", "CENTER"], fiscalCost: 3200, impact: { chaos: 8, approvalLeft: 5, approvalRight: 18 } }, // Gasto extremo: infraestructura pesada
  { title: "Modernización de Gestión de Residuos Nucleares", type: "economic", favor: "CENTER", fiscalCost: 1200, impact: { chaos: -7, approvalLeft: 12, approvalRight: 12 } },

  // === Leyes extremas (solo 2-3) ===
  { title: "Nacionalización de la Banca Privada", type: "economic", favor: "FAR_LEFT", fiscalCost: 3500, impact: { chaos: 35, approvalLeft: 35, approvalRight: -40 } }, // Gasto extremo + caos
  { title: "Liquidación Total del Sector Público No Esencial", type: "economic", favor: "FAR_RIGHT", fiscalCost: -2500, impact: { chaos: 30, approvalLeft: -40, approvalRight: 35 } }, // Ahorro extremo + caos

  // === Nuevas leyes realistas (deuda e ingresos) ===
  { title: "Ley contra la Evasión Fiscal Internacional", type: "economic", favor: ["LEFT", "CENTER"], fiscalCost: -1800, impact: { chaos: -10, approvalLeft: 28, approvalRight: -20 } },
  { title: "Reestructuración de Deuda con Acreedores Externos", type: "economic", favor: "CENTER", fiscalCost: -2800, impact: { chaos: 20, approvalLeft: 10, approvalRight: 5 } },

  // === Neutrales (ajustadas) ===
  { title: "Reforma de la Comisión Electoral Independiente", type: "institutional", favor: "CENTER", fiscalCost: 400, impact: { chaos: -25, approvalLeft: 12, approvalRight: 12 } },
  { title: "Infraestructura de Identidad Digital y Gobierno Electrónico", type: "institutional", favor: "CENTER", fiscalCost: 1500, impact: { chaos: -10, approvalLeft: 15, approvalRight: 15 } },
  { title: "Ley de Protección a Denunciantes de Corrupción", type: "institutional", favor: "CENTER", fiscalCost: 300, impact: { chaos: -20, approvalLeft: 20, approvalRight: 20 } },
  { title: "Programa Nacional de Acceso a Banda Ancha", type: "economic", favor: "CENTER", fiscalCost: 1800, impact: { chaos: -8, approvalLeft: 18, approvalRight: 18 } },
  { title: "Reforma para Sostenibilidad del Sistema de Pensiones", type: "economic", favor: ["RIGHT", "CENTER"], fiscalCost: -900, impact: { chaos: 15, approvalLeft: -12, approvalRight: -12 } },
  { title: "Fondo Nacional de Resiliencia ante Desastres", type: "economic", favor: "CENTER", fiscalCost: 2000, impact: { chaos: -18, approvalLeft: 20, approvalRight: 20 } },
  { title: "Educación Cívica Obligatoria en Escuelas", type: "social", favor: "CENTER", fiscalCost: 600, impact: { chaos: -5, approvalLeft: 10, approvalRight: 10 } },
  { title: "Ley de Transparencia en Contrataciones Públicas", type: "institutional", favor: "CENTER", fiscalCost: -500, impact: { chaos: -15, approvalLeft: 16, approvalRight: 16 } },
  { title: "Marco de Rendición de Cuentas para Inteligencia Artificial", type: "institutional", favor: "CENTER", fiscalCost: 1000, impact: { chaos: 5, approvalLeft: 14, approvalRight: 14 } },
  { title: "Iniciativa de Acceso a Salud en Zonas Rurales", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: 1700, impact: { chaos: -12, approvalLeft: 18, approvalRight: 18 } },
  { title: "Programa Nacional de Recualificación Laboral", type: "economic", favor: "CENTER", fiscalCost: 1300, impact: { chaos: -10, approvalLeft: 16, approvalRight: 16 } },
  { title: "Iniciativa para Reducir Rezago Judicial", type: "institutional", favor: "CENTER", fiscalCost: 800, impact: { chaos: -20, approvalLeft: 18, approvalRight: 18 } },
  { title: "Marco de Asociaciones Público-Privadas en Infraestructura", type: "economic", favor: ["RIGHT", "CENTER"], fiscalCost: -600, impact: { chaos: 5, approvalLeft: 10, approvalRight: 10 } },
  { title: "Ampliación del Acceso a Salud Mental", type: "social", favor: ["LEFT", "CENTER"], fiscalCost: 1600, impact: { chaos: -15, approvalLeft: 22, approvalRight: 12 } },
  { title: "Ley de Protección de Datos y Privacidad del Consumidor", type: "institutional", favor: "CENTER", fiscalCost: 700, impact: { chaos: -8, approvalLeft: 20, approvalRight: 15 } },
  { title: "Sistema Estratégico de Reservas Alimentarias", type: "economic", favor: "CENTER", fiscalCost: 900, impact: { chaos: -12, approvalLeft: 14, approvalRight: 14 } },
  { title: "Mandato de Datos Gubernamentales Abiertos", type: "institutional", favor: "CENTER", fiscalCost: -200, impact: { chaos: -10, approvalLeft: 15, approvalRight: 15 } },
  { title: "Impulso a la Educación Técnica y Aprendizajes", type: "social", favor: "CENTER", fiscalCost: 1100, impact: { chaos: -7, approvalLeft: 17, approvalRight: 17 } },
  { title: "Programa Nacional de Ciberdefensa", type: "security", favor: "CENTER", fiscalCost: 1400, impact: { chaos: -10, approvalLeft: 16, approvalRight: 16 } },
  { title: "Plan de Conectividad Interregional", type: "economic", favor: ["RIGHT", "CENTER"], fiscalCost: 2200, impact: { chaos: -15, approvalLeft: 18, approvalRight: 18 } },
];