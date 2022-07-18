import pkceChallenge from "pkce-challenge";
import querystring from "querystring";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { getStorage, setStorage } from "../utils/storage";

const STATE_KEY = "spotify_auth_state";
const CODE_VERIFIER_KEY = "spotify_code_verifier";
const ACCESS_TOKEN_KEY = "spotify_access_token";
const ACCESS_TOKEN_EXPIRES_KEY = "spotify_access_token_expires_at";
const ACCESS_TOKEN_REFRESH_KEY = "spotify_access_token_refresh";

const CLIENT_ID = "8d775048dcbf4317a6519c177794c7a6";
const REDIRECT_URI = chrome.identity.getRedirectURL("");
const CODE_CHALLENGE_METHOD = "S256";
const SCOPE =
  "user-read-private playlist-read-private playlist-modify-private playlist-modify-public user-library-read user-library-modify";

async function authentificateUser() {
  let authorization_uri = await createAuthorizationURI();
  let authorization_code = await getAuthorizationCode(authorization_uri);
  await createAndSaveAccessToken(authorization_code);
}

async function createAuthorizationURI() {
  const { code_challenge, code_verifier } = pkceChallenge();
  const state = uuid();
  await setStorage(STATE_KEY, state);
  await setStorage(CODE_VERIFIER_KEY, code_verifier);

  return (
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      code_challenge_method: CODE_CHALLENGE_METHOD,
      code_challenge,
      scope: SCOPE,
      state: state,
    })
  );
}

async function getAuthorizationCode(authorization_uri) {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: authorization_uri,
        interactive: true,
      },
      async function (redirect_url) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        if (redirect_url.includes("callback?error=access_denied")) {
          reject("access_denied");
        }

        resolve(redirect_url.split("code=")[1].split("&")[0]);
      }
    );
  });
}

async function createAndSaveAccessToken(authorization_code) {
  return new Promise((resolve, reject) => {
    getStorage(CODE_VERIFIER_KEY).then((code_verifier) => {
      axios
        .post(
          "https://accounts.spotify.com/api/token",
          querystring.stringify({
            grant_type: "authorization_code",
            code: authorization_code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            code_verifier: code_verifier,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
        )
        .catch((err) => {
          reject(err);
        })
        .then((res) => {
          let expires_at = new Date().getTime() + res.data.expires_in * 1000;

          setStorage(ACCESS_TOKEN_KEY, res.data.access_token);
          setStorage(ACCESS_TOKEN_EXPIRES_KEY, expires_at);
          setStorage(ACCESS_TOKEN_REFRESH_KEY, res.data.refresh_token);

          resolve();
        });
    });
  });
}

async function refreshAndSaveToken() {
  return new Promise((resolve, reject) => {
    getStorage(ACCESS_TOKEN_REFRESH_KEY).then((refresh_token) => {
      axios
        .post(
          "https://accounts.spotify.com/api/token",
          querystring.stringify({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
            client_id: CLIENT_ID,
          })
        )
        .catch((err) => {
          reject(err);
        })
        .then((res) => {
          let expires_at = new Date().getTime() + res.data.expires_in * 1000;

          setStorage(ACCESS_TOKEN_KEY, res.data.access_token);
          setStorage(ACCESS_TOKEN_EXPIRES_KEY, expires_at);
          setStorage(ACCESS_TOKEN_REFRESH_KEY, res.data.refresh_token);

          resolve();
        });
    });
  });
}

async function getToken() {
  let expires_at = await getStorage(ACCESS_TOKEN_EXPIRES_KEY);
  if (new Date().getTime() > expires_at) {
    await refreshAndSaveToken();
    console.log(new Date().getTime(), expires_at);
  }

  return new Promise((resolve, reject) => {
    let access_token = getStorage(ACCESS_TOKEN_KEY);
    let expires_at = getStorage(ACCESS_TOKEN_EXPIRES_KEY);

    if (!access_token || !expires_at) {
      reject();
    }

    if (access_token) {
      resolve(access_token);
    } else {
      reject();
    }
  });
}

export { authentificateUser, getToken };
