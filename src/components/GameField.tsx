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

const GameField = () => {
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [credit, setCredit] = useState(1000);
    const [bet, setBet] = useState(20);
    const [win, setWin] = useState(0);
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
            setWin(winAmount);
            setCredit(prev => prev + winAmount);

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
    const checkWin = (reels: string[][], bet: number): number => {
    let totalWin = 0;
    
    PAYLINES.forEach(payline => {
        const line = payline.map((row, colIndex) => reels[colIndex][row]);
        const win = checkLineForWin(line, bet);  
        totalWin += win;
    });

    // Scatter win
    const scatterWin = checkScatterWin(reels, bet);
    totalWin += scatterWin;
    
    return totalWin;
    }

    const checkLineForWin = (line: string[], bet: number): number => {

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
            if (!symbol) return 0;
            
            // Vyber správný payout podle počtu
            let payout = 0;
            if (count === 2) payout = symbol.payouts.two;
            if (count === 3) payout = symbol.payouts.three;
            else if (count === 4) payout = symbol.payouts.four;
            else if (count === 5) payout = symbol.payouts.five;
            
            return bet * payout;  // win
        }
    
    return 0;  // if there is less than 3 same symbols in a row - no win
    }

    /** Scatter win */
    const checkScatterWin = (reels: string[][], bet: number): number => {
        let scatterCount = 0;
        
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 3; row++) {
            if (reels[col][row] === 'diamond') {  // scatter ID
                scatterCount++;
            }
            }
        }
        
        if (scatterCount >= 3) {
            const scatter = getSymbolById('diamond');
            if (!scatter) return 0;
            
            let payout = 0;
            if (scatterCount === 3) payout = scatter.payouts.three;
            else if (scatterCount === 4) payout = scatter.payouts.four;
            else if (scatterCount >= 5) payout = scatter.payouts.five;
            
            return bet * payout;
        }
        
        return 0;
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