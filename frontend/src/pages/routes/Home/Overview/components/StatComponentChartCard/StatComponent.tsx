    import { Card, Center, Group, Paper, RingProgress, Text  } from "@mantine/core";


export interface StatComponentProps {
  title: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
  percentage: number;
}

export default function StatComponent({ title, value, color, icon , percentage }: StatComponentProps) {
  return (
    <Paper shadow="sm" withBorder radius="md" p="xs" key={title}>
    <Group>
      <RingProgress
        size={100}
        roundCaps
        thickness={8}
        sections={[{ value: percentage, color: color }]}
        label={
          <Center>
            {icon}
          </Center>
        }
      />

      <div>
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
          {title}
        </Text>
        <Text fw={700} size="xl">
          {value}
        </Text>
      </div>
    </Group>
  </Paper>
  );
}
