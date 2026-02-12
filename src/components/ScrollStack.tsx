import React, { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

interface ScrollStackProps {
    children: ReactNode;
}

interface ScrollStackItemProps {
    children: ReactNode;
    className?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, className = '' }) => {
    return (
        <div className={`scroll-stack-item ${className}`}>
            <div className="scroll-stack-item-content">
                {children}
            </div>
        </div>
    );
};

const ScrollStack: React.FC<ScrollStackProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenisRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const items = container.querySelectorAll('.scroll-stack-item');

        const handleScroll = () => {
            const containerRect = container.getBoundingClientRect();
            const containerTop = containerRect.top;
            const windowHeight = window.innerHeight;

            items.forEach((item, index) => {
                const element = item as HTMLElement;
                const itemRect = element.getBoundingClientRect();

                // Calculate how much the item has scrolled into view
                const scrollProgress = Math.max(0, Math.min(1,
                    (windowHeight - itemRect.top) / (windowHeight + itemRect.height)
                ));

                // Stacking effect - cards stick to top as you scroll
                const stickyOffset = index * 20; // Offset for stacking effect
                const scale = 1 - (items.length - index - 1) * 0.02;

                // Apply transforms based on scroll position
                if (containerTop < 0 && scrollProgress > 0) {
                    element.style.transform = `translateY(${stickyOffset}px) scale(${scale})`;
                    element.style.opacity = `${0.5 + scrollProgress * 0.5}`;
                } else {
                    element.style.transform = 'translateY(0) scale(1)';
                    element.style.opacity = '1';
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [children]);

    return (
        <div className="scroll-stack-container" ref={containerRef}>
            {children}
        </div>
    );
};

export default ScrollStack;
