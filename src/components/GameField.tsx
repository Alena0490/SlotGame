import "./GameField.css"
import { useState, useRef} from "react";
import BottomPannel from "./BottomPannel";
import Reels from "./Reels";
import MenuModal from "./MenuModal";
import { BET_OPTIONS, getWeightedRandomSymbol, PAYLINES, getSymbolById } from "../data/data";

// Import symbol data
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

interface WinResult {
  amount: number;
  winningPositions: Array<{col: number, row: number, lineIndex: number}>;
}

interface LineWinResult {
  win: number;
  positions: number[];  // indexes of win columns
  lineIndex: number;
}

const GameField = () => {
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [credit, setCredit] = useState(1000);
    const [bet, setBet] = useState(20);
    const [win, setWin] = useState(0);
    const [winningPositions, setWinningPositions] = useState<Array<{col: number, row: number, lineIndex: number}>>([]);
    const [spinCount, setSpinCount] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [stopStep, setStopStep] = useState<0|1|2|3|4|5>(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuClosing, setIsMenuClosing] = useState(false);
    const [isAutoSpinning, setIsAutoSpinning] = useState(false);
    const autoSpinIntervalRef = useRef<number | null>(null); 

    const [reels, setReels] = useState<string[][]>([
        ['spades', 'hearts', 'clubs'],     // reel 1
        ['diamond-spades', 'hyena', 'hearts'],  // reel 2
        ['diamonds', 'harlequin', 'spades'],    // reel 3
        ['clubs', 'diamond', 'hearts'],         // reel 4
        ['hyena', 'diamonds', 'spades']         // reel 5
    ]);

    /*** === MENU BUTTON === */
    const closeMenu = () => {
        setIsMenuClosing(true);
        
        // Force browser reflow
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
            setTimeout(() => {
                setIsMenuOpen(false);
                setIsMenuClosing(false);
            }, 300);
            });
        });
    };
   
    /*** === BET AMOUNT BUTTONS === */
    const increaseBet = () => {
        const currentIndex = BET_OPTIONS.indexOf(bet);
        if (currentIndex < BET_OPTIONS.length - 1) {
            setBet(BET_OPTIONS[currentIndex + 1]);
        }
    };

    const decreaseBet = () => {
        const currentIndex = BET_OPTIONS.indexOf(bet);
        if (currentIndex > 0) {
            setBet(BET_OPTIONS[currentIndex - 1]);
        }
    };

    /*** === SPIN BUTTONS === */
    /*** Single spin */
    const handleSpin = () => {
        const newCredit = credit - bet;
  
        if (newCredit < 0) {
            alert("Nedostatek kreditu!");
            if (isAutoSpinning) toggleAutoSpin();
            return;
        }

        setCredit(newCredit);
        setIsSpinning(true);
        setSpinCount(spinCount + 1);

        // Generate final reels immediately
        const finalReels = generateRandomSymbols();
        console.log('finalReels:', finalReels); 
        setReels(finalReels); 

        // Affter 2s, start spinning
        setTimeout(() => setStopStep(1), 1500);   // 1. reel
        setTimeout(() => setStopStep(2), 1800);   // 2. reel
        setTimeout(() => setStopStep(3), 2100);   // 3. reel
        setTimeout(() => setStopStep(4), 2400);   // 4. reel
        setTimeout(() => {
            setStopStep(5);
        }, 2700);
        
        setTimeout(() => {
            setIsSpinning(false);
            setStopStep(0);
            const winAmount = checkWin(finalReels, bet);
            console.log('checkWin result:', winAmount);  
            setWin(winAmount.amount);
            setWinningPositions(winAmount.winningPositions);  
            setCredit(prev => prev + winAmount.amount);

            if (isAutoSpinningRef.current) {
                autoSpinIntervalRef.current = window.setTimeout(handleSpin, 500);
            }
        }, 2650); 
    };

    /*** Autospin */
    const isAutoSpinningRef = useRef(false);
    const toggleAutoSpin = () => {
        if (isAutoSpinning) {
            setIsAutoSpinning(false);
            isAutoSpinningRef.current = false;  // ref actuaization

            // clearTimeout:
            if (autoSpinIntervalRef.current) {
            clearTimeout(autoSpinIntervalRef.current);
            autoSpinIntervalRef.current = null;
            }
        } else {
            setIsAutoSpinning(true);
            isAutoSpinningRef.current = true;  // ref actuaization
            startAutoSpin();
        }
    };

    const startAutoSpin = () => {
        handleSpin();
    };

    //*** === CHECK WIN === */
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

        // Scatter win
        const scatterWin = checkScatterWin(reels, bet);
        totalWin += scatterWin.win;

        scatterWin.positions.forEach(pos => {
            winningPositions.push({col: pos.col, row: pos.row, lineIndex: -1});  // -1 znamená scatter
        });
        
        return { amount: totalWin, winningPositions };  
    }

    const checkLineForWin = (line: string[], bet: number, lineIndex: number): LineWinResult => {

        const firstSymbol = line[0];
        let count = 1; 
            
        for (let i = 1; i < line.length; i++) {

            if (line[i] === firstSymbol || line[i] === 'harlequin') {
                count++; 
            } else {
                break;  // new symbol - end
            }
        }
        
        if (count >= 2) {  // needs 2 same symbols in a row
            const symbol = getSymbolById(firstSymbol);
            console.log('symbol:', symbol); 
            if (!symbol) return { win: 0, positions: [], lineIndex }; 
            
            // Payout
            let payout = 0;
            if (count === 2) payout = symbol.payouts.two;
            if (count === 3) payout = symbol.payouts.three;
            else if (count === 4) payout = symbol.payouts.four;
            else if (count === 5) payout = symbol.payouts.five;
            
            const positions = Array.from({length: count}, (_, i) => i); // win
            return { win: bet * payout, positions, lineIndex }; 
        }
    
     return { win: 0, positions: [], lineIndex };  // if there is less than 2 same symbols in a row - no win
    }

    /** Scatter win */
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

    return (
        <main className="game-field">
            <div className="main-game">
                <MenuModal   
                    isOpen={isMenuOpen} 
                    isClosing={isMenuClosing}
                    onClose={closeMenu} 
                />
                <span className="harlequin"></span>
                <Reels 
                    reels={reels} 
                    isSpinning={isSpinning} 
                    stopStep={stopStep}
                    spinCount={spinCount} 
                    winningPositions={winningPositions}
                />
            </div>
            <BottomPannel 
                isSoundOn={isSoundOn} 
                isSpinning={isSpinning}
                isAutoSpinning={isAutoSpinning}
                setIsSoundOn={setIsSoundOn} 
                onSpin={handleSpin}
                bet={bet} 
                credit={credit}
                win={win}
                increaseBet={increaseBet} 
                decreaseBet={decreaseBet} 
                toggleAutoSpin={toggleAutoSpin}
                openMenu={() => setIsMenuOpen(true)}
            />
        </main>
    )
}

export default GameField;