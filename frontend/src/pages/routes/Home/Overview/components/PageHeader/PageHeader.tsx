import React from "react";
import { Title, Text, Stack } from "@mantine/core";
import en from "../../../../../../../lang/en.json";

const PageHeader = () => (
  <Stack>
    <Title>{en.Home.title}</Title>
    <Text>{en.Home.subtitle}</Text>
  </Stack>
);

export default PageHeader;
