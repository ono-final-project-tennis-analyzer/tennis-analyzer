import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimateNumber = ({ score }: { score: number }) => {
  const [displayedScore, setDisplayedScore] = useState(score);
  const [rollingNumbers, setRollingNumbers] = useState<number[]>([]);

  useEffect(() => {
    const newNumbers = [];
    const min = Math.min(displayedScore, score);
    const max = Math.max(displayedScore, score);

    for (let i = min; i <= max; i++) {
      newNumbers.push(i);
    }

    if (score < displayedScore) newNumbers.reverse();

    setRollingNumbers(newNumbers);
  }, [score]);

  useEffect(() => {
    if (rollingNumbers.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedScore(rollingNumbers[index]);
        index++;
        if (index >= rollingNumbers.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [rollingNumbers]);

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        height: "50px", // Ensures visibility
        width: "50px",
        fontSize: "32px",
        fontWeight: "bold",
        color: "black",
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={displayedScore}
          initial={{ y: "0%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1, scaleY: 1.0 }}
          exit={{ y: "-80%", opacity: 0, scaleY: 0.0}} 
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {displayedScore}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimateNumber;
