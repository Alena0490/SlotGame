
import "./BottomPannel.css"
import { FaVolumeUp, FaVolumeMute, FaCaretUp, FaCaretDown } from "react-icons/fa";
import {FaArrowsRotate, FaArrowRotateRight, FaBars } from "react-icons/fa6";


type BottomPannelProps = {
    isSoundOn: boolean;
    isSpinning: boolean;
    isAutoSpinning: boolean;
    toggleAutoSpin: () => void;
    setIsSoundOn: () => void;
    bet: number;
    credit: number;
    win?: number;
    increaseBet: () => void;
    decreaseBet: () => void;
    onSpin: () => void;
    openMenu: () => void;
    playSound: (sound: string) => void;
}

const BottomPannel = ({isSoundOn, playSound, setIsSoundOn, bet, increaseBet, decreaseBet, credit, win, onSpin, isSpinning, isAutoSpinning, toggleAutoSpin, openMenu}:BottomPannelProps) => {

    const handleSpinClick = () => {
        const spinButton = document.querySelector('.spin') as HTMLButtonElement;
        if (spinButton) {
            spinButton.classList.add('rotating');
            
            setTimeout(() => {
                spinButton.classList.remove('rotating');
            }, 600);
        }
        
        onSpin();
    };

    return (
            <div className="bottom-panel">
                <button 
                    className="menu" 
                    disabled={isSpinning}
                    onClick={openMenu}
                >
                    <FaBars />
                </button>
                <button 
                    className="sound" 
                    disabled={isSpinning} 
                       onClick={() => {
                            setIsSoundOn();
                        }}
                >{isSoundOn ? 
                    <FaVolumeUp /> : <FaVolumeMute />}
                </button>
                <div className="credit">Credit:<br />{credit}</div>
                <div className="bet">
                    <span className="amount">Bet:<br />{bet}</span>
                    <div className="amount-toggle">
                        <button 
                            className="increase" 
                            disabled={isSpinning} 
                            onClick={increaseBet}
                        >
                            <FaCaretUp />
                        </button>
                        <button 
                            className="decrease" 
                            disabled={isSpinning} 
                            onClick={decreaseBet}
                        >
                            <FaCaretDown />
                        </button>
                    </div>
                </div>
                <div className="win">Win:<br />{win}</div>
                <div className="spin-buttons">
                    <button 
                        className="auto-spin" 
                        disabled={isSpinning && !isAutoSpinning}  
                        onClick={() => {
                            if (isSoundOn) {
                                playSound('/sounds/button.mp3');
                            }
                            toggleAutoSpin()
                        }}
                    ><FaArrowsRotate /></button>
                    
                    <button 
                        className="spin" disabled={isSpinning || isAutoSpinning} 
                            onClick={() => {
                                if (isSoundOn) {
                                    playSound('/sounds/button.mp3');
                                }
                                handleSpinClick();
                            }}><FaArrowRotateRight /></button>
                </div>
            </div>
        )
}

export default BottomPannel;