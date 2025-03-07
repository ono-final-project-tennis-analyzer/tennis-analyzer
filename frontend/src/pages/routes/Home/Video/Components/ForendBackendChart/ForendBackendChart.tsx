import { PieChart } from "@mantine/charts";
import { useEffect, useRef, useState } from "react";

export default function ForehandBackendChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 300, height: 300 }); // Default size

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "300px" }}>
      <PieChart
        data={[
          { name: "Forehand", value: 10, color: "red" },
          { name: "Backhand", value: 20, color: "blue" },
        ]}
        w={size.width}
        h={size.height}
        withLabels
        withTooltip
        tooltipDataSource="segment"
        mx="auto"
        
      />
    </div>
  );
}
