
import "./BottomPannel.css"
import { FaVolumeUp, FaVolumeMute, FaCaretUp, FaCaretDown } from "react-icons/fa";
import {FaArrowsRotate, FaArrowRotateRight, FaBars } from "react-icons/fa6";

type BottomPannelProps = {
    isSoundOn: boolean;
    setIsSoundOn: (value: boolean) => void;
}

const BottomPannel = ({isSoundOn, setIsSoundOn}:BottomPannelProps) => {
    return (
            <div className="bottom-panel">
                <button className="menu"><FaBars /></button>
                <button className="sound" onClick={() => setIsSoundOn(!isSoundOn)}>{isSoundOn ? <FaVolumeMute /> : <FaVolumeUp />}</button>
                <div className="credit">Credit:<br />1000</div>
                <div className="bet">
                    <span className="amount">Bet:<br />20</span>
                    <div className="amount-toggle">
                        <button className="increase"><FaCaretUp /></button>
                        <button className="decrease"><FaCaretDown /></button>
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