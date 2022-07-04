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

export async function getMyPlaylists() {
  const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (await getToken()),
    },
  });

  return response.data;
}
