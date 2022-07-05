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

const removeStorage = (key) => {
  new Promise((resolve, reject) => {
    chrome.storage.sync.remove(key, () => {
      resolve();
    });
  });
};

export { getStorage, setStorage, removeStorage };
