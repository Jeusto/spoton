import React from "react";
import wrongWebsite from "../../../assets/img/wrongWebsite.svg";
import {
  Title,
  Image,
  Center,
  Text,
  Stack,
  Loader,
  Divider,
} from "@mantine/core";
import SongCard from "./SongCard/SongCard";

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
                <Title order={3}>Track found :</Title>
                <Text>{currentTrack.songTitle}</Text>
                <Title order={3} mt="md">
                  Corresponding songs :
                </Title>
                <Stack spacing="0" p="0">
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
                      : "No track found for this title."}
                  </Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </>
      )}
    </>
  );
}
