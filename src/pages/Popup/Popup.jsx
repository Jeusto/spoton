import React from "react";
import { NotificationsProvider } from "@mantine/notifications";
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
  Loader,
} from "@mantine/core";
import { Settings } from "tabler-icons-react";
import { searchTracks } from "../../utils/api-spotify";
import SearchResults from "./SearchResults/SearchResults";
import { getCurrentTab, extractTrackInfo } from "../../utils/track-info";

export default function Popup() {
  const [currentTrack, setCurrentTrack] = useState({});
  const [loading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      let currentTab = await getCurrentTab();
      let trackInfo = await extractTrackInfo(currentTab);

      setCurrentTrack(trackInfo);

      if (trackInfo.websiteIsSupported) {
        let tracks = await searchTracks(trackInfo.songTitle);

        setTracks(tracks);
      }
      setIsLoading(false);
    }

    getData();
  }, []);

  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider position="top-left" limit={2}>
        <Group mt="xs" mb="xs" ml="xs" mr="xs" position="apart" align="center">
          <Anchor href="https://spoton.jeusto.com" target="_blank">
            <Image width={130} src={logo} alt="Extension logo" />
          </Anchor>
          <ActionIcon
            onClick={() => {
              chrome.tabs.create({
                url:
                  "chrome-extension://" + chrome.runtime.id + "/options.html",
              });
            }}
          >
            <Settings />
          </ActionIcon>
        </Group>
        <Divider style={{ maxWidth: "95%", margin: "0 auto" }} />
        <SearchResults
          loading={loading}
          currentTrack={currentTrack}
          tracks={tracks}
        />
      </NotificationsProvider>
    </MantineProvider>
  );
}
