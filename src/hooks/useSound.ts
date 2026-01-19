interface UseSoundProps {
  isSoundOn: boolean;
}

export const useSound = ({ isSoundOn }: UseSoundProps) => {
    const playSound = (soundFile: string) => {
        console.log('playSound called, isSoundOn:', isSoundOn);  // ← Log tady
        if (!isSoundOn) {
            console.log('Sound is OFF, returning');  // ← Log tady
            return;
        }
        
        const audio = new Audio(soundFile);
        audio.play().catch(err => console.log('Sound play failed:', err));
    };

  const stopSound = () => {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  return { playSound, stopSound };
};