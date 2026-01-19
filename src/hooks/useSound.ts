import { useCallback } from 'react';

interface UseSoundProps {
  isSoundOn: boolean;
}

export const useSound = ({ isSoundOn }: UseSoundProps) => {
  const playSound = useCallback((soundFile: string) => {
    if (!isSoundOn) return;
    
    const audio = new Audio(soundFile);
    audio.play().catch(err => console.log('Sound play failed:', err));
  }, [isSoundOn]);

  return { playSound };
};