
import "./BottomPannel.css"
import {useState, useEffect } from "react";
import { FaVolumeUp, FaVolumeMute, FaCaretUp, FaCaretDown, FaPlus, FaMinus } from "react-icons/fa";
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

const BottomPannel = ({
    isSoundOn, 
    playSound, 
    setIsSoundOn, 
    bet, 
    increaseBet, 
    decreaseBet, 
    credit, 
    win, 
    onSpin, 
    isSpinning, 
    isAutoSpinning, 
    toggleAutoSpin, 
    openMenu
}:BottomPannelProps) => {
    const [showPlusMinus, setShowPlusMinus] = useState(false);

    useEffect(() => {
        const checkLayout = () => {
            const isMobile = window.innerWidth <= 668;
            const isLandscape = window.matchMedia('(orientation: landscape) and (max-height: 431px)').matches;
            setShowPlusMinus(isMobile || isLandscape);
        };
        
        checkLayout();
        window.addEventListener('resize', checkLayout);
        window.addEventListener('orientationchange', checkLayout);
        
        return () => {
            window.removeEventListener('resize', checkLayout);
            window.removeEventListener('orientationchange', checkLayout);
        };
    }, []);

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
                    role="button"
                    disabled={isSpinning}
                    onClick={openMenu}
                    aria-label="Open menu"
                >
                    <FaBars />
                </button>
                <button 
                    className="sound" 
                    role="button"
                    disabled={isSpinning} 
                       onClick={() => {
                            setIsSoundOn();
                        }}
                    aria-label={isSoundOn ? "Mute sound" : "Unmute sound"}
                    aria-pressed={isSoundOn}
                >{isSoundOn ? 
                    <FaVolumeUp /> : <FaVolumeMute />}
                </button>
                <div 
                    className="credit"
                    role="status" 
                    aria-live="polite"
                >
                    <span className="panel-content">Credit:<br />{credit}</span>
                </div>
                <div 
                    className="bet"
                    role="group" 
                    aria-labelledby="bet-label"
                >
                    <span 
                        className="amount"
                        id="bet-label"
                        aria-live="polite"
                    >
                        Bet:<br />{bet}
                    </span>
                    <div className="amount-toggle">
                        <button 
                            className="increase" 
                            role="button"
                            disabled={isSpinning} 
                            onClick={increaseBet}
                            aria-label="Increase bet"
                        >
                             {showPlusMinus ? <FaPlus aria-hidden="true" /> : <FaCaretUp aria-hidden="true" />}
                        </button>
                        <button 
                            className="decrease" 
                            role="button"
                            disabled={isSpinning} 
                            onClick={decreaseBet}
                            aria-label="Decrease bet"
                        >
                            {showPlusMinus ? <FaMinus aria-hidden="true" /> : <FaCaretDown aria-hidden="true" />}
                        </button>
                    </div>
                </div>
                <div 
                    className="win"
                    role="status" 
                    aria-live="assertive"
                >
                    <span className="panel-content">Win:<br />{win}</span>
                </div>
                <div 
                    className="spin-buttons"
                    role="group"
                    aria-label="Spin controls"
                >
                    <button 
                        className="auto-spin" 
                        role="button"
                        disabled={isSpinning && !isAutoSpinning} 
                        aria-label={isAutoSpinning ? "Stop auto spin" : "Start auto spin"} 
                        aria-pressed={isAutoSpinning}
                        onClick={() => {
                            if (isSoundOn) {
                                playSound('/sounds/button.mp3');
                            }
                            toggleAutoSpin()
                        }}
                    ><FaArrowsRotate /></button>
                    
                    <button 
                        className="spin" disabled={isSpinning || isAutoSpinning} 
                        role="button"
                        aria-label="Spin"
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