import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from 'ogl';

interface CircularGalleryProps {
    bend?: number;
    textColor?: string;
    borderRadius?: number;
    scrollSpeed?: number;
    scrollEase?: number;
}

const CircularGallery: React.FC<CircularGalleryProps> = ({
    bend = -4,
    textColor: _textColor = '#ffffff',
    borderRadius = 0.09,
    scrollSpeed = 2,
    scrollEase = 0.06,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const scrollRef = useRef(0);
    const targetScrollRef = useRef(0);

    // Sample images for the gallery - university/education themed
    const images = [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Create renderer
        const renderer = new Renderer({
            alpha: true,
            antialias: true,
        });
        rendererRef.current = renderer;
        const gl = renderer.gl;
        container.appendChild(gl.canvas);

        // Set size
        const resize = () => {
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            camera.perspective({
                aspect: container.offsetWidth / container.offsetHeight,
            });
        };

        // Create camera
        const camera = new Camera(gl, {
            fov: 45,
            aspect: container.offsetWidth / container.offsetHeight,
            near: 0.1,
            far: 100,
        });
        camera.position.z = 5;

        // Create scene
        const scene = new Transform();

        // Vertex shader with bend effect
        const vertex = /* glsl */ `
            attribute vec3 position;
            attribute vec2 uv;
            
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform float uBend;
            uniform float uRadius;
            
            varying vec2 vUv;
            varying float vBend;
            
            void main() {
                vUv = uv;
                
                vec3 pos = position;
                
                // Apply cylindrical bend
                float angle = pos.x * uBend * 0.1;
                float radius = uRadius + pos.z;
                pos.x = sin(angle) * radius;
                pos.z = cos(angle) * radius - uRadius;
                
                vBend = abs(angle);
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;

        // Fragment shader with rounded corners
        const fragment = /* glsl */ `
            precision highp float;
            
            uniform sampler2D tMap;
            uniform float uBorderRadius;
            uniform vec3 uTextColor;
            
            varying vec2 vUv;
            varying float vBend;
            
            float roundedBox(vec2 p, vec2 b, float r) {
                vec2 d = abs(p) - b + r;
                return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
            }
            
            void main() {
                vec2 uv = vUv;
                
                // Rounded corners
                vec2 p = uv * 2.0 - 1.0;
                float d = roundedBox(p, vec2(1.0 - uBorderRadius), uBorderRadius);
                float alpha = 1.0 - smoothstep(0.0, 0.02, d);
                
                vec4 color = texture2D(tMap, uv);
                
                // Fade based on bend angle
                float fade = 1.0 - smoothstep(0.0, 1.5, vBend);
                
                gl_FragColor = vec4(color.rgb, color.a * alpha * fade);
            }
        `;

        // Create meshes for each image
        const meshes: Mesh[] = [];
        const planeWidth = 1.2;
        const planeHeight = 0.9;
        const gap = 0.3;
        const totalWidth = (planeWidth + gap) * images.length;

        images.forEach((imageUrl, index) => {
            const texture = new Texture(gl);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                texture.image = img;
            };
            img.src = imageUrl;

            const geometry = new Plane(gl, {
                width: planeWidth,
                height: planeHeight,
                widthSegments: 20,
                heightSegments: 20,
            });

            const program = new Program(gl, {
                vertex,
                fragment,
                uniforms: {
                    tMap: { value: texture },
                    uBend: { value: bend },
                    uRadius: { value: 3 },
                    uBorderRadius: { value: borderRadius },
                    uTextColor: { value: [1, 1, 1] },
                },
                transparent: true,
            });

            const mesh = new Mesh(gl, { geometry, program });
            mesh.position.x = index * (planeWidth + gap) - totalWidth / 2 + planeWidth / 2;
            mesh.setParent(scene);
            meshes.push(mesh);
        });

        // Handle scroll
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            targetScrollRef.current += e.deltaY * 0.002 * scrollSpeed;
        };

        // Handle touch
        let touchStart = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStart = e.touches[0].clientX;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const delta = touchStart - e.touches[0].clientX;
            targetScrollRef.current += delta * 0.005 * scrollSpeed;
            touchStart = e.touches[0].clientX;
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove);

        // Animation loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Smooth scroll
            scrollRef.current += (targetScrollRef.current - scrollRef.current) * scrollEase;

            // Update mesh positions
            meshes.forEach((mesh, index) => {
                const baseX = index * (planeWidth + gap) - totalWidth / 2 + planeWidth / 2;
                let x = baseX - scrollRef.current;

                // Wrap around
                while (x < -totalWidth / 2 - planeWidth) x += totalWidth;
                while (x > totalWidth / 2 + planeWidth) x -= totalWidth;

                mesh.position.x = x;

                // Update bend uniform
                (mesh.program.uniforms.uBend as { value: number }).value = bend;
                (mesh.program.uniforms.uBorderRadius as { value: number }).value = borderRadius;
            });

            renderer.render({ scene, camera });
        };

        resize();
        window.addEventListener('resize', resize);
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            if (gl.canvas.parentNode) {
                gl.canvas.parentNode.removeChild(gl.canvas);
            }
        };
    }, [bend, borderRadius, scrollSpeed, scrollEase, images]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                cursor: 'grab',
            }}
        />
    );
};

export default CircularGallery;
