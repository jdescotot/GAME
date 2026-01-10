import { IDEOLOGIES } from "../data/partyData.jsx";

// Función auxiliar para evitar nombres duplicados
const getUniqueName = (ideoData, usedNames) => {
  const availableNames = ideoData.names.filter(name => !usedNames.has(name));
  if (availableNames.length > 0) {
    const name = availableNames[Math.floor(Math.random() * availableNames.length)];
    usedNames.add(name);
    return name;
  }
  // Fallback: si todos los nombres están usados, añadimos un sufijo
  let index = 1;
  let fallbackName;
  do {
    fallbackName = `${ideoData.names[0]} ${index}`;
    index++;
  } while (usedNames.has(fallbackName));
  usedNames.add(fallbackName);
  return fallbackName;
};

export const generateRivals = (playerSeats) => {
  const rivals = [];
  let remainingSeats = 100 - playerSeats;
  const usedNames = new Set(); // ⬅️ Conjunto para evitar nombres duplicados

  // 1. LA OLIGARQUÍA (Excepción Específica)
  const oligarchySeats = Math.max(3, Math.floor(Math.random() * 6));
  const oligarchyData = IDEOLOGIES['RIGHT'];
  
  const oligarchyName = "Círculo Empresarial"; // Nombre fijo
  usedNames.add(oligarchyName);
  
  rivals.push({
    name: oligarchyName,
    seats: oligarchySeats,
    ideology: 'RIGHT',
    isOligarchy: true,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500',
    x: 85 + Math.random() * 10,
    y: 45 + Math.random() * 10
  });

  remainingSeats -= oligarchySeats;

  // 2. EL FRENTE REVOLUCIONARIO (Opuesto ideológico de la oligarquía)
  const farLeftSeats = Math.max(3, Math.floor(Math.random() * 6));
  const farLeftData = IDEOLOGIES['FAR_LEFT'] || IDEOLOGIES['LEFT'] || IDEOLOGIES['RIGHT'];
  
  const farLeftName = "Frente Revolucionario"; // Nombre fijo
  usedNames.add(farLeftName);
  
  rivals.push({
    name: farLeftName,
    seats: farLeftSeats,
    ideology: 'FAR_LEFT',
    isFarLeft: true,
    color: 'text-red-600',
    bg: 'bg-red-600',
    x: 5 + Math.random() * 10,
    y: 45 + Math.random() * 10
  });

  remainingSeats -= farLeftSeats;

  // 3. LOS GIGANTES (El Pueblo)
  const giantConfig = [
    { key: 'RIGHT', weight: 0.45 },
    { key: 'LEFT', weight: 0.35 }
  ];

  if (Math.random() > 0.6) {
    giantConfig.push({ key: 'CENTER', weight: 0.20 });
    giantConfig[0].weight = 0.35;
    giantConfig[1].weight = 0.25;
  }

  giantConfig.forEach((config) => {
    const ideoData = IDEOLOGIES[config.key];
    const name = getUniqueName(ideoData, usedNames);
    
    let seats = Math.floor(remainingSeats * config.weight);
    seats += Math.floor(Math.random() * 5) - 2;
    seats = Math.max(5, seats);

    rivals.push({
      name,
      seats,
      ideology: config.key,
      color: ideoData.color,
      bg: ideoData.bg,
      x: config.key === 'RIGHT' ? 65 + Math.random() * 15 : (config.key === 'LEFT' ? 15 + Math.random() * 15 : 45 + Math.random() * 10),
      y: 20 + Math.random() * 60
    });
  });

  // Recalculamos lo que queda para los partidos minoritarios
  const spentSeats = rivals.reduce((sum, r) => sum + r.seats, 0);
  remainingSeats = 100 - playerSeats - spentSeats; 

// 4. LOS MINORITARIOS (Relleno del hemiciclo)
if (remainingSeats > 0) {
  const minorCategories = ['GREEN', 'MINOR', 'CENTER', 'POPULIST', 'FAR_RIGHT', 'ANARCHIST'];
  // Mezclamos y evitamos repetir categorías
  const shuffledCategories = [...minorCategories].sort(() => Math.random() - 0.5);
  const usedMinorIdeologies = new Set();

  while (remainingSeats >= 2 && shuffledCategories.length > 0) {
    // Sacamos una categoría aleatoria sin repetir
    const randomIndex = Math.floor(Math.random() * shuffledCategories.length);
    const randomCat = shuffledCategories.splice(randomIndex, 1)[0];
    
    // Evitamos usar la misma ideología dos veces
    if (usedMinorIdeologies.has(randomCat)) continue;
    usedMinorIdeologies.add(randomCat);

    const ideoData = IDEOLOGIES[randomCat] || IDEOLOGIES['MINOR'];
    const name = getUniqueName(ideoData, usedNames);
    
    const seats = Math.min(remainingSeats, Math.max(2, Math.floor(Math.random() * 6)));
    remainingSeats -= seats;

    rivals.push({
      name,
      seats,
      ideology: randomCat,
      color: ideoData.color,
      bg: ideoData.bg,
      x: 10 + Math.random() * 80,
      y: 60 + Math.random() * 30 
    });
  }
}

  // Paso extra de limpieza: Si sobró 1 escaño suelto por redondeos, dáselo al partido más grande
  if (remainingSeats > 0) {
     rivals.sort((a,b) => b.seats - a.seats);
     rivals[0].seats += remainingSeats;
  }

  return rivals;
};