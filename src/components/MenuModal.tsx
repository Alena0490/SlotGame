import { SYMBOLS, PAYLINES, BET_OPTIONS, INITIAL_CREDIT } from '../data/data';
import type { Symbol } from '../data/data';
import "./MenuModal.css"
import { FaXmark } from "react-icons/fa6";

interface MenuModalProps {
  isOpen: boolean;
  isClosing: boolean;  
  onClose: () => void;
}

const MenuModal = ({ isOpen, isClosing, onClose }: MenuModalProps) => {
   if (!isOpen && !isClosing) return null;

const cardSymbols: Symbol[] = SYMBOLS.filter(s => 
  ['spades', 'clubs', 'diamonds', 'hearts'].includes(s.id)
);

const diamondCardSymbols = SYMBOLS.filter(s => 
    ['diamond-spades', 'diamond-clubs', 'diamond-diamonds', 'diamond-hearts'].includes(s.id)
);

    const hyena = SYMBOLS.find(s => s.id === 'hyena');
    const wild = SYMBOLS.find(s => s.id === 'harlequin');
    const scatter = SYMBOLS.find(s => s.id === 'diamond');

    const minBet = BET_OPTIONS[0];
    const maxBet = BET_OPTIONS[BET_OPTIONS.length - 1];

    const paylineCount = PAYLINES.length;

    return (
        <div 
            className={`modal-overlay ${isOpen && !isClosing ? 'open' : ''}`}
            onClick={onClose}
        >
            <div 
                className={`modal-content ${isClosing ? 'closing' : ''}`}  
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose}>
                    <FaXmark />
                </button>
                
                <section className="menu-modal">
                      {/* ===== Panel 1: Credits ===== */}
                    <article className="panel credits">
                        <h2>About</h2>
                        <p>Harlequin's Fortune - Portfolio demo slot game</p>
                        <p>Design & Development: Alena Pumprová</p>
                        <p className="meta">
                            Year: 2025 • ⚠️ Demo only - No real money involved
                        </p>
                         </article>
                    {/* ===== Panel 2: Win symbols ===== */}
                    <article className="panel win-panel">
                        <h2>Win symbols</h2>

                        <div className="win-table">
                        <h3>Cards (Low value)</h3>
                        <div className="symbol-group">
                            <div className="symbols-icons">
                            {cardSymbols.map((s) => (
                                <img key={s.id} src={s.image} alt={s.name} />
                            ))}
                            </div>
                            <span className="payouts">
                            2× {cardSymbols[0].payouts.two} | 3× {cardSymbols[0].payouts.three} | 4×{" "}
                            {cardSymbols[0].payouts.four} | 5× {cardSymbols[0].payouts.five}
                            </span>
                        </div>

                        <h3>Diamond Cards (Medium value)</h3>
                        <div className="symbol-group">
                            <div className="symbols-icons">
                            {diamondCardSymbols.map((s) => (
                                <img key={s.id} src={s.image} alt={s.name} />
                            ))}
                            </div>
                            <span className="payouts">
                            2× {diamondCardSymbols[0]?.payouts.two} | 3× {diamondCardSymbols[0]?.payouts.three} | 4×{" "}
                            {diamondCardSymbols[0]?.payouts.four} | 5× {diamondCardSymbols[0]?.payouts.five}
                            </span>
                        </div>

                            <h3>Special Symbols</h3>

                            <div className="symbol-row">
                                <img src={hyena?.image} alt="Hyena" />
                                <span>
                                    High value: 2× {hyena?.payouts.two} | 3× {hyena?.payouts.three} | 
                                    4× {hyena?.payouts.four} | 5× {hyena?.payouts.five}
                                </span>
                                </div>

                                <div className="symbol-row">
                                <img src={wild?.image} alt="Wild" />
                                <span>
                                    Wild (substitutes all): 2× {wild?.payouts.two} | 3× {wild?.payouts.three} | 
                                    4× {wild?.payouts.four} | 5× {wild?.payouts.five}
                                </span>
                                </div>

                                <div className="symbol-row">
                                <img src={scatter?.image} alt="Scatter" />
                                <span>
                                    Scatter (pays anywhere): 3× {scatter?.payouts.three} | 
                                    4× {scatter?.payouts.four} | 5× {scatter?.payouts.five}
                                </span>
                                </div>
                        </div>
                    </article>

                    {/* ===== Panel 3: Rules ===== */}
                    <article className="panel rules-panel">
                        <h2>Game Rules</h2>

                        <ul>
                            <li>Match 2+ symbols from left to right to win</li>
                            <li>Wild symbol substitutes all symbols except Scatter</li>
                            <li>Scatter pays anywhere on the reels (3+ symbols)</li>
                            <li>{paylineCount} paylines: Top, Middle, Bottom</li>
                            <li>Bet range: {minBet} - {maxBet} credits</li>
                            <li>Starting credit: {INITIAL_CREDIT}</li>
                            <li>All wins are multiplied by bet amount</li>
                        </ul>
                    </article>
                    </section>
            </div>
        </div>
    )
}

export default MenuModal