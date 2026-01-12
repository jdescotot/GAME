import { FACTIONS as FACTION_TEMPLATES } from '../data/constants';

// Perfiles de país para variar la partida (Misma lógica que hablamos)
const COUNTRY_PROFILES = {
  BALANCED: { name: "República Equilibrada", weights: {} },
  CONSERVATIVE_HAVEN: { 
    name: "Bastión Conservador", 
    weights: { conserv: 1.5, far_right: 1.3, cap: 1.2, com: 0.7, far_left: 0.5 } 
  },
  SOCIALIST_REPUBLIC: { 
    name: "República Popular", 
    weights: { com: 1.6, far_left: 1.4, green: 1.2, cap: 0.6, conserv: 0.6 } 
  },
  POLARIZED_HELL: { 
    name: "Nación Dividida", 
    weights: { pop: 0.4, far_left: 1.8, far_right: 1.8, com: 0.8, conserv: 0.8 } 
  },
  APATHETIC_STATE: { 
    name: "Sociedad Despolitizada", 
    weights: { pop: 2.5, far_left: 0.5, far_right: 0.5 } 
  }
};

export const generateFactions = () => {
  // 1. Elegir perfil aleatorio
  const profileKeys = Object.keys(COUNTRY_PROFILES);
  const profile = COUNTRY_PROFILES[profileKeys[Math.floor(Math.random() * profileKeys.length)]];
  
  console.log(`Generando país: ${profile.name}`);

  let generatedFactions = [];
  let totalWeight = 0;

  // 2. Usamos TU constante como base
  FACTION_TEMPLATES.forEach(template => {
    const multiplier = profile.weights[template.id] || 1;
    
    // Variación aleatoria (+/- 20%)
    const randomVar = 0.8 + (Math.random() * 0.4); 
    
    // Calculamos población bruta basada en tu valor original 'population'
    let rawPop = template.population * multiplier * randomVar;
    rawPop = Math.max(2, rawPop); 

    // Variación de Posición (Jitter)
    const jitterX = (Math.random() * 10) - 5; 
    const jitterY = (Math.random() * 10) - 5;
    
    // Variación de Radio (Usamos tu nuevo valor 'radius')
    const baseRadius = template.radius || 15; // Fallback por si alguno no tiene radio
    const jitterRadius = (Math.random() * 10) - 5;

    generatedFactions.push({
      ...template, // Copiamos nombre, color, desc, id...
      x: Math.min(100, Math.max(0, template.x + jitterX)),
      y: Math.min(100, Math.max(0, template.y + jitterY)),
      radius: Math.max(5, baseRadius + jitterRadius),
      rawPop: rawPop 
    });

    totalWeight += rawPop;
  });

  // 3. Normalizar al 100%
  let currentSum = 0;
  generatedFactions = generatedFactions.map((f, index) => {
    let finalPop = Math.round((f.rawPop / totalWeight) * 100);
    
    if (index === generatedFactions.length - 1) {
      finalPop = 100 - currentSum;
    } else {
      currentSum += finalPop;
    }

    // Limpiamos propiedad temporal y devolvemos
    const { rawPop, ...finalFaction } = f;
    return { ...finalFaction, population: finalPop };
  });

  return generatedFactions;
};