import { useEffect } from 'react';

export const usePullToRefresh = (onRefresh) => {
    useEffect(() => {
        let startY = 0;
        let currentY = 0;
        let pulling = false;
        const threshold = 80;

        const handleTouchStart = (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        };

        const handleTouchMove = (e) => {
            if (!pulling) return;
            currentY = e.touches[0].clientY;
        };

        const handleTouchEnd = () => {
            if (!pulling) return;

            const pullDistance = currentY - startY;

            if (pullDistance > threshold) {
                if ('vibrate' in navigator) navigator.vibrate(10);
                setTimeout(() => {
                    if (onRefresh) onRefresh();
                }, 100);
            }

            pulling = false;
            startY = 0;
            currentY = 0;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onRefresh]);
};
