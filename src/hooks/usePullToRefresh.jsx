import { useEffect } from 'react';

export const usePullToRefresh = (onRefresh) => {
    useEffect(() => {
        let startY = 0;
        let currentY = 0;
        let pulling = false;
        const threshold = 80;

        const handleTouchStart = (e) => {
            // Only trigger if scrolled to top
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        };

        const handleTouchMove = (e) => {
            if (!pulling) return;

            currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY;

            if (pullDistance > 0 && window.scrollY === 0) {
                // Add visual feedback indicator
                const indicator = document.getElementById('pull-to-refresh-indicator');
                if (indicator) {
                    const progress = Math.min(pullDistance / threshold, 1);
                    indicator.style.transform = `translateY(${pullDistance * 0.5}px)`;
                    indicator.style.opacity = progress;
                }
            }
        };

        const handleTouchEnd = () => {
            if (!pulling) return;

            const pullDistance = currentY - startY;
            const indicator = document.getElementById('pull-to-refresh-indicator');

            if (pullDistance > threshold) {
                // Trigger refresh
                if (onRefresh) {
                    // Haptic feedback
                    if ('vibrate' in navigator) {
                        navigator.vibrate(10);
                    }

                    onRefresh();
                }
            }

            // Reset indicator
            if (indicator) {
                indicator.style.transform = 'translateY(0)';
                indicator.style.opacity = '0';
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

export const PullToRefreshIndicator = () => {
    return (
        <div
            id="pull-to-refresh-indicator"
            className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-center py-4 transition-transform duration-300 pointer-events-none"
            style={{ transform: 'translateY(0)', opacity: 0 }}
        >
            <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold">Pull to refresh...</span>
            </div>
        </div>
    );
};
