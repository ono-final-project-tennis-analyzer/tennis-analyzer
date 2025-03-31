import { Card, Title, Text } from "@mantine/core";
import { mockData } from "../../../../../../MockData.ts";
import { getStrokeTypeText } from "@/@types/VideoEvent.ts";
import { EStrokeType } from "@/@types/VideoEvent.ts";
import { getStrokeTypeColor } from "@/@types/VideoEvent";
import { Label, Pie, PieChart, Tooltip } from "recharts";
import { useMemo } from "react";

type StrokeTypesChartCardProps = {
  strokeTypes: { [key: string]: number };
}   

export default function StrokeTypesChartCard({ strokeTypes }: StrokeTypesChartCardProps) {
  const totalStrokes = useMemo(() => {
    return Object.values(strokeTypes).reduce((acc, curr) => acc + curr, 0);
  }, [strokeTypes]);

  const chartData = useMemo(() => {
    if (totalStrokes === 0) {
      return [{
        name: "No data",
        value: 1,
        fill: "#E0E0E0"  // Gray color for empty state
      }];
    }
    
    return Object.entries(strokeTypes).map(([key, value]) => ({
      name: getStrokeTypeText(key as EStrokeType),
      value: value,
      fill: getStrokeTypeColor(key as EStrokeType),
    }));
  }, [strokeTypes, totalStrokes]);

  return (
    <Card style={{ height: "100%" }} shadow="sm" radius="md" withBorder>
      <Title order={4} style={{ textAlign: "center", marginBottom: "1rem" }}>
        {mockData.StrokeTypes.title}
      </Title>
      
      <div style={{ width: "100%", height: "calc(100% - 60px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <PieChart width={500} height={400}>
          <Tooltip />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            strokeWidth={2}
            label={totalStrokes === 0 ? undefined : ({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              percent
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = outerRadius + 35;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              
              return (
                <text
                  x={x}
                  y={y}
                  fill="#333333"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                >
                  {`${value} (${(percent * 100).toFixed(0)}%)`}
                </text>
              );
            }}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        style={{ fontSize: "24px", fontWeight: "bold" }}
                      >
                        {totalStrokes}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        style={{ fontSize: "14px", fill: "#666" }}
                      >
                        {totalStrokes === 0 ? "No Data" : "Total Strokes"}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </div>
    </Card>
  );
}
