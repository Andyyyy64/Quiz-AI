import { useEffect, useState } from 'react';

export const useDots = () => {
    const [dots, setDots] = useState<string>('');
    useEffect(() => {
        const interval = setInterval(() => {
        setDots((prev) => {
            if (prev.length >= 3) {
            return '';
            }
            return prev + '.';
        });
        }, 500);
        return () => clearInterval(interval);
    }, []);
    return dots;
}