"use client";
import { motion, MotionProps, AnimatePresence } from "framer-motion";
import React from "react";

interface Props extends MotionProps {}

const AnimatedWrapper: React.FC<Props> = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      {...props}
    />
  );
};

export default AnimatedWrapper;
