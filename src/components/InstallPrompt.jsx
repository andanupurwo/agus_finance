import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const InstallPrompt = () => {
    const { isInstallable, isInstalled, installPWA } = usePWA();
    const [dismissed, setDismissed] = useState(false);
    const [installing, setInstalling] = useState(false);

    // Check if user previously dismissed
    useEffect(() => {
        const wasDismissed = localStorage.getItem('pwa-install-dismissed');
        if (wasDismissed) {
            setDismissed(true);
        }
    }, []);

    const handleInstall = async () => {
        setInstalling(true);
        const success = await installPWA();

        if (success) {
            // Vibrate on success
            if ('vibrate' in navigator) {
                navigator.vibrate([10, 50, 10]);
            }
        }

        setInstalling(false);
    };

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('pwa-install-dismissed', 'true');

        // Light vibration
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    };

    // Don't show if: already installed, dismissed, or not installable
    if (isInstalled || dismissed || !isInstallable) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] p-3 animate-in slide-in-from-top duration-500">
            <div className="max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl shadow-2xl border border-blue-400 dark:border-blue-800 p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <Download size={20} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm mb-1">
                            Install Agus Finance
                        </h3>
                        <p className="text-xs text-blue-100 dark:text-blue-200 mb-3">
                            Akses lebih cepat! Install sebagai aplikasi di perangkat Anda.
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleInstall}
                                disabled={installing}
                                className="flex-1 bg-white hover:bg-blue-50 text-blue-600 font-bold text-xs py-2 px-3 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                                {installing ? 'Installing...' : 'Install'}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-3 py-2 text-white/80 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
