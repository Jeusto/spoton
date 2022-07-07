import axios from "axios";
import { getToken } from "./pkce-spotify";
import { getUserPreferences } from "./storage";

async function getCurrentUserProfile() {
  const response = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + (await getToken()),
    },
  });

  return response.data;
}

async function getUserPlaylists(current_username) {
  let playlists = [];
  let currentOffset = 0;

  while (true) {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: "Bearer " + (await getToken()),
        },
        params: {
          limit: 50,
          offset: currentOffset,
        },
      }
    );

    if (response.data.items.length === 0) {
      break;
    }

    response.data.items.forEach((playlist) => {
      console.log(playlist.name);
      if (playlist.owner.display_name === current_username) {
        playlists.push(playlist);
      }
    });
    currentOffset += 50;
  }

  return playlists;
}

async function searchTracks(query) {
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

  let tracks = data.tracks.items.map((track) => {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      url: track.external_urls.spotify,
      image: track.album.images[0].url,
    };
  });

  return tracks;
}

async function addSongToPlaylist(trackId) {
  const userPreferences = await getUserPreferences();
  let playlistId = userPreferences.playlist;

  const response = fetch(
    "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + (await getToken()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: ["spotify:track:" + trackId],
      }),
    }
  );
}

export {
  getCurrentUserProfile,
  getUserPlaylists,
  searchTracks,
  addSongToPlaylist,
};
