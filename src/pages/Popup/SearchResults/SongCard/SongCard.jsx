import React from "react";
import { useState, useRef } from "react";
import {
  PlayerPlay,
  Check,
  PlaylistAdd,
  PlayerPause,
} from "tabler-icons-react";
import {
  Divider,
  Group,
  Text,
  Stack,
  Avatar,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { showNotification, cleanNotifications } from "@mantine/notifications";
import { addSongToPlaylist } from "../../../../utils/api-spotify";

export default function SongCard({
  id,
  title,
  artist,
  url,
  image,
  preview_url,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const audio = useRef(new Audio(preview_url));

  function togglePlay() {
    if (isPlaying) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <>
      <Grid ml="0" columns="11" mb="0" align="center">
        <Grid.Col p="0" span={1}>
          <Avatar size="md" src={image} />
        </Grid.Col>
        <Grid.Col span={7}>
          <Stack
            spacing="0px"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Text size="md">{title}</Text>
            <Text color="gray" size="sm">
              {artist}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Group position="right">
            {preview_url && (
              <ActionIcon
                onClick={() => {
                  togglePlay();
                }}
                color="blue"
                size="md"
                variant="light"
              >
                {isPlaying ? <PlayerPause /> : <PlayerPlay />}
              </ActionIcon>
            )}
            <ActionIcon
              onClick={() => {
                addSongToPlaylist(id);
                cleanNotifications();
                showNotification({
                  autoClose: 1500,
                  title: "The song has been added to your playlist",
                  message: "",
                  color: "green",
                  icon: <Check />,
                });
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
