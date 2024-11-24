import { Grid, GridCol, Group, Stack } from "@mantine/core";
import { Outlet } from "react-router-dom";
import React from "react";
import Styles from "./AuthLayout.module.css";
import AnimatedWrapper from "@/components/AnimatedWrapper";

const AuthLayout = () => {
  return (
    <Grid columns={12} className={Styles.grid}>
      <GridCol span={5}>
        <AnimatedWrapper>
          <Stack className={Styles.children} align="center" justify="center">
            <Outlet />
          </Stack>
        </AnimatedWrapper>
      </GridCol>
      <GridCol span={7}>
        <Group className={Styles.image}>
          <img src="/left.webp" alt="Decoration" />
        </Group>
      </GridCol>
    </Grid>
  );
};

export default AuthLayout;
