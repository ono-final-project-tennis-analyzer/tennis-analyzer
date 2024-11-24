import React from "react";
import { Menu, rem } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import Styles from "./ActionRow.styles.module.css";

const ActionRow: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Menu shadow="md" width={200}>
    <Menu.Target>
      <ActionIcon variant="default" className={Styles.action} size={rem(20)}>
        <IconDotsVertical />
      </ActionIcon>
    </Menu.Target>
    <Menu.Dropdown>{children}</Menu.Dropdown>
  </Menu>
);

export default ActionRow;
