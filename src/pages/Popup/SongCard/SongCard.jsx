import React from "react";
import { useEffect, useState } from "react";
import { PlayerPlay, PlaylistAdd } from "tabler-icons-react";
import {
  Group,
  Text,
  Stack,
  Container,
  Paper,
  Avatar,
  Button,
  ActionIcon,
  UnstyledButton,
  Select,
  Grid,
} from "@mantine/core";
import { addSongToPlaylist } from "../../../utils/api-spotify";

export default function SongCard({ id, title, artist, url, image }) {
  return (
    <>
      <Grid ml="0" columns="11" mb="xs" align="center">
        <Grid.Col p="0" span={1}>
          <Avatar size="md" src={image} />
        </Grid.Col>
        <Grid.Col span={7}>
          <Stack spacing="0px">
            <Text size="md">{title}</Text>
            <Text color="gray" size="sm">
              {artist}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Group position="right">
            <ActionIcon
              onClick={() => {
                addSongToPlaylist(id);
              }}
              color="blue"
              size="md"
              variant="light"
            >
              <PlayerPlay />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                addSongToPlaylist(id);
              }}
              color="green"
              size="md"
              variant="light"
            >
              <PlaylistAdd />
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );
}
