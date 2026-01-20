import { checkIdeologicalAlignment } from '../functions/ideologyAnalysis';

const getPartySupportForLaw = (partyIdeology, lawFavor, lawCost = 0, debtLevel = 0) => {
  if (!partyIdeology) return false;

  // Si la deuda es muy alta (>75%) y la ley cuesta dinero, los partidos responsables tienden a rechazar
  const highDebtMode = debtLevel > 75 && lawCost > 0;

  // Partidos que son más responsables fiscalmente
  const fiscallyResponsible = ['CENTER', 'RIGHT', 'CENTER_RIGHT'];
  const isFiscallyResponsible = fiscallyResponsible.includes(partyIdeology);

  // Si hay deuda crítica y ley costosa, los responsables rechazan más frecuentemente
  if (highDebtMode && isFiscallyResponsible) {
    // 70% de chance de rechazar leyes costosas en deuda alta
    if (Math.random() > 0.3) return false;
  }

  switch (partyIdeology) {
    case 'FAR_LEFT':
      return ['far-left', 'center-left'].includes(lawFavor);
    case 'LEFT':
      return ['center-left', 'green'].includes(lawFavor);
    case 'CENTER':
      return ['center-left', 'center-right', 'neutral', 'green'].includes(lawFavor);
    case 'RIGHT':
      return ['center-right', 'neutral'].includes(lawFavor);
    case 'FAR_RIGHT':
      return ['far-right', 'center-right'].includes(lawFavor);
    case 'GREEN':
      return ['green', 'center-left'].includes(lawFavor);
    case 'MINOR':
    case 'POPULIST':
      if (['far-left', 'far-right'].includes(lawFavor)) return Math.random() > 0.3;
      return ['center-left', 'center-right', 'neutral', 'green'].includes(lawFavor) && Math.random() > 0.5;
    default:
      return lawFavor === 'neutral' || Math.random() > 0.6;
  }
};

export const calculateLawVoteOutcome = ({
  currentLaw,
  rivalParties,
  playerSeats,
  playerVote,
  economy,
  gdpBase,
  playerFaction // <-- Nueva entrada
}) => {
  if (!currentLaw) {
    return {
      approved: false,
      error: "No law",
      messages: ["Error: No hay ley en curso."],
      cpDelta: 0
    };
  }

  let yesVotes = 0;
  let noVotes = 0;
  const messages = [];

  // Voto del jugador
  if (playerVote === 'approve') {
    yesVotes += playerSeats;
  } else {
    noVotes += playerSeats;
  }

  // Votos de partidos rivales (ahora considerando deuda)
  rivalParties.forEach(party => {
    const supports = getPartySupportForLaw(
      party.ideology, 
      currentLaw.favor,
      currentLaw.fiscalCost || 0,
      economy.debt || 0
    );
    if (supports) {
      yesVotes += party.seats;
    } else {
      noVotes += party.seats;
    }
  });

  const approved = yesVotes > noVotes;

  // --- CÁLCULO DE CAPITAL POLÍTICO ---
  let cpDelta = 0;
  let cpReason = "";

  const alignment = checkIdeologicalAlignment(playerFaction, currentLaw.favor);

  if (alignment === 'match') {
    if (approved && playerVote === 'approve') {
      cpDelta = 5;
      cpReason = "¡Victoria Ideológica! (+5 CP)";
    } else if (!approved && playerVote === 'approve') {
      cpDelta = -2;
      cpReason = "Promesa incumplida: Ley fallida (-2 CP)";
    } else if (playerVote === 'reject') {
      cpDelta = -5;
      cpReason = "Traición a las bases: Votaste contra tu ideología (-5 CP)";
    }
  } else if (alignment === 'opposing') {
    if (!approved && playerVote === 'reject') {
      cpDelta = 3;
      cpReason = "Bloqueo exitoso a la oposición (+3 CP)";
    } else if (approved && playerVote === 'reject') {
      cpDelta = 0;
      cpReason = "Oposición ignorada (0 CP)";
    } else if (playerVote === 'approve') {
      cpDelta = -3;
      cpReason = "Colaboracionismo con el rival (-3 CP)";
    }
  } else {
    // Neutral / centro
    if (approved) {
      cpDelta = 1;
      cpReason = "Gobernabilidad (+1 CP)";
    }
  }

  if (cpReason) messages.push(cpReason);

  // --- EFECTOS ECONÓMICOS ---
  let fiscalImpact = 0;
  let newAnnualSpending = economy.annualSpending;
  let newDebt = economy.debt;

  if (approved) {
    messages.push(`Ley "${currentLaw.title}" APROBADA.`);
    fiscalImpact = currentLaw.fiscalCost || 0;
    newAnnualSpending += fiscalImpact;

    if (fiscalImpact > 0) {
      messages.push(`El gasto público aumenta en $${fiscalImpact}M`);
    } else if (fiscalImpact < 0) {
      messages.push(`El estado ahorra $${Math.abs(fiscalImpact)}M`);
    }
  } else {
    messages.push(`Ley "${currentLaw.title}" RECHAZADA.`);
  }

  // Cálculo de deuda (proyección anual)
  const revenue = (economy.taxRate / 100) * gdpBase;
  const deficit = newAnnualSpending - revenue;
  const debtChange = deficit / 1000; // Asumiendo que GDP está en millones, deuda en % del PIB
  newDebt = Math.max(0, economy.debt + debtChange);

  const debtExceeds90 = newDebt > 90 && economy.debt <= 90;

  return {
    approved,
    yesVotes,
    noVotes,
    fiscalImpact,
    newAnnualSpending,
    newDebt,
    debtExceeds90,
    messages,
    cpDelta
  };
};