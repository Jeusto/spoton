import React from "react";
import { useEffect, useState } from "react";
import {
  Title,
  Divider,
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
import { removeStorage, resetStorage } from "../../../utils/storage";
import {
  getCurrentUserProfile,
  getUserPlaylists,
} from "../../../utils/api-spotify";
import { setUserPreferences, getUserPreferences } from "../../../utils/storage";

export default function LoginContainer() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    async function getData() {
      const profile = await getCurrentUserProfile();
      const playlists = await getUserPlaylists(profile.display_name);
      const preferences = await getUserPreferences();

      setProfile(profile);
      setPlaylists(playlists);
      setPreferences(preferences);
      setSelectValue(preferences.playlist);
    }

    getData();
  }, []);

  const [selectValue, setSelectValue] = useState("");

  useEffect(() => {
    if (selectValue) {
      setPreferences({ ...preferences, playlist: selectValue });
      setUserPreferences({ ...preferences, playlist: selectValue });
    }
  }, [selectValue]);

  async function loginSpotify() {
    await authentificateUser();
    let profile = await getCurrentUserProfile();
    let playlists = await getUserPlaylists();
    let userPreferences = await getUserPreferences();

    setProfile(profile);
    setPlaylists(playlists);
    setPreferences(userPreferences);
  }

  async function logoutSpotify() {
    removeStorage("spotify_access_token");
    setProfile(null);
    setPlaylists(null);
    setPreferences({});

    resetStorage();
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
              backgroundColor: theme.colors.dark[5],
            })}
          >
            <Group>
              <Avatar size="lg" src={profile.images[0].url} />
              <Stack spacing="5">
                <Text>{profile.display_name}</Text>

                <UnstyledButton onClick={() => logoutSpotify()}>
                  <Text
                    color="gray"
                    sx={{
                      textDecoration: "underline",
                    }}
                  >
                    Not you? Change user
                  </Text>
                </UnstyledButton>
              </Stack>
            </Group>
          </Paper>
        </Container>
      )}
      <Divider mt="lg" variant="dashed"></Divider>
      <Title mt="lg" order={4}>
        Default playlist
      </Title>
      <Text>
        Choose which playlist tracks should be added to. By default, it will be
        added in a newly created playlist called "Spoton".
      </Text>
      {playlists && (
        <Container
          mt="sm"
          size="20rem"
          sx={{ marginLeft: "0", paddingLeft: "0" }}
        >
          <Select
            placeholder="Pick one"
            searchable
            nothingFound="No options"
            value={selectValue}
            onChange={setSelectValue}
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
