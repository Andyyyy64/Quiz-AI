import { useRef, useEffect } from "react";

type SoundType = "correct" | "incorrect" | "intaract";

export const useSound = (soundType: SoundType) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(`/sounds/${soundType}.mp3`);
  }, [soundType]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  return { play };
};
