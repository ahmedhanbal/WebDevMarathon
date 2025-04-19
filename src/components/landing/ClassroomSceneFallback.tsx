"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FloatingObject = ({ 
  children, 
  delay = 0, 
  duration = 4, 
  className = "",
  style = {} 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, -2, 0, 2, 0]
      }}
      transition={{
        repeat: Infinity,
        duration: duration,
        delay: delay,
        ease: "easeInOut",
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

// Isometric positioning helper
const iso = (x: number, y: number, z: number) => {
  // Convert 3D coordinates to 2D isometric view
  const isoX = (x - z) * 0.866; // cos(30 degrees) = 0.866
  const isoY = (x + z) * 0.5 - y; // sin(30 degrees) = 0.5
  
  return `translate(${isoX}px, ${isoY}px)`;
};

const Desk = ({ x = 0, y = 0, z = 0, delay = 0 }: { x: number, y: number, z: number, delay?: number }) => {
  return (
    <FloatingObject
      className="absolute" 
      style={{ transform: iso(x, y, z) }}
      delay={delay}
      duration={4 + Math.random()}
    >
      <div className="relative">
        {/* Desktop */}
        <div className="w-20 h-10 bg-amber-800 rounded-sm shadow-md transform-gpu" />
        
        {/* Desktop top */}
        <div className="absolute -top-1 w-20 h-1 bg-amber-700 rounded-t-sm" />
        
        {/* Legs */}
        <div className="absolute -bottom-6 left-1 w-2 h-6 bg-amber-900" />
        <div className="absolute -bottom-6 right-1 w-2 h-6 bg-amber-900" />
        <div className="absolute -bottom-6 left-16 w-2 h-6 bg-amber-900" />
        <div className="absolute -bottom-6 right-16 w-2 h-6 bg-amber-900" />
        
        {/* Laptop */}
        <div className="absolute -top-3 left-5 w-10 h-6 bg-gray-800 rounded-sm">
          <div className="w-10 h-5 bg-blue-400 rounded-t-sm flex items-center justify-center">
            <span className="text-[6px] text-white font-bold">CODE</span>
          </div>
        </div>
      </div>
    </FloatingObject>
  );
};

const Student = ({ x = 0, y = 0, z = 0, color = "blue-600", delay = 0 }: { 
  x: number, 
  y: number, 
  z: number, 
  color?: string,
  delay?: number 
}) => {
  return (
    <FloatingObject
      className="absolute" 
      style={{ transform: iso(x, y-25, z) }}
      delay={delay}
      duration={3 + Math.random()}
    >
      <div className="relative">
        {/* Head */}
        <motion.div 
          className={`w-8 h-8 bg-${color} rounded-full relative`}
          whileHover={{ scale: 1.1 }}
        >
          {/* Eyes */}
          <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full" />
          
          {/* Mouth */}
          <div className="absolute bottom-2 left-[calc(50%-1.5px)] w-3 h-1 bg-white rounded-full" />
        </motion.div>
        
        {/* Body */}
        <div className={`w-10 h-14 bg-${color} -mt-1 rounded-b-lg -ml-1`} />
        
        {/* Arms */}
        <div className={`absolute top-10 -left-4 w-4 h-2 bg-${color} rounded-l-full`} />
        <div className={`absolute top-10 -right-4 w-4 h-2 bg-${color} rounded-r-full`} />
      </div>
    </FloatingObject>
  );
};

const TeacherDesk = ({ x = 0, y = 0, z = 0 }: { x: number, y: number, z: number }) => {
  return (
    <FloatingObject
      className="absolute" 
      style={{ transform: iso(x, y, z) }}
      delay={0.3}
      duration={5}
    >
      <div className="relative">
        {/* Desktop */}
        <div className="w-32 h-14 bg-amber-900 rounded-sm shadow-lg transform-gpu" />
        
        {/* Desktop top */}
        <div className="absolute -top-1 w-32 h-1 bg-amber-800 rounded-t-sm" />
        
        {/* Legs */}
        <div className="absolute -bottom-8 left-2 w-3 h-8 bg-amber-950" />
        <div className="absolute -bottom-8 right-2 w-3 h-8 bg-amber-950" />
        <div className="absolute -bottom-8 left-26 w-3 h-8 bg-amber-950" />
        <div className="absolute -bottom-8 right-26 w-3 h-8 bg-amber-950" />
        
        {/* Computer */}
        <div className="absolute -top-10 left-10 w-12 h-10 bg-gray-800 rounded">
          <div className="w-12 h-8 bg-blue-500 rounded-t flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">CODING</span>
          </div>
        </div>
      </div>
    </FloatingObject>
  );
};

const ClassroomSceneFallback = () => {
  return (
    <div className="h-[60vh] w-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 perspective-[1000px] overflow-hidden">
        {/* Isometric Classroom */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Floor */}
          <motion.div 
            className="w-[500px] h-[300px] bg-gray-200 rounded-lg opacity-70 shadow-inner transform-gpu"
            style={{ 
              transform: "rotateX(60deg) rotateZ(-45deg)",
              transformStyle: "preserve-3d"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1 }}
          />
          
          {/* Walls */}
          <motion.div
            className="absolute top-0 left-[20px] w-[460px] h-[140px] bg-blue-100 opacity-80 transform-gpu"
            style={{ 
              transform: "rotateX(30deg) rotateY(0deg) rotateZ(-45deg) translateZ(150px)",
              transformStyle: "preserve-3d"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* "Whiteboard" */}
            <motion.div
              className="absolute top-[30px] left-[150px] w-[160px] h-[80px] bg-white rounded-sm shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.div
                className="w-full h-full flex flex-col items-center justify-center"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <span className="text-[10px] font-bold text-blue-800">WEB DEV</span>
                <span className="text-[8px] text-blue-600">MARATHON</span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Teacher desk */}
          <TeacherDesk x={0} y={0} z={-10} />
          
          {/* Teacher */}
          <Student x={0} y={30} z={-50} color="purple-600" delay={0.2} />
          
          {/* Student desks in rows */}
          <Desk x={-100} y={0} z={30} delay={0.1} />
          <Desk x={0} y={0} z={60} delay={0.3} />
          <Desk x={100} y={0} z={90} delay={0.5} />
          
          <Desk x={-100} y={0} z={120} delay={0.2} />
          <Desk x={0} y={0} z={150} delay={0.4} />
          <Desk x={100} y={0} z={180} delay={0.6} />
          
          {/* Students at desks */}
          <Student x={-100} y={25} z={50} color="blue-600" delay={0.7} />
          <Student x={0} y={25} z={80} color="red-600" delay={0.9} />
          <Student x={100} y={25} z={110} color="green-600" delay={1.1} />
          
          <Student x={-100} y={25} z={140} color="yellow-600" delay={0.8} />
          <Student x={0} y={25} z={170} color="pink-600" delay={1.0} />
          <Student x={100} y={25} z={200} color="indigo-600" delay={1.2} />
        </div>
      </div>
      
      {/* Main Content Card */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-30">
        <motion.div 
          className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center text-blue-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Web Development Course
          </motion.h2>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="text-xl font-medium text-blue-600">
              <motion.span
                animate={{ 
                  opacity: [1, 0.6, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                Web Development Marathon
              </motion.span>
            </div>
          </motion.div>
          
          <motion.ul 
            className="space-y-3 mx-auto max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <motion.li 
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <motion.div 
                className="w-4 h-4 rounded-full bg-blue-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: 0,
                }}
              />
              <span className="font-medium">Learn Modern Web Development</span>
            </motion.li>
            <motion.li 
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <motion.div 
                className="w-4 h-4 rounded-full bg-blue-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: 0.6,
                }}
              />
              <span className="font-medium">Build Interactive Web Experiences</span>
            </motion.li>
            <motion.li 
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            >
              <motion.div 
                className="w-4 h-4 rounded-full bg-blue-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: 1.2,
                }}
              />
              <span className="font-medium">Deploy Real Projects</span>
            </motion.li>
          </motion.ul>
          
          <motion.div 
            className="flex justify-center pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <motion.button 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enroll Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating coding elements */}
      <FloatingObject 
        className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200 rounded-lg opacity-50 z-40"
        delay={0.2}
        duration={3.5}
      >
        <div className="w-full h-full rounded-lg flex items-center justify-center">
          <div className="text-blue-600 font-bold text-xs">HTML</div>
        </div>
      </FloatingObject>
      
      <FloatingObject 
        className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-50 z-40"
        delay={0.7}
        duration={4.2}
      >
        <div className="w-full h-full rounded-full flex items-center justify-center">
          <div className="text-indigo-600 font-bold text-xs">CSS</div>
        </div>
      </FloatingObject>
      
      <FloatingObject 
        className="absolute top-1/3 right-1/3 w-10 h-10 bg-cyan-200 rounded-lg opacity-50 z-40"
        delay={1.3}
        duration={4.8}
      >
        <div className="w-full h-full rounded-lg flex items-center justify-center">
          <div className="text-cyan-600 font-bold text-xs">JS</div>
        </div>
      </FloatingObject>
      
      <FloatingObject 
        className="absolute bottom-1/3 left-1/3 w-14 h-14 bg-emerald-200 rounded-full opacity-50 z-40"
        delay={0.5}
        duration={5.2}
      >
        <div className="w-full h-full rounded-full flex items-center justify-center">
          <div className="text-emerald-600 font-bold text-xs">React</div>
        </div>
      </FloatingObject>
      
      <FloatingObject 
        className="absolute top-1/2 right-1/4 w-12 h-12 bg-violet-200 rounded-lg opacity-50 z-40"
        delay={1.8}
        duration={3.8}
      >
        <div className="w-full h-full rounded-lg flex items-center justify-center">
          <div className="text-violet-600 font-bold text-xs">Next.js</div>
        </div>
      </FloatingObject>
    </div>
  );
};

export default ClassroomSceneFallback; 