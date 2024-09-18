import { useRef, useEffect } from "react";
import { Haptics } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

type SoundType = "correct" | "incorrect" | "intaract" | "win" | "lose";

export const useSound = (soundType: SoundType) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(`/sounds/${soundType}.mp3`);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, [soundType]);

  const triggerHapticFeedback = () => {
    if (
      Capacitor.getPlatform() === "ios" ||
      Capacitor.getPlatform() === "android"
    ) {
      Haptics.vibrate();
    }
  };

  const play = () => {
    if (audioRef.current) {
      // if is ios or android, trigger haptic feedback(vibration)
      triggerHapticFeedback();
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  return { play };
};
