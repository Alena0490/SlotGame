import Diamonds from '../img/symbols/diamondsCard.webp';
import Clubs from '../img/symbols/clubsCard.webp';
import Hearts from '../img/symbols/heartsCard.webp';
import Spades from '../img/symbols/spadesCard.webp';
import DiamondDiamonds from '../img/symbols/Diamonds.webp';
import DiamondClubs from '../img/symbols/Clubs.webp';
import DiamondHearts from '../img/symbols/Hearts.webp';
import DiamondSpades from '../img/symbols/Spades.webp';
import Hyena from '../img/symbols/Hyena.webp';
import Diamond from '../img/symbols/Diamond.webp';
import Harlequin from '../img/symbols/Harlequin.webp';    

export const getWeightedRandomSymbol = (): string => {
  const totalWeight = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const symbol of SYMBOLS) {
    random -= symbol.weight;
    if (random <= 0) return symbol.id;
  }
  
  return SYMBOLS[0].id; // fallback
};

export interface Symbol {
    id: string;
    name: string;
    image: string;
    className?: string;
  type: 'normal' | 'wild' | 'scatter';
  payouts: {
    three: number;   // 3 same symbols payout
    four: number;    // 4 same symbols payout
    five: number;    // 5 same symbols payout
  };
  weight: number; 
}

export const SYMBOLS: Symbol[] = [
  // LOW VALUE - cards
  {
    id: 'spades',
    name: 'Spades',
    image: Spades,
    type: 'normal',
    payouts: { three: 4, four: 8, five: 16 },
    weight: 90,
  },
  {
    id: 'clubs',
    name: 'Clubs',
    image: Clubs,
    type: 'normal',
    payouts: { three: 4, four: 8, five: 16 },
    weight: 90,
  },
  {
    id: 'diamonds',
    name: 'Diamonds',
    image: Diamonds,
    type: 'normal',
    payouts: { three: 4, four: 8, five: 16 },
    weight: 90,
  },
  {
    id: 'hearts',
    name: 'Hearts',
    image: Hearts,
    type: 'normal',
    payouts: { three: 4, four: 8, five: 16 },
    weight: 90,
  },
  
  // MEDIUM VALUE - diamond symbols
  {
    id: 'diamond-spades',
    name: 'Diamond Spades',
    image: DiamondSpades,
    type: 'normal',
    payouts: { three: 6, four: 14, five: 35 },
    weight: 65
  },
  {
    id: 'diamond-clubs',
    name: 'Diamond Clubs',
    image: DiamondClubs,
    type: 'normal',
    payouts: { three: 6, four: 14, five: 35 },
    weight: 65
  },
  {
    id: 'diamond-diamonds',
    name: 'Diamond Diamonds',
    image: DiamondDiamonds,
    type: 'normal',
    payouts: { three: 6, four: 14, five: 35 },
    weight: 65
  },
  {
    id: 'diamond-hearts',
    name: 'Diamond Hearts',
    image: DiamondHearts,
    type: 'normal',
    payouts: { three: 6, four: 14, five: 35 },
    weight: 65
  },
  
  // HIGH VALUE
  {
    id: 'hyena',
    name: 'Hyena',
    image: Hyena,
    className: 'symbol-hyena',
    type: 'normal',
    payouts: { three: 12, four: 30, five: 90 },
    weight: 40
  },
  
  // SPECIAL SYMBOLS
  {
    id: 'diamond',
    name: 'Diamond Scatter',
    image: Diamond,
    className: 'symbol-diamond',
    type: 'scatter',
    payouts: { three: 3, four: 8, five: 25 },
    weight: 15,
  },
  {
    id: 'harlequin',
    name: 'Harlequin Wild',
    image: Harlequin,
    className: 'symbol-harlequin',
    type: 'wild',
    payouts: { three: 20, four: 60, five: 300 }, // Wild has the highest payout
    weight: 12,
}
];

// Possible bet options
export const BET_OPTIONS = [10, 20, 50, 100, 200];

// Initial game settings
export const INITIAL_CREDIT = 1000;
export const MIN_BET = BET_OPTIONS[0];
export const MAX_BET = BET_OPTIONS[BET_OPTIONS.length - 1];

// Game field configuration
export const REELS_COUNT = 5;
export const ROWS_COUNT = 3;

// Define paylines 
export const PAYLINES = [
    [1, 1, 1, 1, 1],  // Middle row (index 1)
    [0, 0, 0, 0, 0],  // Top row (index 0)
    [2, 2, 2, 2, 2],  // Bottom row  (index 2)
    [0, 1, 2, 1, 0],  // 4. V-shape
    [2, 1, 0, 1, 2],  // 5. Λ-shape
    [1, 0, 0, 0, 1],  // 6. Top zigzag
    [1, 2, 2, 2, 1],  // 7. Bottom zigzag
    [0, 0, 1, 2, 2],  // 8. Increasing
    [2, 2, 1, 0, 0],  // 9. Decreasing
    [1, 2, 1, 0, 1],  // 10. W-shape
];

// Helper function to get symbol by ID
export const getSymbolById = (id: string): Symbol | undefined => {
  return SYMBOLS.find(symbol => symbol.id === id);
};

// Helper function to get all normal symbols
export const getNormalSymbols = (): Symbol[] => {
  return SYMBOLS.filter(symbol => symbol.type === 'normal');
};