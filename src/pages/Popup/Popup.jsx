import React from "react";
import logo from "../../assets/img/logo.svg";
import wrongWebsite from "../../assets/img/wrongWebsite.svg";
import {
  Group,
  Image,
  ActionIcon,
  Divider,
  Center,
  Text,
  Stack,
  Anchor,
  MantineProvider,
} from "@mantine/core";
import { Settings } from "tabler-icons-react";

export default function Popup() {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Group mt="xs" mb="xs" ml="xs" mr="xs" position="apart" align="center">
        <Anchor href="https://spoton.jeusto.com" target="_blank">
          <Image width={130} src={logo} alt="Extension logo" />
        </Anchor>
        <ActionIcon
          onClick={() => {
            chrome.tabs.create({
              url: "chrome-extension://" + chrome.runtime.id + "/options.html",
            });
          }}
        >
          <Settings />
        </ActionIcon>
      </Group>
      <Divider />
      <Center style={{ width: 400, height: 450 }}>
        <Stack spacing="0" p="sm">
          <Center>
            <Image width={300} src={wrongWebsite} alt="Wrong website" />
          </Center>
          <Text mt="md" align="center">
            This website is not compatible with the extension.
          </Text>
          <Text align="center" color="gray">
            Please visit one of the compatible websites and click on the
            extension again.
          </Text>
        </Stack>
      </Center>
    </MantineProvider>
  );
}
