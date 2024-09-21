import { useState, useEffect } from "react";

export const useCountDownSinglePlay = (startValue: number) => {
    const [countdown, setCountdown] = useState<number>(startValue);
    const [isCounting, setIsCounting] = useState<boolean>(false);

    // カウントダウン処理
    useEffect(() => {
        if (isCounting && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isCounting, countdown]);

    const startCountDown = () => {
        setCountdown(startValue);
        setIsCounting(true);
    };

    const resetCountDown = () => {
        setIsCounting(false);
        setCountdown(startValue);
    };

    return { countdown, isCounting, startCountDown, resetCountDown };
};
