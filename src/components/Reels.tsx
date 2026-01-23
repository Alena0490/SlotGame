import { getSymbolById } from '../data/data';
import "./Reels.css"

interface ReelsProps {
  reels: string[][];
  isSpinning: boolean;
  stopStep?: 0 | 1 | 2 | 3 | 4 | 5;
  spinCount: number;
  winningPositions: {col: number, row: number, lineIndex: number}[]
}

const Reels = ({ reels, isSpinning, stopStep, spinCount,winningPositions }: ReelsProps) => {

  return (
    <div 
        className={`reels ${isSpinning ? 'spinning' : ''} ${stopStep ? `stopping-${stopStep}` : ''}`}
        role="region"
        aria-label="Slot machine reels"
        aria-live="polite"
        aria-busy={isSpinning}
    >
      {reels.map((reel, reelIndex) => (
        <div 
            key={reelIndex} 
            className="reel"
            aria-label={`Reel ${reelIndex + 1}`}
        >
          <div className="reel-track">
            {[...reel, ...reel, ...reel].map((symbolId, i) => {
                const symbol = getSymbolById(symbolId);
                const isVisible = i >= 3 && i < 6;
                const isWinning = winningPositions.some(pos => 
                    pos.col === reelIndex && pos.row === (i - 3)
                );
              return (
                <div 
                    key={`${reelIndex}-${i}-${spinCount}`} 
                    className={`symbol ${isWinning && !isSpinning ? 'winning' : ''}`} 
                    aria-hidden={!isVisible}
                >
                  {symbol && <img 
                    src={symbol.image} 
                    alt={isVisible ? symbol.name : ""} 
                    className={`${symbol.className} ${!isSpinning && isVisible && symbol.id === 'harlequin' ? 'wild-animate' : ''}`} />}
                </div>
              );
            })}
          </div> 
        </div>
      ))}
    </div>
  );
};

export default Reels;
