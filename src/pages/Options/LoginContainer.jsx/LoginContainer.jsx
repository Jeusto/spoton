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

export default function LoginContainer() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get(["token"], function (data) {
      if (data.token) {
        setToken(data.token);
      }
    });
  }, []);

  const CLIENT_ID = encodeURIComponent("8d775048dcbf4317a6519c177794c7a6");
  const RESPONSE_TYPE = encodeURIComponent("token");
  const REDIRECT_URI = chrome.identity.getRedirectURL("");
  const SCOPE = encodeURIComponent("user-read-email");
  const SHOW_DIALOG = encodeURIComponent("true");
  let state = "";
  let access_token = "";

  function create_spotify_endpoint() {
    state = encodeURIComponent(
      "csh" + (Math.random() * 998999999 + 1000000).toString().substring(3, 9)
    );
    state += encodeURIComponent(
      "ff" + Math.random().toString(36).substring(2, 16)
    );
    let oauth2_url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${SCOPE}&show_dialog=${SHOW_DIALOG}`;

    return oauth2_url;
  }

  function loginSpotify() {
    chrome.identity.launchWebAuthFlow(
      {
        url: create_spotify_endpoint(),
        interactive: true,
      },
      function (redirect_url) {
        if (chrome.runtime.lastError) {
          //
        } else {
          if (redirect_url.includes("callback?error=access_denied")) {
            //
          } else {
            access_token = redirect_url.substring(
              redirect_url.indexOf("access_token=") + 13
            );
            access_token = access_token.substring(0, access_token.indexOf("&"));
            let new_state = redirect_url.substring(
              redirect_url.indexOf("state=") + 6
            );

            if (new_state === state) {
              setToken(access_token);
              chrome.storage.sync.set({ token: access_token }, function () {});

              // setTimeout(() => {
              //   access_token = "";
              // }, 3600000);
            }
          }
        }
      }
    );
  }

  function logoutSpotify() {
    setToken(null);
    chrome.storage.sync.remove("token");
  }

  return (
    <>
      <Text>{token}</Text>
      {!token && (
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
      {token && (
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
              backgroundColor: theme.colors.gray[0],
            })}
          >
            <Group>
              <Avatar
                size="lg"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
              />
              <Stack spacing="5">
                <Text>Arhun Saday</Text>

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
