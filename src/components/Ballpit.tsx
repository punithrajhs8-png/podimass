import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Ballpit Props
export interface BallpitProps {
    className?: string;
    followCursor?: boolean;
    count?: number;
    colors?: number[];
    gravity?: number;
    minSize?: number;
    maxSize?: number;
}

// Default configuration
const DEFAULT_CONFIG = {
    count: 100,
    colors: [0xf97316, 0xec4899, 0xa855f7],
    ambientColor: 0xffffff,
    ambientIntensity: 1,
    lightIntensity: 200,
    materialParams: {
        metalness: 0.5,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.15
    },
    minSize: 0.5,
    maxSize: 1,
    size0: 1,
    gravity: 0.5,
    friction: 0.9975,
    wallBounce: 0.95,
    maxVelocity: 0.15,
    maxX: 5,
    maxY: 5,
    maxZ: 2,
    controlSphere0: false,
    followCursor: true
};

type Config = typeof DEFAULT_CONFIG;

// Physics simulation
class BallPhysics {
    config: Config;
    positionData: Float32Array;
    velocityData: Float32Array;
    sizeData: Float32Array;
    center = new THREE.Vector3();

    constructor(config: Config) {
        this.config = config;
        this.positionData = new Float32Array(3 * config.count).fill(0);
        this.velocityData = new Float32Array(3 * config.count).fill(0);
        this.sizeData = new Float32Array(config.count).fill(1);
        this.initPositions();
        this.setSizes();
    }

    private initPositions() {
        const { config, positionData } = this;
        this.center.toArray(positionData, 0);
        for (let i = 1; i < config.count; i++) {
            const base = 3 * i;
            positionData[base] = THREE.MathUtils.randFloatSpread(2 * config.maxX);
            positionData[base + 1] = THREE.MathUtils.randFloatSpread(2 * config.maxY);
            positionData[base + 2] = THREE.MathUtils.randFloatSpread(2 * config.maxZ);
        }
    }

    setSizes() {
        const { config, sizeData } = this;
        sizeData[0] = config.size0;
        for (let i = 1; i < config.count; i++) {
            sizeData[i] = THREE.MathUtils.randFloat(config.minSize, config.maxSize);
        }
    }

    update(delta: number) {
        const { config, center, positionData, sizeData, velocityData } = this;
        const pos = new THREE.Vector3();
        const vel = new THREE.Vector3();
        const otherPos = new THREE.Vector3();
        const otherVel = new THREE.Vector3();
        const diff = new THREE.Vector3();
        const push = new THREE.Vector3();
        const sphere0Pos = new THREE.Vector3();

        let startIdx = 0;
        if (config.controlSphere0) {
            startIdx = 1;
            sphere0Pos.fromArray(positionData, 0);
            sphere0Pos.lerp(center, 0.1).toArray(positionData, 0);
            new THREE.Vector3(0, 0, 0).toArray(velocityData, 0);
        }

        // Update velocities and positions
        for (let idx = startIdx; idx < config.count; idx++) {
            const base = 3 * idx;
            pos.fromArray(positionData, base);
            vel.fromArray(velocityData, base);

            vel.y -= delta * config.gravity * sizeData[idx];
            vel.multiplyScalar(config.friction);
            vel.clampLength(0, config.maxVelocity);
            pos.add(vel);

            pos.toArray(positionData, base);
            vel.toArray(velocityData, base);
        }

        // Collision detection
        for (let idx = startIdx; idx < config.count; idx++) {
            const base = 3 * idx;
            pos.fromArray(positionData, base);
            vel.fromArray(velocityData, base);
            const radius = sizeData[idx];

            // Ball-to-ball collisions
            for (let jdx = idx + 1; jdx < config.count; jdx++) {
                const otherBase = 3 * jdx;
                otherPos.fromArray(positionData, otherBase);
                otherVel.fromArray(velocityData, otherBase);
                const otherRadius = sizeData[jdx];

                diff.copy(otherPos).sub(pos);
                const dist = diff.length();
                const sumRadius = radius + otherRadius;

                if (dist < sumRadius && dist > 0) {
                    const overlap = sumRadius - dist;
                    push.copy(diff).normalize().multiplyScalar(0.5 * overlap);

                    pos.sub(push);
                    vel.sub(push.clone().multiplyScalar(Math.max(vel.length(), 1)));
                    pos.toArray(positionData, base);
                    vel.toArray(velocityData, base);

                    otherPos.add(push);
                    otherVel.add(push.clone().multiplyScalar(Math.max(otherVel.length(), 1)));
                    otherPos.toArray(positionData, otherBase);
                    otherVel.toArray(velocityData, otherBase);
                }
            }

            // Collision with controlled sphere
            if (config.controlSphere0) {
                diff.copy(sphere0Pos).sub(pos);
                const dist = diff.length();
                const sumRadius0 = radius + sizeData[0];
                if (dist < sumRadius0 && dist > 0) {
                    const overlap = sumRadius0 - dist;
                    push.copy(diff.normalize()).multiplyScalar(overlap);
                    pos.sub(push);
                    vel.sub(push.clone().multiplyScalar(Math.max(vel.length(), 2)));
                }
            }

            // Wall collisions
            if (Math.abs(pos.x) + radius > config.maxX) {
                pos.x = Math.sign(pos.x) * (config.maxX - radius);
                vel.x = -vel.x * config.wallBounce;
            }
            if (config.gravity === 0) {
                if (Math.abs(pos.y) + radius > config.maxY) {
                    pos.y = Math.sign(pos.y) * (config.maxY - radius);
                    vel.y = -vel.y * config.wallBounce;
                }
            } else if (pos.y - radius < -config.maxY) {
                pos.y = -config.maxY + radius;
                vel.y = -vel.y * config.wallBounce;
            }
            const maxBoundary = Math.max(config.maxZ, config.maxSize);
            if (Math.abs(pos.z) + radius > maxBoundary) {
                pos.z = Math.sign(pos.z) * (config.maxZ - radius);
                vel.z = -vel.z * config.wallBounce;
            }

            pos.toArray(positionData, base);
            vel.toArray(velocityData, base);
        }
    }
}

// Color gradient helper
function createColorGradient(colors: number[]) {
    const colorObjs = colors.map(c => new THREE.Color(c));
    return {
        getColorAt: (ratio: number, out = new THREE.Color()) => {
            const scaled = Math.max(0, Math.min(1, ratio)) * (colors.length - 1);
            const idx = Math.floor(scaled);
            const start = colorObjs[idx];
            if (idx >= colors.length - 1) return start.clone();
            const alpha = scaled - idx;
            const end = colorObjs[idx + 1];
            out.r = start.r + alpha * (end.r - start.r);
            out.g = start.g + alpha * (end.g - start.g);
            out.b = start.b + alpha * (end.b - start.b);
            return out;
        }
    };
}

// Create the ballpit scene
function createBallpit(canvas: HTMLCanvasElement, userConfig: Partial<Config> = {}) {
    const config: Config = { ...DEFAULT_CONFIG, ...userConfig };

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Setup scene
    const scene = new THREE.Scene();

    // Setup camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    // Setup environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(roomEnv).texture;

    // Create geometry and material
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
        envMap,
        metalness: config.materialParams.metalness,
        roughness: config.materialParams.roughness,
        clearcoat: config.materialParams.clearcoat,
        clearcoatRoughness: config.materialParams.clearcoatRoughness,
    });

    // Create instanced mesh
    const mesh = new THREE.InstancedMesh(geometry, material, config.count);
    scene.add(mesh);

    // Setup lights
    const ambientLight = new THREE.AmbientLight(config.ambientColor, config.ambientIntensity);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(config.colors[0], config.lightIntensity);
    scene.add(pointLight);

    // Setup physics
    const physics = new BallPhysics(config);
    const tempObject = new THREE.Object3D();

    // Set colors
    const gradient = createColorGradient(config.colors);
    for (let i = 0; i < config.count; i++) {
        mesh.setColorAt(i, gradient.getColorAt(i / config.count));
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Pointer handling
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();

    function onPointerMove(event: PointerEvent) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(plane, intersectionPoint);
        physics.center.copy(intersectionPoint);
        config.controlSphere0 = true;
    }

    function onPointerLeave() {
        config.controlSphere0 = false;
    }

    function onTouchMove(event: TouchEvent) {
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            raycaster.ray.intersectPlane(plane, intersectionPoint);
            physics.center.copy(intersectionPoint);
            config.controlSphere0 = true;
        }
    }

    function onTouchEnd() {
        config.controlSphere0 = false;
    }

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // Resize handler
    function resize() {
        const parent = canvas.parentElement;
        if (!parent) return;

        const width = parent.clientWidth;
        const height = parent.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        // Update world bounds
        const fovRad = (camera.fov * Math.PI) / 180;
        const wHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
        const wWidth = wHeight * camera.aspect;
        config.maxX = wWidth / 2;
        config.maxY = wHeight / 2;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement || canvas);
    resize();

    // Animation
    const clock = new THREE.Clock();
    let animationId: number;
    let isVisible = true;

    function animate() {
        if (!isVisible) return;
        animationId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        physics.update(delta);

        // Update mesh instances
        for (let i = 0; i < config.count; i++) {
            tempObject.position.fromArray(physics.positionData, 3 * i);

            if (i === 0 && !config.followCursor) {
                tempObject.scale.setScalar(0);
            } else {
                tempObject.scale.setScalar(physics.sizeData[i]);
            }

            tempObject.updateMatrix();
            mesh.setMatrixAt(i, tempObject.matrix);

            if (i === 0) {
                pointLight.position.copy(tempObject.position);
            }
        }
        mesh.instanceMatrix.needsUpdate = true;

        renderer.render(scene, camera);
    }

    // Visibility handling
    const intersectionObserver = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
            clock.start();
            animate();
        } else {
            clock.stop();
        }
    });
    intersectionObserver.observe(canvas);

    // Start animation
    animate();

    // Cleanup function
    return {
        dispose: () => {
            cancelAnimationFrame(animationId);
            intersectionObserver.disconnect();
            resizeObserver.disconnect();
            canvas.removeEventListener('pointermove', onPointerMove);
            canvas.removeEventListener('pointerleave', onPointerLeave);
            canvas.removeEventListener('touchmove', onTouchMove);
            canvas.removeEventListener('touchend', onTouchEnd);

            geometry.dispose();
            material.dispose();
            envMap.dispose();
            pmremGenerator.dispose();
            renderer.dispose();
        }
    };
}

// React Component
const Ballpit: React.FC<BallpitProps> = ({
    className = '',
    followCursor = true,
    count = 80,
    colors = [0xf97316, 0xec4899, 0xa855f7],
    gravity = 0.3,
    minSize = 0.4,
    maxSize = 1.2
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const instanceRef = useRef<{ dispose: () => void } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        instanceRef.current = createBallpit(canvas, {
            followCursor,
            count,
            colors,
            gravity,
            minSize,
            maxSize
        });

        return () => {
            instanceRef.current?.dispose();
        };
    }, []);

    return (
        <canvas
            className={className}
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    );
};

export default Ballpit;
