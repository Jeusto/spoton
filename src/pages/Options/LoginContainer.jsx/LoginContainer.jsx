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
} from "@mantine/core";
import { BrandSpotify } from "tabler-icons-react";
import { authentificateUser } from "../../../utils/pkce-spotify";
import { removeStorage } from "../../../utils/storage";
import {
  getCurrentUserProfile,
  getMyPlaylists,
} from "../../../utils/user-service";

export default function LoginContainer() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    getCurrentUserProfile().then((userProfile) => {
      setProfile(userProfile);
    });
    getMyPlaylists().then((playlists) => {
      setPlaylists(playlists);
      console.log(playlists);
    });
  }, []);

  async function loginSpotify() {
    authentificateUser().then(() => {
      getCurrentUserProfile().then((userProfile) => {
        setProfile(userProfile);
      });
    });
  }

  function logoutSpotify() {
    removeStorage("spotify_access_token");
    setProfile(null);
  }

  return (
    <>
      {/* {playlists && (
        <div className="playlists-list">
          {playlists.items.map((playlist) => (
            <div className="playlist" key={playlist.id}>
              <div className="playlist-name">{playlist.name}</div>
              <div className="playlist-tracks"></div>
            </div>
          ))}
        </div>
      )} */}
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
    </>
  );
}
