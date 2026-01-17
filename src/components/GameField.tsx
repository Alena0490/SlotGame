import "./GameField.css"
import { useState} from "react";
import BottomPannel from "./BottomPannel";
import Reels from "./Reels";
import { BET_OPTIONS, SYMBOLS } from "../data/data";

// Import symbol data
const generateRandomSymbols = (): string[][] => {
  const result: string[][] = [];
  
  for (let i = 0; i < 5; i++) {
    const reel: string[] = [];
    for (let j = 0; j < 3; j++) { 
      // Zatím úplně náhodně (později přidáš weights)
      const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
      reel.push(SYMBOLS[randomIndex].id);
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
    const [isSpinning, setIsSpinning] = useState(false);
    const [stopStep, setStopStep] = useState<0|1|2|3|4|5>(0);

    const [reels, setReels] = useState<string[][]>([
        ['spades', 'hearts', 'clubs'],     // reel 1
        ['diamond-spades', 'hyena', 'hearts'],  // reel 2
        ['diamonds', 'harlequin', 'spades'],    // reel 3
        ['clubs', 'diamond', 'hearts'],         // reel 4
        ['hyena', 'diamonds', 'spades']         // reel 5
    ]);
   
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

    /*** === SPIN BUTTON === */
    const handleSpin = () => {
        if (credit < bet) {
            alert("Nedostatek kreditu!");
            return;
        }

        setCredit(credit - bet);
        setIsSpinning(true);

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
            setWin(0);
        }, 2650); 
    };

    return (
        <main className="game-field">
            <div className="main-game">
                <span className="harlequin"></span>
                <Reels 
                    reels={reels} 
                    isSpinning={isSpinning} 
                    stopStep={stopStep}
                />
            </div>
            <BottomPannel 
                isSoundOn={isSoundOn} 
                setIsSoundOn={setIsSoundOn} 
                onSpin={handleSpin}
                bet={bet} 
                credit={credit}
                win={win}
                increaseBet={increaseBet} 
                decreaseBet={decreaseBet} 
            />
        </main>
    )
}

export default GameField;