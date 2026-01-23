import "./GameField.css"
import { useState,useEffect, useRef} from "react";
import BottomPannel from "./BottomPannel";
import Reels from "./Reels";
import MenuModal from "./MenuModal";
import NoCreditModal from "./NoCreditModal";
import { BET_OPTIONS, getWeightedRandomSymbol, PAYLINES, getSymbolById } from "../data/data";
import { useSound } from "../hooks/useSound";
import { useLocalStorage } from "../hooks/useLocalStorage";

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
    const [isSoundOn, setIsSoundOn] = useLocalStorage('isSoundOn', true);
    const [credit, setCredit] = useLocalStorage('credit', 1000);
    const [bet, setBet] = useLocalStorage('bet', 20);
    const [win, setWin] = useState(0);
    const [winningPositions, setWinningPositions] = useState<Array<{col: number, row: number, lineIndex: number}>>([]);
    const [spinCount, setSpinCount] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [stopStep, setStopStep] = useState<0|1|2|3|4|5>(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuClosing, setIsMenuClosing] = useState(false);
    const [isAutoSpinning, setIsAutoSpinning] = useState(false);
    const autoSpinIntervalRef = useRef<number | null>(null);
    
    // Credit ref for tracking current credit in closures
    const creditRef = useRef(credit);
    
    // Update credit ref when credit changes
    useEffect(() => {
        creditRef.current = credit;
    }, [credit]);

    const [reels, setReels] = useState<string[][]>([
        ['spades', 'hearts', 'clubs'],     // reel 1
        ['diamond-spades', 'hyena', 'hearts'],  // reel 2
        ['diamonds', 'harlequin', 'spades'],    // reel 3
        ['clubs', 'diamond', 'hearts'],         // reel 4
        ['hyena', 'diamonds', 'spades']         // reel 5
    ]);
    const [isOutOfCredits, setIsOutOfCredits] = useState(false);
    const backgroundAudioRef = useRef<HTMLAudioElement>(null);
    
    const handleRefillCredits = () => {
        setCredit(1000);
        creditRef.current = 1000;
        setIsOutOfCredits(false);
    };

    /*** === SOUND PRELOAD === */
    useEffect(() => {
        const sounds = [
            '/sounds/button.mp3',
            '/sounds/whoosh.mp3',
        ];
        
        sounds.forEach(sound => {
            const audio = new Audio(sound);
            audio.load();
        });
    }, []);
    
    /*** === SOUNDS === */
    const { playSound, stopAllSounds } = useSound({ isSoundOn });
    useEffect(() => {
        if (!isSoundOn) {
            const audios = document.querySelectorAll('audio');
            audios.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
    }, [isSoundOn]);

    useEffect(() => {
        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.volume = 0.3;  // 30% volume
            if (isSoundOn) {
                backgroundAudioRef.current.play();
            } else {
                backgroundAudioRef.current.pause();
            }
        }
    }, [isSoundOn]);

    
    /*** === SOUND BUTTON === */
    const handleSoundToggle = () => {
        const newSoundState = !isSoundOn;
        console.log('isSoundOn:', isSoundOn, 'newSoundState:', newSoundState);
        
        if (newSoundState) {
            const audio = new Audio('/sounds/button.mp3');
            audio.play();
            console.log('Zvuk se HRAJE');
        } else {
            console.log('Zvuk se NEHRAJE');
        }
        
        setIsSoundOn(newSoundState);
    };

    useEffect(() => {
        if (!isSoundOn) {
            stopAllSounds();
        }
    }, [isSoundOn, stopAllSounds]);

    /*** === MENU BUTTON === */
    const openMenu = () => {
        if (isSoundOn) {
            playSound('/sounds/button.mp3');
        }
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        if (isSoundOn) {
            playSound('/sounds/button.mp3');
        }
        setIsMenuClosing(true);
        setTimeout (() => {
            if (isSoundOn) {
                playSound('/sounds/whoosh.mp3');
            }
        }, 100)
 
        
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
        if (isSoundOn) {
            playSound('/sounds/button.mp3');
        }
        const currentIndex = BET_OPTIONS.indexOf(bet);
        if (currentIndex < BET_OPTIONS.length - 1) {
            setBet(BET_OPTIONS[currentIndex + 1]);
        }
    };

    const decreaseBet = () => {
        if (isSoundOn) {
            playSound('/sounds/button.mp3');
        }
        const currentIndex = BET_OPTIONS.indexOf(bet);
        if (currentIndex > 0) {
            setBet(BET_OPTIONS[currentIndex - 1]);
        }
    };

    /*** === SPIN BUTTONS === */
    /*** Single spin */
    const handleSpin = () => {
        // Check credit with ref (has current value!)
        if (creditRef.current < bet) {
            if (isSoundOn) {
                playSound('/sounds/error.mp3');
            }
            setIsOutOfCredits(true);
            
            // Stop autospin
            if (isAutoSpinningRef.current) {
                setIsAutoSpinning(false);
                isAutoSpinningRef.current = false;
                
                if (autoSpinIntervalRef.current) {
                    clearTimeout(autoSpinIntervalRef.current);
                    autoSpinIntervalRef.current = null;
                }
            }
            return;
        }

        // Deduct credit
        setCredit(prev => {
            const newCredit = prev - bet;
            creditRef.current = newCredit;  // Update ref immediately!
            return newCredit;
        });

        if (isSoundOn) {
            playSound('/sounds/spin2.mp3');
        }

        setIsSpinning(true);
        setSpinCount(prev => prev + 1);

        // Generate final reels immediately
        const finalReels = generateRandomSymbols();
        setReels(finalReels); 

        // After 2s, start spinning
        setTimeout(() => setStopStep(1), 1550);   // 1. reel
        setTimeout(() => setStopStep(2), 1900);   // 2. reel
        setTimeout(() => setStopStep(3), 2250);   // 3. reel
        setTimeout(() => setStopStep(4), 2600);   // 4. reel
        setTimeout(() => {
            setStopStep(5);
        }, 2700);
        
        setTimeout(() => {
            setIsSpinning(false);
            setStopStep(0);
            const winAmount = checkWin(finalReels, bet);
            setWin(winAmount.amount);
            setWinningPositions(winAmount.winningPositions);  
            
            setCredit(prev => {
                const newCredit = prev + winAmount.amount;
                creditRef.current = newCredit;  // Update ref!
                return newCredit;
            });

            if (winAmount.amount > 0 && isSoundOn) {
                playSound('/sounds/win.mp3');
            }

            // Check credit BEFORE next autospin with ref!
            if (isAutoSpinningRef.current && creditRef.current >= bet) {
                autoSpinIntervalRef.current = window.setTimeout(handleSpin, 500);
            } else if (isAutoSpinningRef.current && creditRef.current < bet) {
                // Stop autospin
                setIsAutoSpinning(false);
                isAutoSpinningRef.current = false;
                setIsOutOfCredits(true);
                if (isSoundOn) {
                    playSound('/sounds/error.mp3');
                }
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
            winningPositions.push({col: pos.col, row: pos.row, lineIndex: -1});  // -1 = scatter
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
        
        if (count >= 3) {  // needs 3 same symbols in a row
            const symbol = getSymbolById(firstSymbol);
            console.log('symbol:', symbol); 
            if (!symbol) return { win: 0, positions: [], lineIndex }; 
            
            // Payout
            let payout = 0;
            if (count === 3) payout = symbol.payouts.three;
            else if (count === 4) payout = symbol.payouts.four;
            else if (count === 5) payout = symbol.payouts.five;
            
            const positions = Array.from({length: count}, (_, i) => i); // win
            return { win: bet * payout, positions, lineIndex }; 
        }
    
     return { win: 0, positions: [], lineIndex };  // if there is less than 3 same symbols in a row - no win
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
            <div className="visually-hidden" role="status" aria-live="assertive" aria-atomic="true">
                {win > 0 && `You won ${win} credits!`}
            </div>

             <audio 
                ref={backgroundAudioRef}
                src="/sounds/waltz.mp3"
                loop
                aria-hidden="true"
            />
            <div 
                className="rotate-overlay" 
                aria-hidden="true"
                role="alert" 
                aria-live="assertive"
            >
                <div className="rotate-card">
                    <div className="rotate-icon">↻</div>
                    <p>Turn your device</p>
                </div>
            </div>

            <h1 className="visually-hidden">Slot Machine Game</h1>
            <div className="main-game">
                <MenuModal   
                    isOpen={isMenuOpen} 
                    isClosing={isMenuClosing}
                    onClose={closeMenu} 
                />
                 <NoCreditModal
                    isOpen={isOutOfCredits}
                    onClose={() => setIsOutOfCredits(false)}
                    onRefill={handleRefillCredits}
                    isSoundOn={isSoundOn} 
                    playSound={playSound}  
                />
                <span className="harlequin" aria-hidden="true"></span>
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
                setIsSoundOn={handleSoundToggle} 
                playSound={playSound}  
                onSpin={handleSpin}
                bet={bet} 
                credit={credit}
                win={win}
                increaseBet={increaseBet} 
                decreaseBet={decreaseBet} 
                toggleAutoSpin={toggleAutoSpin}
                openMenu={openMenu}
            />
        </main>
    )
}

export default GameField;
