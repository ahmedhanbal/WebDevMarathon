"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Text,
  Sphere,
  Html
} from "@react-three/drei";
import type * as THREE from "three";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <meshStandardMaterial color="#945E3D" />
      </mesh>
      {/* Legs */}
      <mesh position={[0.5, 0.2, 0.2]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6E4529" />
      </mesh>
      <mesh position={[-0.5, 0.2, 0.2]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6E4529" />
      </mesh>
      <mesh position={[0.5, 0.2, -0.2]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6E4529" />
      </mesh>
      <mesh position={[-0.5, 0.2, -0.2]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#6E4529" />
      </mesh>

      {/* Computer/Tablet on desk */}
      <mesh position={[0, 0.45, 0]} rotation={[0.3, 0, 0]} castShadow>
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
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#636363" />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.55, -0.225]} castShadow>
        <boxGeometry args={[0.5, 0.55, 0.05]} />
        <meshStandardMaterial color="#535353" />
      </mesh>
      {/* Legs */}
      <mesh position={[0.2, 0.125, 0.2]} castShadow>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.2, 0.125, 0.2]} castShadow>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.2, 0.125, -0.2]} castShadow>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.2, 0.125, -0.2]} castShadow>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

// Student component
const Student = ({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0], scale = 0.5 }) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  // Manual animation instead of react-spring
  useEffect(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 0.55 : active ? 0.6 : 0.5;
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  }, [hovered, active]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation as unknown as THREE.Euler}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 16]} />
        <meshStandardMaterial color={active ? "#ff9f43" : "#3079C4"} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#FFD3B4" />
      </mesh>
      <group position={[0, 0.7, 0.2]}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    </group>
  );
};

// Interactive whiteboard component
const Whiteboard = ({
  position = [0, 0, 0] as [number, number, number]
}: {
  position?: [number, number, number];
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const sections = [
    "Web Development Marathon",
    "React, Next.js, Three.js",
    "Build your portfolio"
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % sections.length);
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <group position={position}>
      {/* Board */}
      <mesh position={[0, 1.7, 0]} receiveShadow>
        <boxGeometry args={[5, 2.5, 0.05]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 1.7, -0.03]} castShadow>
        <boxGeometry args={[5.2, 2.7, 0.05]} />
        <meshStandardMaterial color="#999999" />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 2.4, 0.03]}
        fontSize={0.3}
        color="#222"
        anchorX="center"
        anchorY="middle"
      >
        Web Development Course
      </Text>

      {/* Animated content */}
      <Text
        position={[0, 1.7, 0.03]}
        fontSize={0.2}
        color="#0070f3"
        anchorX="center"
        anchorY="middle"
      >
        {sections[activeSection]}
      </Text>

      {/* Bullet points */}
      <Text
        position={[-1.8, 1.2, 0.03]}
        fontSize={0.15}
        color="#333"
        anchorX="left"
        anchorY="middle"
        maxWidth={4}
      >
        • Learn Modern Web Development
        • Build Interactive 3D Experiences
        • Deploy Real Projects
      </Text>
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
      // Make floating more subtle
      ref.current.position.y += Math.sin(t) * 0.0005 * yFactor;

      // Reduce rotation amount
      ref.current.rotation.x = Math.sin(t * 0.5) * 0.01 * rotationFactor;
      ref.current.rotation.y = Math.cos(t * 0.3) * 0.01 * rotationFactor;
    }
  });

  return <group ref={ref}>{children}</group>;
};

// Interactive floating panel
const InteractivePanel = ({ position = [0, 0, 0] as [number, number, number] }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  // Manual animation instead of react-spring
  useEffect(() => {
    if (groupRef.current) {
      // Handle scale
      const scale = hovered ? 1.1 : 1;
      groupRef.current.scale.set(scale, scale, scale);

      // Handle rotation when clicked
      if (clicked) {
        const rotateAnimation = () => {
          if (!groupRef.current) return;
          groupRef.current.rotation.y += 0.05;
          
          if (groupRef.current.rotation.y < Math.PI * 2) {
            requestAnimationFrame(rotateAnimation);
          } else {
            groupRef.current.rotation.y = 0;
            setClicked(false);
          }
        };
        
        requestAnimationFrame(rotateAnimation);
      }
    }
  }, [hovered, clicked]);

  return (
    <group 
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <mesh>
        <planeGeometry args={[1, 0.6]} />
        <meshStandardMaterial
          color={clicked ? "#ff9f43" : "#3079C4"}
          emissive={clicked ? "#ff9f43" : "#3079C4"}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.1}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {clicked ? "Enrolled!" : "Enroll Now"}
      </Text>
    </group>
  );
};

// Classroom scene wrapper
const Scene = () => {
  // Add some subtle ambient animation to make the scene feel alive
  const [desks, setDesks] = useState<{
    position: [number, number, number];
    rotation: [number, number, number];
    active: boolean;
  }[]>([]);
  const [activeStudent, setActiveStudent] = useState(-1);

  useEffect(() => {
    // Create classroom layout with desks
    const rows = 3;
    const cols = 3;
    const spacing = 1.8;
    const startX = -spacing * (cols - 1) / 2;
    const startZ = 2.5; // Moved back slightly

    const newDesks = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * spacing;
        const z = startZ + row * spacing;
        newDesks.push({
          position: [x, 0, z] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          active: false
        });
      }
    }
    setDesks(newDesks);

    // Simulate active student changing
    const interval = setInterval(() => {
      setActiveStudent(Math.floor(Math.random() * newDesks.length));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Camera & Controls */}
      <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={45} />
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
        // Restrict movement to prevent visual issues with overlays
        target={[0, 1, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} castShadow />
      <spotLight position={[0, 5, 0]} intensity={0.3} angle={0.5} penumbra={0.5} castShadow />

      {/* Classroom Elements */}
      <group position={[0, 0, 0]}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>

        {/* Ceiling with subtle pattern */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#d0d0d0" />
        </mesh>

        {/* Walls */}
        <mesh position={[0, 1.7, -3]} receiveShadow>
          <boxGeometry args={[12, 3.5, 0.1]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        
        <mesh position={[-6, 1.7, 3]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[12, 3.5, 0.1]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
        
        <mesh position={[6, 1.7, 3]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[12, 3.5, 0.1]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>

        {/* Whiteboard at front of class */}
        <Whiteboard position={[0, 0, -2.5]} />

        {/* Teacher's desk */}
        <FloatingObject speed={0.8} yFactor={0.5}>
          <Desk position={[0, 0, -0.5]} scale={1.3} rotation={[0, Math.PI, 0]} />
        </FloatingObject>
        
        {/* Teacher */}
        <Student position={[0, 0, 0]} rotation={[0, 0, 0]} scale={0.5} />

        {/* Student desks with students */}
        {desks.map((desk, i) => (
          <group key={`desk-group-${i}`}>
            <FloatingObject key={`desk-${i}`} speed={0.5 + Math.random() * 0.5} yFactor={0.3 + Math.random() * 0.4}>
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
            
            <Student 
              position={[desk.position[0], 0, desk.position[2] + 0.1]}
              rotation={[0, 0, 0]}
              scale={0.5}
            />
          </group>
        ))}

        {/* Ambient floating items to create a more lively scene */}
        <FloatingObject speed={1.2} yFactor={1} rotationFactor={1}>
          <mesh position={[1.5, 1.5, 3]} castShadow>
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial color="#6A7FDB" wireframe />
          </mesh>
        </FloatingObject>

        <FloatingObject speed={0.8} yFactor={1.2} rotationFactor={1.5}>
          <mesh position={[-2, 2, 1]} castShadow>
            <dodecahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial color="#8A7FDB" wireframe />
          </mesh>
        </FloatingObject>

        {/* Interactive UI panel */}
        <FloatingObject speed={0.5} yFactor={0.7} rotationFactor={0.2}>
          <InteractivePanel position={[2, 1.2, 0]} />
        </FloatingObject>
        
        {/* Course modules visualized as floating cubes */}
        <FloatingObject speed={0.7} yFactor={0.6} rotationFactor={0.3}>
          <group position={[-3, 1.5, 1]}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.12}
              color="#fff"
              anchorX="center"
              anchorY="middle"
            >
              HTML/CSS
            </Text>
          </group>
        </FloatingObject>
        
        <FloatingObject speed={0.9} yFactor={0.8} rotationFactor={0.4}>
          <group position={[-2.5, 1.8, 2]}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color="#48dbfb" />
            </mesh>
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.12}
              color="#fff"
              anchorX="center"
              anchorY="middle"
            >
              JavaScript
            </Text>
          </group>
        </FloatingObject>
        
        <FloatingObject speed={1.1} yFactor={0.9} rotationFactor={0.5}>
          <group position={[-3.2, 2.1, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color="#1dd1a1" />
            </mesh>
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.12}
              color="#fff"
              anchorX="center"
              anchorY="middle"
            >
              React
            </Text>
          </group>
        </FloatingObject>
      </group>
    </>
  );
};

// Import the 3D scene content with no SSR
const ClassroomSceneContent = dynamic(
  () => import('./ClassroomSceneContent'),
  { 
    ssr: false,
    loading: () => <ScenePlaceholder />
  }
);

// Placeholder component to show while the 3D scene is loading
const ScenePlaceholder = () => (
  <div className="h-[60vh] w-full flex items-center justify-center bg-gray-100">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg text-blue-800 font-medium">Loading 3D Classroom...</p>
    </div>
  </div>
);

// Main component that renders the 3D scene with a loading fallback
const ClassroomScene = () => {
  return <ClassroomSceneContent />;
};

export default ClassroomScene;
