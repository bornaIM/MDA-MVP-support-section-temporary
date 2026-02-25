import { useEffect, useRef } from 'react';

/** Used for modals to delay interactibility so that keyboard users don't
 * close the modal too early
 */
export function useDelayedInteractable(delayMs: number = 500) {
    const isInteractable = useRef<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            isInteractable.current = true;
        }, delayMs);
    }, []);

    return { isInteractable };
}
