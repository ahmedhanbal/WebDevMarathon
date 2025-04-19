"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import type * as THREE from "three";

// Simple desk component
const Desk = ({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  scale = 1
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Desktop */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <meshStandardMaterial color="#945E3D" />
      </mesh>
      {/* Legs */}
      <mesh position={[0.5, 0.2, 0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6E4529" />
      </mesh>
      <mesh position={[-0.5, 0.2, 0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6E4529" />
      </mesh>
      <mesh position={[0.5, 0.2, -0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6E4529" />
      </mesh>
      <mesh position={[-0.5, 0.2, -0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6E4529" />
      </mesh>

      {/* Computer/Tablet on desk */}
      <mesh position={[0, 0.45, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, 0.46, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.55, 0.01, 0.35]} />
        <meshStandardMaterial color="#3079C4" emissive="#3079C4" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};

// Simple chair component
const Chair = ({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number]
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#636363" />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.55, -0.225]}>
        <boxGeometry args={[0.5, 0.55, 0.05]} />
        <meshStandardMaterial color="#535353" />
      </mesh>
      {/* Legs */}
      <mesh position={[0.2, 0.125, 0.2]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.2, 0.125, 0.2]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.2, 0.125, -0.2]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.2, 0.125, -0.2]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

// Simple whiteboard component
const Whiteboard = ({
  position = [0, 0, 0] as [number, number, number]
}: {
  position?: [number, number, number];
}) => {
  return (
    <group position={position}>
      {/* Board */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[5, 2.5, 0.05]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 1.5, -0.03]}>
        <boxGeometry args={[5.2, 2.7, 0.05]} />
        <meshStandardMaterial color="#999999" />
      </mesh>

      {/* Simple text representation since we can't use actual Text component */}
      <mesh position={[0, 1.8, 0.03]}>
        <planeGeometry args={[2, 0.4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* Feature bullets */}
      <mesh position={[-1.8, 1.4, 0.03]}>
        <planeGeometry args={[3, 1.2]} />
        <meshBasicMaterial color="#555555" opacity={0} transparent />
      </mesh>
    </group>
  );
};

// Animation: Floating objects
const FloatingObject = ({
  children,
  speed = 1,
  rotationFactor = 0.5,
  yFactor = 0.2
}: {
  children: React.ReactNode;
  speed?: number;
  rotationFactor?: number;
  yFactor?: number;
}) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;

    if (ref.current) {
      // Gentle float up and down
      ref.current.position.y += Math.sin(t) * 0.001 * yFactor;

      // Subtle rotation
      ref.current.rotation.x = Math.sin(t * 0.5) * 0.02 * rotationFactor;
      ref.current.rotation.y = Math.cos(t * 0.3) * 0.02 * rotationFactor;
    }
  });

  return <group ref={ref}>{children}</group>;
};

// Classroom scene wrapper
const Scene = () => {
  // Add some subtle ambient animation to make the scene feel alive
  const [desks, setDesks] = useState<{
    position: [number, number, number];
    rotation: [number, number, number];
  }[]>([]);

  useEffect(() => {
    // Create classroom layout with desks
    const rows = 3;
    const cols = 3;
    const spacing = 1.8;
    const startX = -spacing * (cols - 1) / 2;
    const startZ = 2;

    const newDesks = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * spacing;
        const z = startZ + row * spacing;
        newDesks.push({
          position: [x, 0, z] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
        });
      }
    }
    setDesks(newDesks);
  }, []);

  return (
    <>
      {/* Camera & Controls */}
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minPolarAngle={Math.PI / 4}
        // Limit rotation to keep the view focused on the classroom
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        // Make controls feel smooth
        enableDamping={true}
        dampingFactor={0.05}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Classroom Elements */}
      <group position={[0, 0, 0]}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>

        {/* Whiteboard at front of class */}
        <Whiteboard position={[0, 0, -2]} />

        {/* Teacher's desk */}
        <FloatingObject speed={0.8} yFactor={0.5}>
          <Desk position={[0, 0, -0.5]} scale={1.3} rotation={[0, Math.PI, 0]} />
        </FloatingObject>
        <Chair position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />

        {/* Student desks */}
        {desks.map((desk, i) => (
          <FloatingObject key={`desk-${i}-${desk.position[0]}-${desk.position[2]}`} speed={0.5 + Math.random() * 0.5} yFactor={0.3 + Math.random() * 0.4}>
            <Desk
              position={desk.position}
              rotation={desk.rotation}
              scale={0.9}
            />
            <Chair
              position={[desk.position[0], desk.position[1], desk.position[2] + 0.4]}
              rotation={desk.rotation}
            />
          </FloatingObject>
        ))}

        {/* Ambient floating items to create a more lively scene */}
        <FloatingObject speed={1.2} yFactor={1} rotationFactor={1}>
          <mesh position={[1.5, 1.5, 3]}>
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial color="#6A7FDB" wireframe />
          </mesh>
        </FloatingObject>

        <FloatingObject speed={0.8} yFactor={1.2} rotationFactor={1.5}>
          <mesh position={[-2, 2, 1]}>
            <dodecahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial color="#8A7FDB" wireframe />
          </mesh>
        </FloatingObject>

        {/* Virtual UI elements floating in 3D space */}
        <FloatingObject speed={0.5} yFactor={0.7} rotationFactor={0.2}>
          <mesh position={[2, 1.2, 0]} rotation={[0, -Math.PI / 6, 0]}>
            <planeGeometry args={[1, 0.6]} />
            <meshStandardMaterial
              color="#3079C4"
              emissive="#3079C4"
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        </FloatingObject>
      </group>
    </>
  );
};

// Main export
const ClassroomScene = () => {
  return (
    <Canvas shadows dpr={[1, 2]} className="bg-gradient-to-b from-blue-900 to-purple-900">
      <fog attach="fog" args={["#14213d", 8, 30]} />
      <color attach="background" args={["#14213d"]} />
      <Scene />
    </Canvas>
  );
};

export default ClassroomScene;
