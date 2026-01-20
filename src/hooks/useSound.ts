import { useRef, useCallback } from "react";

interface UseSoundProps {
  isSoundOn: boolean;
}

export const useSound = ({ isSoundOn }: UseSoundProps) => {
    const audioRef = useRef<HTMLAudioElement[]>([]);
    
    const playSound = useCallback((soundFile: string) => {
        if (!isSoundOn) return;
        
        const audio = new Audio(soundFile);
        audioRef.current.push(audio);
        audio.play().catch(err => console.log('Sound play failed:', err));
    }, [isSoundOn]);

    const stopAllSounds = useCallback(() => {
        audioRef.current.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        audioRef.current = [];
    }, []);

    return { playSound, stopAllSounds };
};