console.log("This is the background page.");

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason == "install") {
    console.log("This is the first install of the extension.");
    openTab(`chrome-extension://${chrome.runtime.id}/options.html`);
  } else if (details.reason == "update") {
    console.log("This is an update of the extension.");
  }
});

const openTab = (url) => {
  chrome.tabs.create({
    url,
  });
};
