import React from "react";
import { Group, rem, Text } from "@mantine/core";
import { IconProps } from "@tabler/icons-react";

interface Props {
  text: React.ReactNode;
  LeftIcon?: React.FC<IconProps>;
  RightIcon?: React.FC<IconProps>;
  size?: number;
}

const PaginationNavigationButton: React.FC<Props> = ({
  LeftIcon,
  RightIcon,
  text,
  size = 16,
}) => (
  <Group gap="xs" p="sm">
    {LeftIcon ? (
      <LeftIcon style={{ width: rem(size), height: rem(size) }} />
    ) : null}
    <Text>{text}</Text>
    {RightIcon ? (
      <RightIcon style={{ width: rem(size), height: rem(size) }} />
    ) : null}
  </Group>
);

export default PaginationNavigationButton;
