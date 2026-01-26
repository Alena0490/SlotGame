import { useState, useEffect } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
    onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const duration = 1200; // 1.2s
        const steps = 20;
        const increment = 100 / steps;
        const intervalTime = duration / steps;
        
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onLoadComplete(), 300);
                    return 100;
                }
                
                return next;
            });
        }, intervalTime);
        
        return () => clearInterval(interval);
    }, [onLoadComplete]);
    
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