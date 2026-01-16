
import "./BottomPannel.css"
import { useState } from "react";
import { BET_OPTIONS } from "../data/data";
import { FaVolumeUp, FaVolumeMute, FaCaretUp, FaCaretDown } from "react-icons/fa";
import {FaArrowsRotate, FaArrowRotateRight, FaBars } from "react-icons/fa6";


type BottomPannelProps = {
    isSoundOn: boolean;
    setIsSoundOn: (value: boolean) => void;
}

const BottomPannel = ({isSoundOn, setIsSoundOn}:BottomPannelProps) => {
    const [bet, setBet] = useState(BET_OPTIONS[0]);

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

    return (
            <div className="bottom-panel">
                <button className="menu"><FaBars /></button>
                <button className="sound" onClick={() => setIsSoundOn(!isSoundOn)}>{isSoundOn ? <FaVolumeMute /> : <FaVolumeUp />}</button>
                <div className="credit">Credit:<br />1000</div>
                <div className="bet">
                    <span className="amount">Bet:<br />{bet}</span>
                    <div className="amount-toggle">
                        <button className="increase" onClick={increaseBet}><FaCaretUp /></button>
                        <button className="decrease" onClick={decreaseBet}><FaCaretDown /></button>
                    </div>
                </div>
                <div className="win">Win:<br />0</div>
                <div className="spin-buttons">
                    <div className="auto-spin-overlay"></div>
                    <button className="auto-spin"><FaArrowsRotate /></button>
                    
                    <div className="spin-overlay"></div>
                    <button className="spin"><FaArrowRotateRight /></button>
                </div>
            </div>
        )
}

export default BottomPannel;