import { useState, useEffect } from 'react';

export const usePWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Listen for successful install
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installPWA = async () => {
        if (!deferredPrompt) {
            return false;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstallable(false);
            return true;
        }

        return false;
    };

    return {
        isInstallable,
        isInstalled,
        installPWA
    };
};

// Haptic Feedback Hook
export const useHaptic = () => {
    const vibrate = (pattern = [10]) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    };

    const light = () => vibrate([10]);
    const medium = () => vibrate([20]);
    const heavy = () => vibrate([30]);
    const success = () => vibrate([10, 50, 10]);
    const error = () => vibrate([30, 50, 30, 50, 30]);
    const warning = () => vibrate([20, 50, 20]);

    return {
        vibrate,
        light,
        medium,
        heavy,
        success,
        error,
        warning
    };
};
