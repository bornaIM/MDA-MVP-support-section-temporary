import { useState, useLayoutEffect, useCallback, RefObject } from 'react';

interface Size {
    width: number;
    height: number;
}

/**
 * Returns the width and/or height of HTMLElement
 */
export function useElementSize(ref: RefObject<HTMLElement | null>): Size {
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    const handleResize = useCallback(() => {
        if (ref.current) {
            setSize({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    }, [ref]);

    useLayoutEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        handleResize();

        const observer = new ResizeObserver(handleResize);
        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, handleResize]);

    return size;
}