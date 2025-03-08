import { useMemo } from "react";

export function useTimescaleSliderMarks(duration: number) {
  const step = 1; // use a step of 1 second

  // Generate marks every 10% of the video duration
  const marks = useMemo(() => {
    if (!duration || duration <= 0) return [];
    const count = 10; // 10 intervals -> 11 marks
    const marksArray = [];
    for (let i = 0; i <= count; i++) {
      const value = Math.round((duration * i) / count);
      marksArray.push({
        value,
        label: formatTime(value),
      });
    }
    return marksArray;
  }, [duration]);

  return { marks, step };
}

export function formatTime(seconds: number): string {
  const sec = Math.floor(seconds % 60);
  const min = Math.floor((seconds / 60) % 60);
  const hr = Math.floor(seconds / 3600);
  if (hr > 0) {
    return `${hr}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
