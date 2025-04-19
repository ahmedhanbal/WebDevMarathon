"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgGradient?: string;
  index?: number;
  className?: string;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  bgGradient = "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
  index = 0,
  className,
}: FeatureCardProps) => {
  const variants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-6 shadow-md transition-all hover:shadow-xl",
        className
      )}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
      whileHover={{ 
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      {/* Background gradient effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 bg-gradient-to-br transition-opacity duration-300",
        bgGradient,
        "group-hover:opacity-100"
      )} />
      
      {/* Icon wrapper with animation */}
      <motion.div 
        className={cn(
          "relative mb-4 flex h-12 w-12 items-center justify-center rounded-full",
          "bg-primary/10",
          iconColor
        )}
        whileHover={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: 1.1,
          transition: { duration: 0.5, type: "spring" }
        }}
      >
        <Icon size={24} className="transition-transform group-hover:scale-110" />
      </motion.div>
      
      {/* Content */}
      <div className="relative">
        <h3 className="mb-2 text-xl font-bold transition-colors">{title}</h3>
        <p className="text-muted-foreground transition-colors">{description}</p>
        
        {/* Animated underline on hover */}
        <motion.div 
          className="absolute -bottom-2 left-0 h-0.5 w-0 bg-primary"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Corner accent */}
      <div className="absolute -right-4 -top-4 h-16 w-16 rotate-45 bg-primary/5 transition-all group-hover:bg-primary/10" />
    </motion.div>
  );
};

export default FeatureCard; 