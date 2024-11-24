// src/components/TipsCard.tsx
import { Card, Title, Text, List } from "@mantine/core";
import { mockData } from "../../../../../../MockData.ts";

export default function TipsCard() {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Title order={4}>{mockData.Tips.title}</Title>
      <Text>{mockData.Tips.description}</Text>
      <List>
        {mockData.Tips.data.map((tip, index) => (
          <List.Item key={index}>{tip}</List.Item>
        ))}
      </List>
    </Card>
  );
}
