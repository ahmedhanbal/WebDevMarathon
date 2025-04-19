"use client";

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";

const LandingHero = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container flex flex-col items-center justify-center gap-8 text-center px-4 max-w-5xl">
      {/* Decorative elements - keep these relative to the container */}
      <motion.div 
        className="absolute top-1/4 left-[10%] h-16 w-16 opacity-20 md:opacity-30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1, rotate: 10 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Sparkles className="h-full w-full text-blue-300" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 right-[10%] h-16 w-16 opacity-20 md:opacity-30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1, rotate: -10 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <BookOpen className="h-full w-full text-purple-300" />
      </motion.div>
      
      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="backdrop-blur-sm p-6 rounded-2xl bg-black/10"
      >
        <motion.h1
          className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-white drop-shadow-lg"
          variants={itemVariants}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Interactive Learning
            </span>
            <motion.div 
              className="absolute -bottom-2 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
          </motion.div>
          <br />
          <motion.span
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Reimagined
          </motion.span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-xl text-white drop-shadow-md"
          variants={itemVariants}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Experience the future of education with AI-transcribed lectures,
          real-time interaction, and an immersive learning environment.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
          variants={itemVariants}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg shadow-lg shadow-blue-600/20 w-full sm:w-auto border-0"
              asChild
            >
              <Link href="/signup" className="flex items-center gap-2">
                Get Started
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white text-lg shadow-lg shadow-purple-900/20 w-full sm:w-auto"
              asChild
            >
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
        
      {/* Stats row */}
      <motion.div 
        className="mt-8 flex flex-wrap justify-center gap-8 text-white backdrop-blur-sm py-4 px-8 rounded-xl bg-black/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="flex flex-col items-center">
          <motion.div 
            className="text-3xl font-bold"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          >
            500+
          </motion.div>
          <div className="text-sm text-white/80">Courses</div>
        </div>
        
        <div className="flex flex-col items-center">
          <motion.div 
            className="text-3xl font-bold"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
          >
            10k+
          </motion.div>
          <div className="text-sm text-white/80">Students</div>
        </div>
        
        <div className="flex flex-col items-center">
          <motion.div 
            className="text-3xl font-bold"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
          >
            250+
          </motion.div>
          <div className="text-sm text-white/80">Tutors</div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingHero;
