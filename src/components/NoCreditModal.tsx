import { useState, useEffect, useRef } from "react";
import "./MenuModal.css"

interface NoCreditModalProps {
    isOpen: boolean;
    isSoundOn: boolean;
    onClose: () => void;
    onRefill: () => void;
    playSound: (sound: string) => void;
}

const NoCreditModal = ({ isOpen, onClose, onRefill, isSoundOn, playSound }: NoCreditModalProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const refillButtonRef = useRef<HTMLButtonElement>(null);
    // Focus first button when modal opens
    useEffect(() => {
        if (isOpen && refillButtonRef.current) {
            refillButtonRef.current.focus();
        }
    }, [isOpen]);
    if (!isOpen) return null;

    const handleClose = () => {
        if (isSoundOn) {
            playSound('/sounds/button.mp3');
        }
        setIsClosing(true);
        console.log("is closing")
        
        setTimeout(() => {
            if (isSoundOn) {
                playSound('/sounds/whoosh.mp3');
            }
        }, 100);
        
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 400);
    };

    const handleRefill = () => {
        if (isSoundOn) {
            playSound('/sounds/button.mp3');
        }
        setTimeout(() => {
            if (isSoundOn) {
                playSound('/sounds/cash.mp3');
            }
        }, 100);
        
        onRefill();
    };

    return (
        <div 
            className={`modal-overlay modal-overlay--confirm ${isClosing ? 'closing' : ''}`}
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="outOfCreditsTitle"
        >
            <div className={`modal modal--confirm ${isClosing ? 'closing' : ''}`}>
            <h2 id="outOfCreditsTitle">Out of Credits</h2>

            <p className="modal-text">
                You’re out of credits. Refill to continue spinning.
            </p>

            <p className="modal-note">
                Demo only — this resets your credit balance.
            </p>

            <div className="modal-buttons">
                <button 
                    className="btn btn-primary"
                    aria-label="Refill credits to 1000" 
                    onClick={handleRefill}
                >
                    Refill Credits
                </button>
                <button 
                    className="btn btn-ghost" 
                    aria-label="Close dialog"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
            </div>
        </div>
    );
};

export default NoCreditModal;