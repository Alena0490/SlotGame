import { getWeightedRandomSymbol, getSymbolById, PAYLINES } from '../data/data';
import { SYMBOLS } from '../data/data';
import type { Symbol } from '../data/data';

interface DetailedResults {
    rtp: number;
    hitRate: number;
    biggestWin: number;
    totalBet: number;
    totalWin: number;
    duration: number;
    symbolFrequency: Record<string, number>;
    volatility: string;
    averageWin: number;
    winDistribution: {
        small: number;    // 1-10x bet
        medium: number;   // 10-50x bet
        big: number;      // 50-100x bet
        mega: number;     // 100x+ bet
    };
}

interface WinResult {
  amount: number;
  winningPositions: Array<{col: number, row: number, lineIndex: number}>;
}

interface LineWinResult {
  win: number;
  positions: number[];
  lineIndex: number;
}

// Generate random symbols
const generateRandomSymbols = (): string[][] => {
  const result: string[][] = [];
  
  for (let i = 0; i < 5; i++) {
    const reel: string[] = [];
    for (let j = 0; j < 3; j++) { 
      reel.push(getWeightedRandomSymbol());
    }
    result.push(reel);
  }
  
  return result;
}

// Check line for win
const checkLineForWin = (line: string[], bet: number, lineIndex: number): LineWinResult => {
  const firstSymbol = line[0];
  let count = 1; 
      
  for (let i = 1; i < line.length; i++) {
    if (line[i] === firstSymbol || line[i] === 'harlequin') {
      count++; 
    } else {
      break;
    }
  }
  
  if (count >= 3) {
    const symbol = getSymbolById(firstSymbol);
    if (!symbol) return { win: 0, positions: [], lineIndex }; 
    
    let payout = 0;
    if (count === 3) payout = symbol.payouts.three;
    else if (count === 4) payout = symbol.payouts.four;
    else if (count === 5) payout = symbol.payouts.five;
    
    const positions = Array.from({length: count}, (_, i) => i);
    return { win: bet * payout, positions, lineIndex }; 
  }

  return { win: 0, positions: [], lineIndex };
}

// Check scatter win
const checkScatterWin = (reels: string[][], bet: number): {win: number, positions: Array<{col: number, row: number}>} => {
  let scatterCount = 0;
  const scatterPositions: Array<{col: number, row: number}> = [];
  
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 3; row++) {
      if (reels[col][row] === 'diamond') {
        scatterCount++;
        scatterPositions.push({col, row});
      }
    }
  }
  
  if (scatterCount >= 3) {
    const scatter = getSymbolById('diamond');
    if (!scatter) return { win: 0, positions: [] };
    
    let payout = 0;
    if (scatterCount === 3) payout = scatter.payouts.three;
    else if (scatterCount === 4) payout = scatter.payouts.four;
    else if (scatterCount >= 5) payout = scatter.payouts.five;
    
    return { win: bet * payout, positions: scatterPositions };
  }
  
  return { win: 0, positions: [] };
}

// Check win
const checkWin = (reels: string[][], bet: number): WinResult => {
  let totalWin = 0;
  const winningPositions: Array<{col: number, row: number, lineIndex: number}> = [];
  
  PAYLINES.forEach((payline, lineIndex) => {
    const line = payline.map((row, colIndex) => reels[colIndex][row]);
    const result = checkLineForWin(line, bet, lineIndex);  
    if (result.win > 0) { 
      totalWin += result.win;
      result.positions.forEach(col => {
        winningPositions.push({col, row: payline[col], lineIndex});
      })
    }
  });

  const scatterWin = checkScatterWin(reels, bet);
  totalWin += scatterWin.win;
  scatterWin.positions.forEach(pos => {
    winningPositions.push({col: pos.col, row: pos.row, lineIndex: -1});
  });
  
  return { amount: totalWin, winningPositions };  
}

export const runMonteCarloSimulation = (
    spins: number = 1000000, 
    bet: number = 20
): DetailedResults => {
    let totalBet = 0;
    let totalWin = 0;
    let winCount = 0;
    let biggestWin = 0;
    const symbolFrequency: Record<string, number> = {};
    const allWins: number[] = [];
    
    // Win distribution counters
    let smallWins = 0;   // 1-10x
    let mediumWins = 0;  // 10-50x
    let bigWins = 0;     // 50-100x
    let megaWins = 0;    // 100x+

    SYMBOLS.forEach((symbol: Symbol) => {
        symbolFrequency[symbol.id] = 0;
    });

    console.log('🎰 Starting Monte Carlo Simulation...');
    const startTime = Date.now();

    for (let i = 0; i < spins; i++) {
        totalBet += bet;
        
        const reels = generateRandomSymbols();
        
        reels.forEach((reel) => {
            reel.forEach((symbolId) => {
                symbolFrequency[symbolId]++;
            });
        });
        
        const winResult = checkWin(reels, bet);
        totalWin += winResult.amount;
        
        if (winResult.amount > 0) {
            winCount++;
            allWins.push(winResult.amount);
            
            if (winResult.amount > biggestWin) {
                biggestWin = winResult.amount;
            }
            
            // Categorize win
            const multiplier = winResult.amount / bet;
            if (multiplier < 10) smallWins++;
            else if (multiplier < 50) mediumWins++;
            else if (multiplier < 100) bigWins++;
            else megaWins++;
        }

        if ((i + 1) % 100000 === 0) {
            console.log(`Progress: ${((i + 1) / spins * 100).toFixed(1)}%`);
        }
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    const rtp = (totalWin / totalBet) * 100;
    const hitRate = (winCount / spins) * 100;
    const averageWin = winCount > 0 ? totalWin / winCount : 0;
    
    // Calculate volatility
    let volatility: string;
    if (hitRate > 20) volatility = "Low";
    else if (hitRate > 10) volatility = "Medium";
    else volatility = "High";

    // Results
    console.log('\n=== Monte Carlo Simulation Results ===');
    console.log(`Spins: ${spins.toLocaleString()}`);
    console.log(`Duration: ${duration.toFixed(2)}s`);
    console.log(`Total Bet: ${totalBet.toLocaleString()}`);
    console.log(`Total Win: ${totalWin.toLocaleString()}`);
    console.log(`RTP: ${rtp.toFixed(2)}%`);
    console.log(`Hit Rate: ${hitRate.toFixed(2)}%`);
    console.log(`Volatility: ${volatility}`);
    console.log(`Average Win: ${averageWin.toFixed(2)}`);
    console.log(`Biggest Win: ${biggestWin} (${(biggestWin / bet).toFixed(1)}x bet)`);
    
    console.log('\n=== Win Distribution ===');
    console.log(`Small (1-10x): ${smallWins.toLocaleString()} (${(smallWins/winCount*100).toFixed(1)}%)`);
    console.log(`Medium (10-50x): ${mediumWins.toLocaleString()} (${(mediumWins/winCount*100).toFixed(1)}%)`);
    console.log(`Big (50-100x): ${bigWins.toLocaleString()} (${(bigWins/winCount*100).toFixed(1)}%)`);
    console.log(`Mega (100x+): ${megaWins.toLocaleString()} (${(megaWins/winCount*100).toFixed(1)}%)`);
    
    console.log('\n=== Symbol Frequency ===');
    const totalSymbols = spins * 5 * 3;
    SYMBOLS.forEach((symbol: Symbol) => {
        const frequency = (symbolFrequency[symbol.id] / totalSymbols) * 100;
        const expected = (symbol.weight / 685) * 100;
        console.log(`${symbol.name}: ${frequency.toFixed(2)}% (expected: ${expected.toFixed(2)}%)`);
    });

    return {
        rtp,
        hitRate,
        biggestWin,
        totalBet,
        totalWin,
        duration,
        symbolFrequency,
        volatility,
        averageWin,
        winDistribution: {
            small: (smallWins/winCount*100),
            medium: (mediumWins/winCount*100),
            big: (bigWins/winCount*100),
            mega: (megaWins/winCount*100)
        }
    };
};

// Na konec Test.ts:
if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log('🎰 Auto-running Monte Carlo test...');
    runMonteCarloSimulation(1000000, 200);
}