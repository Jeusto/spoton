import React from "react";
import logo from "../../assets/img/logo.svg";
import {
  Group,
  Image,
  Divider,
  Center,
  Text,
  Box,
  Stack,
  Anchor,
  Title,
  Container,
  SegmentedControl,
  List,
  MantineProvider,
} from "@mantine/core";
import { Robot, Playlist } from "tabler-icons-react";
import LoginContainer from "./LoginContainer.jsx/LoginContainer";

export default function Options({ title }) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Container size="xs">
        <Stack>
          <Group mt="xs" mb="xs" position="apart" align="center">
            <Title order={2}>🛠️ Settings</Title>
            <Anchor href="https://spoton.jeusto.com" target="_blank">
              <Image width={130} src={logo} alt="Extension logo" />
            </Anchor>
          </Group>
        </Stack>
        <Divider mb="lg" />
        <Title order={4}>Spotify account</Title>
        <Text>
          You need to login and allow this app in Spotify so that Spoton can add
          tracks into your playlists on behalf of you.
        </Text>
        <Text mt="sm" color="gray">
          Note: No personal information about your Spotify account will be
          stored and you can always remove the permission from your Spotify.
        </Text>
        <LoginContainer />
        <Divider mt="lg" variant="dashed"></Divider>
        <Title mt="lg" order={4}>
          Extension behaviour
        </Title>
        <Text>
          Choose how the extension behaves when you click on the icon.
        </Text>
        <SegmentedControl
          fullWidth
          mt="xs"
          orientation="horizontal"
          data={[
            {
              value: "default",
              label: (
                <Center>
                  <Playlist size={16} />
                  <Box ml={10}>Default</Box>
                </Center>
              ),
            },
            {
              value: "autosave",
              label: (
                <Center>
                  <Robot size={16} />
                  <Box ml={10}>Autosave</Box>
                </Center>
              ),
            },
          ]}
        />
        <List mt="xs">
          <List.Item>
            Default: Spoton will show the top results matching the song title
            and you will choose which one to add to a preselected playlist.
          </List.Item>
          <List.Item>
            Autosave: Spoton will try to add the best matching result for the
            track immediately.
          </List.Item>
          <List.Item>
            Advanced: Same as default but you can also choose which playlist to
            add every time.
          </List.Item>
        </List>
        <Divider mt="lg" variant="dashed"></Divider>
        <Title mt="xl" order={4}>
          Theme
        </Title>
        <Divider mt="lg" variant="dashed"></Divider>
        <Title mt="xl" order={4}>
          Feedback
        </Title>
        <Divider mt="lg" variant="dashed"></Divider>
        <Title mt="xl" order={4}>
          Donation
        </Title>
      </Container>
    </MantineProvider>
  );
}
