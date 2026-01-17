import { getSymbolById } from '../data/data';
import "./Reels.css"

interface ReelsProps {
  reels: string[][];
  isSpinning: boolean;
  stopStep?: 0 | 1 | 2 | 3 | 4 | 5;
  spinCount: number;
}

const Reels = ({ reels, isSpinning, stopStep, spinCount }: ReelsProps) => {
    console.log('spinCount:', spinCount);

  return (
    <div className={`reels ${isSpinning ? 'spinning' : ''} ${stopStep ? `stopping-${stopStep}` : ''}`}>
      {reels.map((reel, reelIndex) => (
        <div key={reelIndex} className="reel">
          <div className="reel-track">
            {[...reel, ...reel, ...reel].map((symbolId, i) => {
              const symbol = getSymbolById(symbolId);
              const isVisible = i >= 3 && i < 6;
              return (
                <div key={`${reelIndex}-${i}-${spinCount}`} className="symbol" >
                  {symbol && <img 
                    src={symbol.image} 
                    alt={symbol.name} 
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
