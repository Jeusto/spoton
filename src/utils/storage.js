const getStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};

const setStorage = async (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, function (result) {
      resolve();
    });
  });
};

const removeStorage = (key) => {
  new Promise((resolve) => {
    chrome.storage.sync.remove(key, () => {
      resolve();
    });
  });
};

export { getStorage, setStorage, removeStorage };
