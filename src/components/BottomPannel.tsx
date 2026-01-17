
import "./BottomPannel.css"
import { FaVolumeUp, FaVolumeMute, FaCaretUp, FaCaretDown } from "react-icons/fa";
import {FaArrowsRotate, FaArrowRotateRight, FaBars } from "react-icons/fa6";


type BottomPannelProps = {
    isSoundOn: boolean;
    isSpinning: boolean;
    isAutoSpinning: boolean;
    toggleAutoSpin: () => void;
    setIsSoundOn: (value: boolean) => void;
    bet: number;
    credit: number;
    win?: number;
    increaseBet: () => void;
    decreaseBet: () => void;
    onSpin: () => void;
}

const BottomPannel = ({isSoundOn, setIsSoundOn, bet, increaseBet, decreaseBet, credit, win, onSpin, isSpinning, isAutoSpinning, toggleAutoSpin}:BottomPannelProps) => {

    return (
            <div className="bottom-panel">
                <button className="menu" disabled={isSpinning}><FaBars /></button>
                <button className="sound" disabled={isSpinning} onClick={() => setIsSoundOn(!isSoundOn)}>{isSoundOn ? <FaVolumeMute /> : <FaVolumeUp />}</button>
                <div className="credit">Credit:<br />{credit}</div>
                <div className="bet">
                    <span className="amount">Bet:<br />{bet}</span>
                    <div className="amount-toggle">
                        <button className="increase" disabled={isSpinning} onClick={increaseBet}><FaCaretUp /></button>
                        <button className="decrease" disabled={isSpinning} onClick={decreaseBet}><FaCaretDown /></button>
                    </div>
                </div>
                <div className="win">Win:<br />{win}</div>
                <div className="spin-buttons">
                    <div className="auto-spin-overlay"></div>
                    <button className="auto-spin" disabled={isSpinning && !isAutoSpinning}  onClick={toggleAutoSpin}><FaArrowsRotate /></button>
                    
                    <div className="spin-overlay"></div>
                    <button className="spin" disabled={isSpinning || isAutoSpinning} onClick={onSpin}><FaArrowRotateRight /></button>
                </div>
            </div>
        )
}

export default BottomPannel;