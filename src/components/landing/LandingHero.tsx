"use client";

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import Link from "next/link";

const LandingHero = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-8 text-center">
      <motion.h1
        className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-white drop-shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Interactive Learning
        </span>
        <br />
        Reimagined
      </motion.h1>

      <motion.p
        className="max-w-2xl text-xl text-white/80 drop-shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Experience the future of education with AI-transcribed lectures,
        real-time interaction, and an immersive learning environment.
      </motion.p>

      <motion.div
        className="flex gap-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg"
          asChild
        >
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/20 bg-black/20 text-white backdrop-blur-sm hover:bg-black/30 hover:text-white text-lg"
          asChild
        >
          <Link href="/courses">Explore Courses</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default LandingHero;
