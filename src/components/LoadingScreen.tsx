import { useState, useEffect } from 'react';
import './LoadingScreen.css';

import Diamonds from '../img/symbols/diamondsCard.webp';
import Clubs from '../img/symbols/clubsCard.webp';
import Hearts from '../img/symbols/heartsCard.webp';
import Spades from '../img/symbols/spadesCard.webp';
import DiamondDiamonds from '../img/symbols/Diamonds.webp';
import DiamondClubs from '../img/symbols/Clubs.webp';
import DiamondHearts from '../img/symbols/Hearts.webp';
import DiamondSpades from '../img/symbols/Spades.webp';
import Hyena from '../img/symbols/Hyena.webp';
import Diamond from '../img/symbols/Diamond.webp';
import Harlequin from '../img/symbols/Harlequin.webp';
import CircusBg from '../img/circus.webp';

interface LoadingScreenProps {
    onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    
    // Original smooth animation
    useEffect(() => {
        const duration = 1200;
        const steps = 20;
        const increment = 100 / steps;
        const intervalTime = duration / steps;
        
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, intervalTime);
        
        return () => clearInterval(interval);
    }, []);
    
    // Preload images
    useEffect(() => {
        const images = [
            CircusBg,
            Spades,
            Clubs,
            Diamonds,
            Hearts,
            DiamondSpades,
            DiamondClubs,
            DiamondDiamonds,
            DiamondHearts,
            Hyena,
            Diamond,
            Harlequin
        ];
        
        let loadedCount = 0;
        const totalImages = images.length;
        
        images.forEach(imageSrc => {
            const img = new Image();
            
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setImagesLoaded(true);
                }
            };
            
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setImagesLoaded(true);
                }
            };
            
            img.src = imageSrc;
        });
    }, []);
    
    // Complete only when BOTH animation AND images are done
    useEffect(() => {
        if (progress === 100 && imagesLoaded) {
            setTimeout(() => onLoadComplete(), 300);
        }
    }, [progress, imagesLoaded, onLoadComplete]);
    
    return (
        <div className="loading-screen">
            <h1 className="loading-title">Harlequin's Fortune</h1>
            <div className="loading-bar">
                <div className="loading-progress" style={{width: `${progress}%`}} />
            </div>
            <p className="loading-text">{Math.round(progress)}%</p>
        </div>
    );
};

export default LoadingScreen;