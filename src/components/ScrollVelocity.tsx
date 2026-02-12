import React, { useRef, useLayoutEffect, useState } from 'react';
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from 'motion/react';
import './ScrollVelocity.css';

interface VelocityMapping {
    input: [number, number];
    output: [number, number];
}

interface VelocityTextProps {
    children: React.ReactNode;
    baseVelocity: number;
    scrollContainerRef?: React.RefObject<HTMLElement>;
    className?: string;
    damping?: number;
    stiffness?: number;
    numCopies?: number;
    velocityMapping?: VelocityMapping;
    parallaxClassName?: string;
    scrollerClassName?: string;
    parallaxStyle?: React.CSSProperties;
    scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
    scrollContainerRef?: React.RefObject<HTMLElement>;
    texts: string[];
    velocity?: number;
    className?: string;
    damping?: number;
    stiffness?: number;
    numCopies?: number;
    velocityMapping?: VelocityMapping;
    parallaxClassName?: string;
    scrollerClassName?: string;
    parallaxStyle?: React.CSSProperties;
    scrollerStyle?: React.CSSProperties;
}

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        function updateWidth() {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        }
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [ref]);

    return width;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
    scrollContainerRef,
    texts = [],
    velocity = 100,
    className = '',
    damping = 50,
    stiffness = 400,
    numCopies = 6,
    velocityMapping = { input: [0, 1000], output: [0, 5] },
    parallaxClassName = 'parallax',
    scrollerClassName = 'scroller',
    parallaxStyle,
    scrollerStyle
}) => {
    function VelocityText({
        children,
        baseVelocity = velocity,
        scrollContainerRef,
        className = '',
        damping,
        stiffness,
        numCopies,
        velocityMapping,
        parallaxClassName,
        scrollerClassName,
        parallaxStyle,
        scrollerStyle
    }: VelocityTextProps) {
        const baseX = useMotionValue(0);
        const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};
        const { scrollY } = useScroll(scrollOptions);
        const scrollVelocity = useVelocity(scrollY);
        const smoothVelocity = useSpring(scrollVelocity, {
            damping: damping ?? 50,
            stiffness: stiffness ?? 400
        });
        const velocityFactor = useTransform(
            smoothVelocity,
            velocityMapping?.input || [0, 1000],
            velocityMapping?.output || [0, 5],
            { clamp: false }
        );

        const copyRef = useRef<HTMLSpanElement>(null);
        const copyWidth = useElementWidth(copyRef);

        function wrap(min: number, max: number, v: number): number {
            const range = max - min;
            const mod = (((v - min) % range) + range) % range;
            return mod + min;
        }

        const x = useTransform(baseX, v => {
            if (copyWidth === 0) return '0px';
            return `${wrap(-copyWidth, 0, v)}px`;
        });

        const directionFactor = useRef<number>(1);
        useAnimationFrame((_t, delta) => {
            let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

            // Maintain direction based on velocity
            if (velocityFactor.get() < 0) {
                directionFactor.current = -1;
            } else if (velocityFactor.get() > 0) {
                directionFactor.current = 1;
            }

            // Add velocity factor to base movement
            moveBy += directionFactor.current * moveBy * velocityFactor.get();

            // Ensure text always moves at a minimum speed even when velocity is zero
            const minimumSpeed = baseVelocity * 0.2; // 20% of base velocity
            const currentSpeed = Math.abs(moveBy / delta * 1000); // Convert to pixels per second

            if (currentSpeed < minimumSpeed) {
                const adjustment = (minimumSpeed - currentSpeed) / 1000 * delta;
                moveBy += directionFactor.current * adjustment;
            }

            baseX.set(baseX.get() + moveBy);
        });

        const spans = [];
        for (let i = 0; i < numCopies!; i++) {
            spans.push(
                <span className={className} key={i} ref={i === 0 ? copyRef : null}>
                    {children}
                </span>
            );
        }

        return (
            <div className={parallaxClassName} style={parallaxStyle}>
                <motion.div
                    className={scrollerClassName}
                    style={{ x, ...scrollerStyle }}
                >
                    {spans}
                </motion.div>
            </div>
        );
    }

    return (
        <section>
            {texts.map((text: string, index: number) => (
                <VelocityText
                    key={index}
                    className={className}
                    baseVelocity={index % 2 !== 0 ? -velocity : velocity}
                    scrollContainerRef={scrollContainerRef}
                    damping={damping}
                    stiffness={stiffness}
                    numCopies={numCopies}
                    velocityMapping={velocityMapping}
                    parallaxClassName={parallaxClassName}
                    scrollerClassName={scrollerClassName}
                    parallaxStyle={parallaxStyle}
                    scrollerStyle={scrollerStyle}
                >
                    {text}&nbsp;
                </VelocityText>
            ))}
        </section>
    );
};

export default ScrollVelocity;
