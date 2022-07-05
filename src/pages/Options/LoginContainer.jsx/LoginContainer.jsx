import React from "react";
import { useEffect, useState } from "react";
import {
  Group,
  Text,
  Stack,
  Container,
  Paper,
  Avatar,
  Button,
  UnstyledButton,
  Select,
} from "@mantine/core";
import { BrandSpotify } from "tabler-icons-react";
import { authentificateUser } from "../../../utils/pkce-spotify";
import { removeStorage } from "../../../utils/storage";
import {
  getCurrentUserProfile,
  getUserPlaylists,
} from "../../../utils/api-spotify";

export default function LoginContainer() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    async function getData() {
      const profile = await getCurrentUserProfile();
      const playlists = await getUserPlaylists(profile.display_name);
      setProfile(profile);
      setPlaylists(playlists);
    }

    getData();
  }, []);

  async function loginSpotify() {
    await authentificateUser();
    let profile = await getCurrentUserProfile();
    let playlists = await getUserPlaylists();
    setProfile(profile);
    setPlaylists(playlists);
  }

  function logoutSpotify() {
    removeStorage("spotify_access_token");
    setProfile(null);
  }

  return (
    <>
      {!profile && (
        <Button
          onClick={() => loginSpotify()}
          mt="sm"
          leftIcon={<BrandSpotify />}
          color="green"
          size="md"
        >
          Login with Spotify
        </Button>
      )}
      {profile && (
        <Container
          mt="sm"
          size="20rem"
          sx={{ marginLeft: "0", paddingLeft: "0" }}
        >
          <Paper
            mt="sm"
            shadow="xs"
            p="md"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[8],
            })}
          >
            <Group>
              <Avatar size="lg" src={profile.images[0].url} />
              <Stack spacing="5">
                <Text>{profile.display_name}</Text>

                <UnstyledButton onClick={() => logoutSpotify()}>
                  <Text color="gray">Not you? Change user</Text>
                </UnstyledButton>
              </Stack>
            </Group>
          </Paper>
        </Container>
      )}
      {playlists && (
        <Container
          mt="sm"
          size="20rem"
          sx={{ marginLeft: "0", paddingLeft: "0" }}
        >
          <Select
            label="Choose which playlist to add the songs to"
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            data={playlists.map((playlist) => ({
              value: playlist.id,
              label: playlist.name,
            }))}
          />
        </Container>
      )}
    </>
  );
}
