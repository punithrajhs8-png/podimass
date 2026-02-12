import React, { useEffect, useRef } from 'react';
import './UnicornStudioBackground.css';

const UnicornStudioBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        // Prevent duplicate script loading
        if (scriptLoadedRef.current) return;
        scriptLoadedRef.current = true;

        // Check if UnicornStudio is already loaded
        const u = (window as any).UnicornStudio;

        if (u && u.init) {
            // UnicornStudio is already available, initialize
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => u.init());
            } else {
                u.init();
            }
        } else {
            // Create UnicornStudio global object
            (window as any).UnicornStudio = { isInitialized: false };

            // Create and load the script
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js';
            script.onload = () => {
                const us = (window as any).UnicornStudio;
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => us.init());
                } else {
                    us.init();
                }
            };

            document.head.appendChild(script);
        }

        // Cleanup function
        return () => {
            // Script cleanup if needed
        };
    }, []);

    return (
        <div ref={containerRef} className="unicorn-studio-bg">
            <div
                data-us-project="dpIG8woN8XklNJqodfjc"
                className="unicorn-studio-embed"
            />
        </div>
    );
};

export default UnicornStudioBackground;
