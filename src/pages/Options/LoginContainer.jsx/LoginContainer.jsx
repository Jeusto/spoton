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

 }

  return (
    <>
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
