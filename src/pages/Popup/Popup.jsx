import React from "react";
import { useEffect, useState } from "react";
import logo from "../../assets/img/logo.svg";
import wrongWebsite from "../../assets/img/wrongWebsite.svg";
import {
  Title,
  Group,
  Image,
  ActionIcon,
  Divider,
  Center,
  Text,
  Stack,
  Anchor,
  MantineProvider,
  TextInput,
  Loader,
} from "@mantine/core";
import { Settings } from "tabler-icons-react";
import axios from "axios";
import { searchSongs } from "../../utils/api-spotify";
import SongCard from "./SongCard/SongCard";

export default function Popup() {
  const [current, setCurrent] = useState({});
  const [loading, setIsLoading] = useState(true);

  const [correspondingSongs, setCorrespondingSongs] = useState([]);

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    return new Promise((resolve, reject) => {
      chrome.tabs.query(queryOptions, (tabs) => {
        resolve(tabs[0]);
      });
    });
  }

  function removeText(str, text, replacementText = "") {
    while (str.indexOf(text) != -1) {
      str = str.replace(text, replacementText);
    }
    return str;
  }

  function sanitizeTitle(tabTitle) {
    let title = tabTitle.toLowerCase();

    let stringsToRemove = [
      " - youtube music",
      " - youtube",
      "youtube",
      "official music video",
      "official video",
      " | a colors show",
      " ft.",
      " -",
      "lyric video",
      "lyrics video",
      "lyrics",
      "lyric",
      "†",
    ];

    let stringsToReplace = {
      " x ": " ",
    };

    for (let i = 0; i < stringsToRemove.length; i++) {
      title = removeText(title, stringsToRemove[i]);
    }

    for (let str in stringsToReplace) {
      title = removeText(title, str, stringsToReplace[str]);
    }

    // Remove everything between parentheses, brackets etc
    title = title.replace(/\([^)]*\)/g, "");
    title = title.replace(/\{[^}]*\}/g, "");
    title = title.replace(/\[[^]]*\]/g, "");
    title = title.replace(/\|[^|]*\|/g, "");

    return title;
  }

  function isWebsiteSupported(url) {
    return url.includes("youtube.com") || url.includes("soundcloud.com");
  }

  useEffect(() => {
    async function getData() {
      let tab = await getCurrentTab();
      let websiteName = tab.url.replace(
        /(?!w{1,}\.)(\w+\.?)([a-zA-Z]+)(\.\w+) /
      );
      let websiteIsSupported = isWebsiteSupported(tab.url);
      let songTitle = sanitizeTitle(tab.title);
      // let websiteName = "youtube.com";
      // let songTitle = "eminem";
      // let websiteIsSupported = true;

      setCurrent({ songTitle, websiteName, websiteIsSupported });

      if (websiteIsSupported) {
        await getCorrespondingSongs(songTitle);
        setIsLoading(false);
      }
    }

    getData();
  }, []);

  async function getCorrespondingSongs(songTitle) {
    let songs = await searchSongs(songTitle);

    setCorrespondingSongs(
      songs.map((song) => {
        return {
          id: song.id,
          title: song.name,
          artist: song.artists[0].name,
          url: song.external_urls.spotify,
          image: song.album.images[0].url,
        };
      })
    );
  }

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
      {loading ? (
        <Center style={{ width: 400, height: 450 }}>
          <Loader color="green" variant="bars" />
        </Center>
      ) : (
        <Stack spacing="0" p="sm">
          {current &&
          correspondingSongs.length > 0 &&
          current.websiteIsSupported ? (
            <>
              <Title order={3} mt="xs">
                Track found :
              </Title>
              <Text>{current.songTitle}</Text>
              <Title order={3} mt="lg">
                Corresponding songs :
              </Title>
              <Stack mt="sm" spacing="0" p="0">
                {correspondingSongs.map((song) => (
                  <SongCard key={song.id} {...song} />
                ))}
              </Stack>
            </>
          ) : (
            <Center style={{ width: 400, height: 450 }}>
              <Stack spacing="0" p="sm">
                <Center>
                  <Image width={300} src={wrongWebsite} alt="Wrong website" />
                </Center>
                <Text mt="md" align="center">
                  {!current.websiteIsSupported
                    ? "This website is currently not supported."
                    : "No song found"}
                </Text>
              </Stack>
            </Center>
          )}
        </Stack>
      )}
    </MantineProvider>
  );
}
