import { IDEOLOGIES } from "../data/partyData.jsx";

export const generateRivals = (playerSeats) => {
  const rivals = [];
  let remainingSeats = 100 - playerSeats;

  // 1. LA OLIGARQUÍA (Excepción Específica)
  // Queremos que siempre exista, sea pequeña (pocos escaños) pero clara.
  // Asumimos que IDEOLOGIES tiene una key 'RIGHT' o 'LIBERTARIAN' para ellos.
  const oligarchySeats = Math.max(3, Math.floor(Math.random() * 6)); // Entre 3 y 5 escaños fijos
  const oligarchyData = IDEOLOGIES['RIGHT']; // O 'LIBERTARIAN' si lo tienes en tu data
  
  rivals.push({
    name: "Círculo Empresarial", // Nombre forzado o random de la lista
    seats: oligarchySeats,
    ideology: 'RIGHT',
    isOligarchy: true, // Flag útil para lógica futura (lobby, corrupción)
    color: 'text-yellow-500', // Forzamos visualmente que se distingan
    bg: 'bg-yellow-500',
    x: 85 + Math.random() * 10, // Siempre muy a la derecha
    y: 45 + Math.random() * 10  // En el centro vertical (poder económico)
  });

  remainingSeats -= oligarchySeats;

  // 2. LOS GIGANTES (El Pueblo)
  // En lugar de ser random, forzamos que Conservadores y Sindicatos sean los principales.
  
  // Definimos los gigantes con sus "Pesos" demográficos
  const giantConfig = [
    { key: 'RIGHT', weight: 0.45 }, // Conservadores: ~45% de lo que queda
    { key: 'LEFT', weight: 0.35 }   // Sindicatos: ~35% de lo que queda
  ];

  // A veces aparece un tercer gigante (Centro) robando votos a ambos
  if (Math.random() > 0.6) {
    giantConfig.push({ key: 'CENTER', weight: 0.20 });
    // Ajustamos pesos si entra el centro
    giantConfig[0].weight = 0.35;
    giantConfig[1].weight = 0.25;
  }

  // Generamos los Gigantes
  giantConfig.forEach((config) => {
    const ideoData = IDEOLOGIES[config.key];
    const name = ideoData.names[Math.floor(Math.random() * ideoData.names.length)];
    
    // Calculamos escaños basados en el peso asignado
    let seats = Math.floor(remainingSeats * config.weight);
    
    // Pequeña variación aleatoria (+- 2 escaños) para que no sea estático
    seats += Math.floor(Math.random() * 5) - 2;
    
    // Seguridad: Que no sea 0 ni negativo
    seats = Math.max(5, seats);

    rivals.push({
      name,
      seats,
      ideology: config.key,
      color: ideoData.color,
      bg: ideoData.bg,
      // Mantenemos tu lógica de coordenadas
      x: config.key === 'RIGHT' ? 65 + Math.random() * 15 : (config.key === 'LEFT' ? 15 + Math.random() * 15 : 45 + Math.random() * 10),
      y: 20 + Math.random() * 60
    });
  });

  // Recalculamos lo que queda para los partidos minoritarios
  const spentSeats = rivals.reduce((sum, r) => sum + r.seats, 0); // Ojo: esto incluye la oligarquía que pusimos antes
  remainingSeats = 100 - playerSeats - spentSeats; 

  // 3. LOS MINORITARIOS (Relleno del hemiciclo)
  // Usamos tu lógica original para rellenar lo que sobre
  if (remainingSeats > 0) {
    const minorCategories = ['GREEN', 'MINOR', 'CENTER', 'POPULIST'];
    
    // Intentamos crear tantos partidos pequeños como quepan (mínimo 2 escaños por partido)
    while (remainingSeats >= 2) {
      const randomCat = minorCategories[Math.floor(Math.random() * minorCategories.length)];
      const ideoData = IDEOLOGIES[randomCat] || IDEOLOGIES['MINOR'];
      
      const name = ideoData.names[Math.floor(Math.random() * ideoData.names.length)];
      
      // Asignamos entre 2 y 6 escaños, o lo que quede
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