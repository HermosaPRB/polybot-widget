import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';

function GlossySphere() {
    const sphereRef = useRef();
    const outerRef = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (sphereRef.current) {
            sphereRef.current.rotation.y = t * 0.15;
            sphereRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
        }
        if (outerRef.current) {
            outerRef.current.rotation.y = -t * 0.08;
        }
    });

    return (
        <group position={[3, -0.2, 0]} scale={1.1}>
            {/* Main Glossy Sphere - Apple-style iridescent glass */}
            <mesh ref={sphereRef}>
                <sphereGeometry args={[1.8, 64, 64]} />
                <meshPhysicalMaterial
                    color="#8B5CF6"
                    roughness={0.05}
                    metalness={0.1}
                    clearcoat={1}
                    clearcoatRoughness={0.05}
                    transmission={0.92}
                    thickness={2.5}
                    ior={2.4}
                    chromaticAberration={0.06}
                    envMapIntensity={3}
                    reflectivity={1}
                    iridescence={1}
                    iridescenceIOR={1.3}
                    iridescenceThicknessRange={[100, 400]}
                />
            </mesh>

            {/* Subtle outer glow ring */}
            <mesh ref={outerRef} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[2.6, 0.02, 16, 100]} />
                <meshBasicMaterial color="#A78BFA" transparent opacity={0.4} />
            </mesh>

            {/* Secondary smaller orbs floating nearby */}
            <Float speed={4} rotationIntensity={0.5} floatIntensity={2}>
                <mesh position={[-2.5, 1.8, 1]}>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#60A5FA"
                        roughness={0.05}
                        metalness={0.2}
                        clearcoat={1}
                        transmission={0.8}
                        thickness={1}
                        ior={2}
                        envMapIntensity={2}
                    />
                </mesh>
            </Float>

            <Float speed={3} rotationIntensity={0.3} floatIntensity={1.5}>
                <mesh position={[2, -2, 1.5]}>
                    <sphereGeometry args={[0.15, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#06B6D4"
                        roughness={0.05}
                        metalness={0.3}
                        clearcoat={1}
                        transmission={0.8}
                        thickness={1}
                        ior={2}
                        envMapIntensity={2}
                    />
                </mesh>
            </Float>

            <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.8}>
                <mesh position={[-1.5, -1.5, -1]}>
                    <sphereGeometry args={[0.35, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#A78BFA"
                        roughness={0.05}
                        metalness={0.1}
                        clearcoat={1}
                        transmission={0.85}
                        thickness={1.5}
                        ior={2}
                        envMapIntensity={2}
                    />
                </mesh>
            </Float>

            {/* Ambient colored lights inside the composition */}
            <pointLight position={[0, 0, 0]} distance={6} intensity={1.5} color="#7C3AED" />
            <pointLight position={[2, 2, 2]} distance={5} intensity={1} color="#2563EB" />
        </group>
    );
}

export default function Scene3D() {
    return (
        <div className="scene-container" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>

                {/* Premium studio lighting for glossy reflections */}
                <ambientLight intensity={0.6} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.3}
                    penumbra={1}
                    intensity={3}
                    color="#ffffff"
                    castShadow
                />
                <spotLight
                    position={[-8, 5, -5]}
                    angle={0.5}
                    penumbra={1}
                    intensity={1.5}
                    color="#A78BFA"
                />
                <pointLight position={[-5, -5, 5]} intensity={1} color="#60A5FA" />

                <PresentationControls
                    global
                    config={{ mass: 2, tension: 400 }}
                    snap={{ mass: 4, tension: 1200 }}
                    rotation={[0.1, -0.2, 0]}
                    polar={[-Math.PI / 5, Math.PI / 5]}
                    azimuth={[-Math.PI / 5, Math.PI / 5]}
                >
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
                        <GlossySphere />
                    </Float>
                </PresentationControls>

                {/* Soft pooled shadow */}
                <ContactShadows
                    position={[3, -3.5, 0]}
                    opacity={0.5}
                    scale={12}
                    blur={3}
                    far={5}
                    color="#2563EB"
                />

                <Environment preset="sunset" />
            </Canvas>
        </div>
    );
}
