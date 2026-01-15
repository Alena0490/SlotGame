import "./GameField.css"
import { useState } from "react";
import BottomPannel from "./BottomPannel";

const GameField = () => {
    const [isSoundOn, setIsSoundOn] = useState(true);

    return (
        <main className="game-field">
            <div className="main-game">
                <span className="harlequin"></span>
                <div className="reels">
                    <div className="reel reel-1">
                        <div className="symbol symbol-1"></div>
                        <div className="symbol symbol-2"></div>
                        <div className="symbol symbol-3"></div>
                    </div>
                    <div className="reel reel-2">
                        <div className="symbol symbol-1"></div>
                        <div className="symbol symbol-2"></div>
                        <div className="symbol symbol-3"></div>
                    </div>
                    <div className="reel reel-3">
                        <div className="symbol symbol-1"></div>
                        <div className="symbol symbol-2"></div>
                        <div className="symbol symbol-3"></div>
                    </div>
                    <div className="reel reel-4">
                        <div className="symbol symbol-1"></div>
                        <div className="symbol symbol-2"></div>
                        <div className="symbol symbol-3"></div>
                    </div>
                    <div className="reel reel-5">
                        <div className="symbol symbol-1"></div>
                        <div className="symbol symbol-2"></div>
                        <div className="symbol symbol-3"></div>
                    </div>
                </div>
            </div>
            <BottomPannel isSoundOn={isSoundOn} setIsSoundOn={setIsSoundOn} />
        </main>
    )
}

export default GameField;