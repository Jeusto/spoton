async function getCurrentTab() {
  return new Promise((resolve, reject) => {
    let queryOptions = { active: true, lastFocusedWindow: true };

    chrome.tabs.query(queryOptions, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

async function extractTrackInfo(tab) {
  let websiteName = tab.url.replace(/(?!w{1,}\.)(\w+\.?)([a-zA-Z]+)(\.\w+) /);
  let websiteIsSupported = isWebsiteSupported(tab.url);
  let songTitle = sanitizeTitle(tab.title);

  return { websiteName, songTitle, websiteIsSupported };
}

function removeText(str, text, replacementText = "") {
  while (str.indexOf(text) != -1) {
    str = str.replace(text, replacementText);
  }
  return str;
}

function sanitizeTitle(tabTitle) {
  let title = tabTitle.toLowerCase();

  let stringsToRemove = [
    " - youtube music",
    " - youtube",
    "youtube",
    "official music video",
    "official video",
    " | a colors show",
    " ft.",
    " -",
    "lyric video",
    "lyrics video",
    "lyrics",
    "lyric",
    "†",
  ];

  let stringsToReplace = {
    " x ": " ",
  };

  for (let i = 0; i < stringsToRemove.length; i++) {
    title = removeText(title, stringsToRemove[i]);
  }

  for (let str in stringsToReplace) {
    title = removeText(title, str, stringsToReplace[str]);
  }

  // Remove everything between parentheses, brackets etc
  title = title.replace(/\([^)]*\)/g, "");
  title = title.replace(/\{[^}]*\}/g, "");
  title = title.replace(/\[[^]]*\]/g, "");
  title = title.replace(/\|[^|]*\|/g, "");

  return title;
}

function isWebsiteSupported(url) {
  return url.includes("youtube.com") || url.includes("soundcloud.com");
}

export { getCurrentTab, extractTrackInfo };
