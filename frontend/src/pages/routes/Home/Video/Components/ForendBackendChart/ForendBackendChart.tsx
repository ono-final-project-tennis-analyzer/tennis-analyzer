import { PieChart } from "@mantine/charts";
import { useEffect, useRef, useState } from "react";
import { VideoEvent, EStrokeType, getStrokeTypeText, getStrokeTypeColor } from "@/@types/VideoEvent";

interface ForendBackendChartProps {
  videoEvents: VideoEvent[];
}

export default function ForendBackendChart({ videoEvents }: ForendBackendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 300, height: 300 }); // Default size

  const hitEvents = videoEvents.filter((event: VideoEvent) => Object.values(EStrokeType).includes(event.event_type as EStrokeType));

  const hitEventsByStrokeType = hitEvents.reduce((acc: Record<EStrokeType, number>, event: VideoEvent) => {
    acc[event.event_type as EStrokeType] = (acc[event.event_type as EStrokeType] || 0) + 1;
    return acc;
  }, Object.values(EStrokeType).reduce((acc, type) => ({ ...acc, [type]: 0 }), {} as Record<EStrokeType, number>));

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
        data={Object.entries(hitEventsByStrokeType).map(([strokeType, count]) => ({     
          name: getStrokeTypeText(strokeType as EStrokeType),
          value: count,
          color: getStrokeTypeColor(strokeType as EStrokeType),
        }))}
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
