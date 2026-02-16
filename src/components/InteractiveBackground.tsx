import React, { useEffect, useRef, useCallback } from 'react';

const InteractiveBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animRef = useRef<number>(0);
    const dotsRef = useRef<{ x: number; y: number; baseX: number; baseY: number; radius: number; opacity: number }[]>([]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = 0;
        let h = 0;
        const spacing = 60;
        const interactionRadius = 120;
        const pushStrength = 20;

        const initDots = () => {
            w = container.offsetWidth;
            h = container.offsetHeight;
            canvas.width = w;
            canvas.height = h;

            const dots: typeof dotsRef.current = [];
            for (let x = spacing / 2; x < w; x += spacing) {
                for (let y = spacing / 2; y < h; y += spacing) {
                    dots.push({
                        x, y,
                        baseX: x,
                        baseY: y,
                        radius: 2.5,
                        opacity: 0.35 + Math.random() * 0.15,
                    });
                }
            }
            dotsRef.current = dots;
        };

        initDots();

        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            const dots = dotsRef.current;

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                const dx = mx - dot.baseX;
                const dy = my - dot.baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < interactionRadius) {
                    const force = (interactionRadius - dist) / interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    const targetX = dot.baseX - Math.cos(angle) * force * pushStrength;
                    const targetY = dot.baseY - Math.sin(angle) * force * pushStrength;
                    dot.x += (targetX - dot.x) * 0.15;
                    dot.y += (targetY - dot.y) * 0.15;

                    // Draw with interaction glow
                    const glowOpacity = 0.3 + force * 0.55;
                    const glowRadius = dot.radius + force * 4;

                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, glowRadius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(249, 115, 22, ${glowOpacity})`;
                    ctx.fill();

                    // Connection lines to nearby dots within interaction radius
                    for (let j = i + 1; j < dots.length; j++) {
                        const other = dots[j];
                        const odx = other.x - dot.x;
                        const ody = other.y - dot.y;
                        const odist = Math.sqrt(odx * odx + ody * ody);
                        if (odist < spacing * 1.6) {
                            const otherDist = Math.sqrt((mx - other.baseX) ** 2 + (my - other.baseY) ** 2);
                            if (otherDist < interactionRadius) {
                                const lineOpacity = (1 - odist / (spacing * 1.6)) * 0.35;
                                ctx.beginPath();
                                ctx.moveTo(dot.x, dot.y);
                                ctx.lineTo(other.x, other.y);
                                ctx.strokeStyle = `rgba(249, 115, 22, ${lineOpacity})`;
                                ctx.lineWidth = 0.8;
                                ctx.stroke();
                            }
                        }
                    }
                } else {
                    // Ease back to base position
                    dot.x += (dot.baseX - dot.x) * 0.08;
                    dot.y += (dot.baseY - dot.y) * 0.08;

                    // Draw normal dot
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(160, 160, 180, ${dot.opacity})`;
                    ctx.fill();
                }
            }

            // Draw a soft glow around the mouse
            if (mx > 0 && my > 0) {
                const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, interactionRadius);
                gradient.addColorStop(0, 'rgba(249, 115, 22, 0.12)');
                gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.05)');
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(mx, my, interactionRadius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animate();



        container.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', initDots);

        const ro = new ResizeObserver(initDots);
        ro.observe(container);

        return () => {
            cancelAnimationFrame(animRef.current);
            container.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', initDots);
            ro.disconnect();
        };
    }, [handleMouseMove]);

    return (
        <div ref={containerRef} className="interactive-bg-wrapper">
            <canvas ref={canvasRef} className="interactive-bg-canvas" />
            {children}
        </div>
    );
};

export default InteractiveBackground;
