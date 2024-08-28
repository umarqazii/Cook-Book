import { useEffect, useState } from "react";

export const useResponsive = (breakpoints: number[]): number => {
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        const updateIndex = () => {
            const width = window.innerWidth;
            const newIndex = breakpoints.findIndex((bp) => width <= bp);
            setIndex(newIndex === -1 ? breakpoints.length : newIndex);
        };

        updateIndex();
        window.addEventListener('resize', updateIndex);
        return () => window.removeEventListener('resize', updateIndex);
        
    }, [breakpoints]);

    return index;
};
