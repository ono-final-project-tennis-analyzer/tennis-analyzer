import React, { useEffect, useState } from "react";
import {Card, Slider, Stack} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  useTimescaleSliderMarks,
  formatTime,
} from "./hooks/useTimescaleSliderMarks.ts";
import styles from "./TimescaleSlider.module.css";
import { useVideoContext } from "@/pages/routes/Home/Video/context";

const TimescaleSlider: React.FC = () => {
  const { state, seekVideo } = useVideoContext();
  const { currentTime, duration } = state;

  const { marks, step } = useTimescaleSliderMarks(duration);

  // Local state to track the slider value and dragging flag
  const [sliderValue, setSliderValue] = useState(currentTime);
  const [dragging, setDragging] = useState(false);

  // Debounce slider value changes to limit seek events
  const [debouncedSliderValue] = useDebouncedValue(sliderValue, 300);

  useEffect(() => {
    seekVideo(debouncedSliderValue);
  }, [debouncedSliderValue, seekVideo]);

  // Sync slider value with video time when not dragging
  useEffect(() => {
    if (!dragging) {
      setSliderValue(currentTime);
    }
  }, [currentTime, dragging]);

  console.log({marks,step, duration })

  return (
    <Stack className={styles.sliderCard}>
      <Slider
        value={sliderValue}
        min={0}
        max={duration > 0 ? duration : 100} // Fallback max until duration is known
        onChange={(val) => {
          setDragging(true);
          setSliderValue(val);
        }}
        onChangeEnd={(val) => {
          setDragging(false);
          seekVideo(val);
        }}
        marks={marks}
        step={step}
        size="xl"
        color="green"
        label={(val) => formatTime(val)}
        classNames={{
          root: styles.sliderRoot,
          track: styles.sliderTrack,
          thumb: styles.sliderThumb,
          mark: styles.sliderMark,
          markLabel: styles.sliderMarkLabel,
        }}
      />
    </Stack>
  );
};

export default TimescaleSlider;
