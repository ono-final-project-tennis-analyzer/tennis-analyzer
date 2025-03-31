import { Card, Title } from "@mantine/core";
import { mockData } from "../../../../../../MockData.ts";
import { Label, Pie, PieChart, Tooltip } from "recharts";
import { useMemo } from "react";

export default function MatchOutcomeChartCard() {
  const totalMatches = useMemo(() => {
    return mockData.MatchOutcome.data.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  const chartData = useMemo(() => {
    if (totalMatches === 0) {
      return [{
        name: "No data",
        value: 1,
        fill: "#E0E0E0"  // Gray color for empty state
      }];
    }
    
    return mockData.MatchOutcome.data.map(item => ({
      name: item.name,
      value: item.value,
      fill: item.color,
    }));
  }, [totalMatches]);

  return (
    <Card style={{ height: "100%" }} shadow="sm" radius="md" withBorder>
      <Title order={4} style={{ textAlign: "center", marginBottom: "1rem" }}>
        {mockData.MatchOutcome.title}
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
            label={totalMatches === 0 ? undefined : ({
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
                        {totalMatches}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        style={{ fontSize: "14px", fill: "#666" }}
                      >
                        {totalMatches === 0 ? "No Data" : "Total Matches"}
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
