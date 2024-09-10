import { useState, useEffect } from "react";

export const useCalcDuration = () => {
    const [duration, setCountUp] = useState<number>(0);
    const [isCounting, setIsCounting] = useState<boolean>(false);

    // カウントアップ処理
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>; // NodeJS.Timeoutの代わりにこちらを使用
        if (isCounting) {
            timer = setTimeout(() => {
                setCountUp((prevCountUp) => prevCountUp + 1);
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [isCounting, duration]);

    const startCountUp = () => {
        setIsCounting(true);
    };

    const stopCountUp = () => {
        setIsCounting(false);
    };

    const resetCountUp = () => {
        setIsCounting(false);
        setCountUp(0);
    };

    return { duration, isCounting, startCountUp, stopCountUp, resetCountUp };
};
