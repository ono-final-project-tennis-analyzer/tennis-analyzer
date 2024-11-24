import React from "react";
import { Group, Paper, rem, Text } from "@mantine/core";
import { IconBallTennis } from "@tabler/icons-react";

interface AuthWrapperProps extends React.PropsWithChildren {
  title: React.ReactNode;
}

export default function AuthWrapper({ title, children }: AuthWrapperProps) {
  return (
    <Paper radius="md" p="xl" withBorder>
      <Group justify="center" align="center">
        <IconBallTennis
          style={{ width: rem(100), height: rem(100), fill: "#ffff30" }}
        />
      </Group>
      <Text size="lg" w={500} mb="md">
        {title}
      </Text>
      {children}
    </Paper>
  );
}
