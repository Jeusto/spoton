import React from "react";
import { useEffect, useState } from "react";
import logo from "../../../assets/img/logo.svg";
import wrongWebsite from "../../../assets/img/wrongWebsite.svg";
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
import { searchSongs as searchTracks } from "../../../utils/api-spotify";
import SongCard from "./SongCard/SongCard";
import { getCurrentTab, extractTrackInfo } from "../../../utils/track-info";

export default function SearchResults({ loading, currentTrack, tracks }) {
  return (
    <>
      {loading && (
        <Center style={{ width: 400, height: 450 }}>
          <Loader color="green" variant="bars" />
        </Center>
      )}
      {!loading && (
        <>
          <Stack spacing="0" p="sm">
            {currentTrack &&
            tracks.length > 0 &&
            currentTrack.websiteIsSupported ? (
              <>
                <Title order={3} mt="xs">
                  Track found :
                </Title>
                <Text>{currentTrack.songTitle}</Text>
                <Title order={3} mt="lg">
                  Corresponding songs :
                </Title>
                <Stack mt="sm" spacing="0" p="0">
                  {tracks.map((song) => (
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
                    {!currentTrack.websiteIsSupported
                      ? "This website is currently not supported."
                      : "No song found"}
                  </Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </>
      )}
    </>

    // {loading ? (
    //   <Center style={{ width: 400, height: 450 }}>
    //     <Loader color="green" variant="bars" />
    //   </Center>
    // ) : (
    //   <SearchResults />
    // )}
  );
}
