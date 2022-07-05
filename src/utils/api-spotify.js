import axios from "axios";
import { getToken } from "./pkce-spotify";

export async function getCurrentUserProfile() {
  const response = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + (await getToken()),
    },
  });

  return response.data;
}

export async function getUserPlaylists() {
  const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (await getToken()),
    },
  });

  return response.data;
}

export async function searchSongs(query) {
  const { data } = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (await getToken()),
    },
    params: {
      q: query,
      type: "track",
      include_external: "audio",
      limit: 5,
    },
  });

  return data.tracks.items;
}

export async function addSongToPlaylist(songId) {
  await axios.post(
    "https://api.spotify.com/v1/playlists/" + "dafsjkdas" + "/tracks",
    {
      uris: [songId],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (await getToken()),
      },
    }
  );
}
