import "./GameField.css"
import { useState } from "react";
import BottomPannel from "./BottomPannel";
import { REELS_COUNT, ROWS_COUNT, getSymbolById } from '../data/data';

const GameField = () => {
    const [isSoundOn, setIsSoundOn] = useState(true);

    const [reels, setReels] = useState<string[][]>([
        ['spades', 'hearts', 'clubs'],     // reel 1
        ['diamond-spades', 'hyena', 'hearts'],  // reel 2
        ['diamonds', 'harlequin', 'spades'],    // reel 3
        ['clubs', 'diamond', 'hearts'],         // reel 4
        ['hyena', 'diamonds', 'spades']         // reel 5
    ]);

    return (
        <main className="game-field">
            <div className="main-game">
                <span className="harlequin"></span>
                <div className="reels">
                    {reels.map((reel, reelIndex) => (
                        <div key={reelIndex} className={`reel reel-${reelIndex + 1}`}>
                        {reel.map((symbolId, symbolIndex) => {
                            const symbol = getSymbolById(symbolId);
                            return (
                            <div key={symbolIndex} className={`symbol symbol-${symbolIndex + 1}`}>
                                {symbol && <img src={symbol.image} alt={symbol.name} className={symbol.className} />}
                            </div>
                            );
                        })}
                        </div>
                    ))}
                    </div>
            </div>
            <BottomPannel isSoundOn={isSoundOn} setIsSoundOn={setIsSoundOn} />
        </main>
    )
}

export default GameField;