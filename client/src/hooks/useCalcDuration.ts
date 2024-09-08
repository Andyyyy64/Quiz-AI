import { useState, useEffect } from "react";

export const useCalcDuration = () => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [duration, setDuration] = useState<number>(0);

    // マッチを開始する
    const startCalc = () => {
        setStartTime(Date.now()); // 現在の時刻を取得
        setEndTime(null); // endTimeをリセット
    };

    // マッチを終了する
    const stopCalc = () => {
        if (startTime !== null) {
            setEndTime(Date.now()); // 現在の時刻を取得
        }
    };

    // 終了時刻がセットされたときに、開始時刻との差を計算
    useEffect(() => {
        if (startTime !== null && endTime !== null) {
            const diff = endTime - startTime; // 所要時間をミリ秒で計算
            setDuration(Math.floor(diff / 1000)); // 秒単位で計算
        }
    }, [endTime]); // endTimeが変更されたときだけ動作

    return { startCalc, stopCalc, duration };
};
