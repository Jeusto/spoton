async function getStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], function (result) {
      resolve(result[key]);
    });
  });
}

async function setStorage(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, function (result) {
      resolve();
    });
  });
}

async function removeStorage(key) {
  new Promise((resolve, reject) => {
    chrome.storage.sync.remove(key, () => {
      resolve();
    });
  });
}

async function resetStorage(key) {
  new Promise((resolve, reject) => {
    chrome.storage.sync.clear(() => {
      resolve();
    });
  });
}

async function getUserPreferences() {
  return new Promise((resolve, reject) => {
    let user_preferences = getStorage("user_preferences");
    if (user_preferences) {
      resolve(user_preferences);
    } else {
      let user_preferences = {
        playlist: "",
        mode: "default",
      };
      setUserPreferences(user_preferences);
      resolve(user_preferences);
    }
  });
}

function setUserPreferences(user_preferences) {
  return setStorage("user_preferences", user_preferences);
}

export {
  getStorage,
  setStorage,
  removeStorage,
  resetStorage,
  getUserPreferences,
  setUserPreferences,
};
