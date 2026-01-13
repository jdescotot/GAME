import { useState, useEffect, useCallback } from 'react';
import { generateRivals } from '../functions/generateRivals';
import { generateFactions } from '../functions/generateFactions';
import { LAWS } from '../data/constants';
import { calculateTaxVoteOutcome } from './taxVotingLogic';
import { calculateLawVoteOutcome } from './lawVotingLogic';
import { determineClosestFaction } from '../functions/ideologyAnalysis';

const GDP_BASE = 100000;
const TURNS_PER_LEGISLATURE = 20;

export const useGameLogic = () => {
  // --- Estados (igual que antes) ---
  const [phase, setPhase] = useState('setup');
  const [turn, setTurn] = useState(1);
  const [legislature, setLegislature] = useState(1);
  const [messages, setMessages] = useState([]);
  const [activeFactions, setActiveFactions] = useState(() => generateFactions());
  const [partyName, setPartyName] = useState('Nuevo Movimiento');
  const [ideologyX, setIdeologyX] = useState(50);
  const [ideologyY, setIdeologyY] = useState(50);
  const [resources, setResources] = useState({
    money: 1000,
    politicalCapital: 20,
    seats: 5,
    popularity: 10,
  });
  const [economy, setEconomy] = useState({
    debt: 40,
    taxRate: 20,
    annualSpending: 18000
  });
  const [taxProposal, setTaxProposal] = useState(20);
  const [rivalParties, setRivalParties] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentLaw, setCurrentLaw] = useState(null);
  const [viewMode, setViewMode] = useState('seats');

  // --- Generación de candidatos (igual) ---
  const generateCandidate = useCallback((id) => ({
    id, 
    name: `Político ${id}`, 
    oratory: Math.floor(Math.random() * 100), 
    loyalty: 50 + Math.floor(Math.random() * 50), 
    powerHunger: Math.floor(Math.random() * 100)
  }), []);

  useEffect(() => {
    setCandidates([generateCandidate(1), generateCandidate(2), generateCandidate(3)]);
  }, [generateCandidate]);

  // --- Sistema de mensajes (igual) ---
  const addMessage = (text, type = 'neutral') => {
    const colorMap = { error: 'text-red-500', success: 'text-green-500', warning: 'text-yellow-500' };
    const uniqueId = Date.now() + Math.random();
    setMessages(prev => [{ text, color: colorMap[type] || '', id: uniqueId }, ...prev.slice(0, 4)]);
  };

  const handleFundarPartido = () => {
    const generated = generateRivals(resources.seats || 5);
    setRivalParties(generated);
    setPhase('dashboard');
    addMessage(`¡${partyName} fundado! La economía está al ${economy.taxRate}% de impuestos.`, "success");
  };

  const holdElections = () => {
    const newSeats = Math.max(1, Math.min(35, Math.floor((resources.popularity / 100) * 35)));
    const change = newSeats - resources.seats;
    if (change > 0) addMessage(`¡Victoria electoral! Ganas ${change} escaños (${newSeats} total).`, "success");
    else if (change < 0) addMessage(`Derrota electoral. Pierdes ${Math.abs(change)} escaños (${newSeats} total).`, "error");
    else addMessage(`Empate electoral. Conservas ${newSeats} escaños.`, "warning");
    setResources(prev => ({ ...prev, seats: newSeats }));
    setRivalParties(generateRivals(newSeats));
    setTurn(1);
    setLegislature(prev => prev + 1);
  };

  const endTurn = () => {
    const nextTurn = turn + 1;
    if (nextTurn > TURNS_PER_LEGISLATURE) {
      holdElections();
    } else {
      setTurn(nextTurn);
    }
  };

  // --- Propuesta de cambio de impuestos (ahora delegado) ---
  const proposeTaxChange = () => {
    const result = calculateTaxVoteOutcome({
      taxProposal,
      currentTaxRate: economy.taxRate,
      rivalParties,
      playerSeats: resources.seats
    });

    if (result.error === "No change") return;

    result.messages.forEach(msg => {
      const type = msg.includes("APROBADA") || msg.includes("alegra") ? "success" :
                   msg.includes("RECHAZADA") ? "error" : "warning";
      addMessage(msg, type);
    });

    if (result.approved) {
      setEconomy(prev => ({ ...prev, taxRate: result.newTaxRate }));
      setResources(prev => ({
        ...prev,
        popularity: Math.min(100, Math.max(0, prev.popularity + result.popularityDelta))
      }));
    } else {
      setTaxProposal(economy.taxRate);
    }

    endTurn();
  };

  // --- Acciones de turno (igual) ---
  const handleAction = (actionType) => {
    // ... (sin cambios, ya es corto)
  };

  const startLegislativeSession = () => {
    const randomLaw = LAWS[Math.floor(Math.random() * LAWS.length)];
    setCurrentLaw(randomLaw);
    setPhase('legislation');
  };

  // --- Votación de leyes (ahora delegado) ---
  const voteOnLaw = (playerVote) => {
    const result = calculateLawVoteOutcome({
      currentLaw,
      rivalParties,
      playerSeats: resources.seats,
      playerVote,
      economy,
      gdpBase: GDP_BASE
    });

    if (result.error) {
      addMessage(result.messages[0], "error");
      setPhase('dashboard');
      setCurrentLaw(null);
      return;
    }

    result.messages.forEach(msg => {
      const type = msg.includes("APROBADA") || msg.includes("ahorra") ? "success" :
                   msg.includes("RECHAZADA") ? "error" : "warning";
      addMessage(msg, type);
    });

    if (result.debtExceeds90) {
      addMessage("¡PELIGRO! La deuda está crítica.", "error");
    }

    setEconomy(prev => ({
      ...prev,
      annualSpending: result.newAnnualSpending,
      debt: result.newDebt
    }));

    setPhase('dashboard');
    setCurrentLaw(null);
    endTurn();
  };

  // --- Lógica de Ideología (NUEVO) ---

  // 1. Calculamos la ideología actual basada en los sliders en tiempo real
  const currentIdeology = determineClosestFaction(ideologyX, ideologyY);

  // 2. Función para cuando el usuario hace clic en un botón de facción
  const setIdeologyPreset = (faction) => {
    setIdeologyX(faction.x);
    setIdeologyY(faction.y);
  };

  return {
    phase, rivalParties, viewMode, setViewMode, turn, legislature, messages, 
    partyName, setPartyName, ideologyX, setIdeologyX, ideologyY, setIdeologyY,
    resources, candidates, currentLaw, economy, setEconomy,
    taxProposal, setTaxProposal, proposeTaxChange,
    handleFundarPartido, handleAction, startLegislativeSession, voteOnLaw, activeFactions,currentIdeology, 
    setIdeologyPreset,
  };
};