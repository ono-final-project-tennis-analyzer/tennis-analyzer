import { AppShell, Burger, Group, Text, Avatar, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, useNavigate } from "react-router-dom";
import { useLogoutMutation, useMeQuery } from "@/services/accounts.service.ts";
import React from "react";
import Navigation from "../Navigation";
import { IconBallTennis } from "@tabler/icons-react";
import Styles from "./DashboardLayoutRoot.module.css";
import UserMenu from "@/components/UserMenu";

export default function DashboardLayoutRoot() {
  const [opened, { toggle }] = useDisclosure();


  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
      style={{ overflow: "hidden" }}
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Group>
            <IconBallTennis style={{ fill: "#ffff30" }} />
            <Text>Tennis Tracker AI</Text>
          </Group>
          <UserMenu/>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation />
      </AppShell.Navbar>
      <AppShell.Main style={{ overflow: "auto" }} className={Styles.children}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
