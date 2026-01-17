import { getSymbolById } from '../data/data';
import "./Reels.css"

interface ReelsProps {
  reels: string[][];
  isSpinning: boolean;
  stopStep?: 0 | 1 | 2 | 3 | 4 | 5;
}

const Reels = ({ reels, isSpinning, stopStep }: ReelsProps) => {
  return (
    <div className={`reels ${isSpinning ? 'spinning' : ''} ${stopStep ? `stopping-${stopStep}` : ''}`}>
      {reels.map((reel, reelIndex) => (
        <div key={reelIndex} className="reel">
          <div className="reel-track">
            {[...reel, ...reel, ...reel].map((symbolId, i) => {
              const symbol = getSymbolById(symbolId);
              return (
                <div key={`${reelIndex}-${i}`} className="symbol">
                  {symbol && <img src={symbol.image} alt={symbol.name} className={symbol.className} />}
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
