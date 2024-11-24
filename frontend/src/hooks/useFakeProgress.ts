import { useEffect, useRef, useState } from "react";

type UseFakeProgressOptions = {
  minSpeed?: number;
  maxSpeed?: number;
  resetOnClose?: boolean;
};

const useFakeProgress = (
  isActive: boolean,
  {
    minSpeed = 5,
    maxSpeed = 20,
    resetOnClose = true,
  }: UseFakeProgressOptions = {},
) => {
  const timer = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      const progressSpeed =
        Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;

      timer.current = window.setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + progressSpeed;
          if (newProgress >= 100) {
            if (timer.current !== null) window.clearInterval(timer.current);
            return 100; // Cap progress at 100
          }
          return newProgress;
        });
      }, 500);
    }

    // Cleanup and optionally reset progress when the effect is inactive
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
      if (resetOnClose) setProgress(0); // Reset progress if specified
    };
  }, [isActive, minSpeed, maxSpeed, resetOnClose]);

  return progress;
};

export default useFakeProgress;
