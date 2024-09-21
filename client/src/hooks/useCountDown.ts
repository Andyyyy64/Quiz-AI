import { useState, useEffect } from "react";

export const useCountDown = () => {
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  const startCountDown = (newTimeLimit: number) => {
    setCountdown(newTimeLimit);
    setIsCounting(true);
  };

  const resetCountDown = (newTimeLimit: number) => {
    setIsCounting(false);
    setCountdown(newTimeLimit);
  };

  useEffect(() => {
    let interval: any = null;
    if (isCounting) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCounting]);

  return { countdown, isCounting, startCountDown, resetCountDown };
};
