// copied from pwltr/tauthy.git. all credits to him.

import { getOctokit, context } from "@actions/github";

const UPDATER_TAG = "updater";
const UPDATER_FILE = "release.json";

const getSignature = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/octet-stream" },
  });

  return response.text();
};

const github = getOctokit(process.env.GITHUB_TOKEN);
const { repos } = github.rest;
const repoMetaData = {
  owner: context.repo.owner,
  repo: context.repo.repo,
};

const { data: latestRelease } = await repos.getLatestRelease(repoMetaData);

const releaseData = {
  version: latestRelease.tag_name,
  notes: `https://github.com/${repoMetaData.owner}/${repoMetaData.repo}/releases/tag/${latestRelease.tag_name}`,
  pub_date: new Date().toISOString(),
  platforms: {
    // "darwin-aarch64": {
    //   signature: "",
    //   url: "",
    // },
    "darwin-x86_64": {
      signature: "",
      url: "",
    },
    "linux-x86_64": {
      signature: "",
      url: "",
    },
    "windows-x86_64": {
      signature: "",
      url: "",
    },
  },
};

const promises = latestRelease.assets.map(
  async ({ name, browser_download_url }) => {
    const signature = await getSignature(browser_download_url);

    if (name.endsWith(".app.tar.gz")) {
      // releaseData.platforms["darwin-aarch64"].url = browser_download_url;
      releaseData.platforms["darwin-x86_64"].url = browser_download_url;
    }

    if (name.endsWith(".app.tar.gz.sig")) {
      // releaseData.platforms["darwin-aarch64"].signature = signature;
      releaseData.platforms["darwin-x86_64"].signature = signature;
    }

    if (name.endsWith(".AppImage.tar.gz")) {
      releaseData.platforms["linux-x86_64"].url = browser_download_url;
    }

    if (name.endsWith(".AppImage.tar.gz.sig")) {
      releaseData.platforms["linux-x86_64"].signature = signature;
    }

    if (name.endsWith(".msi.zip")) {
      releaseData.platforms["windows-x86_64"].url = browser_download_url;
    }

    if (name.endsWith(".msi.zip.sig")) {
      releaseData.platforms["windows-x86_64"].signature = signature;
    }
  }
);

await Promise.allSettled(promises);

// if (!releaseData.platforms["darwin-aarch64"].url) {
//   throw new Error("Failed to get release for MacOS");
// }

if (!releaseData.platforms["linux-x86_64"].url) {
  throw new Error("Failed to get release for Linux");
}

if (!releaseData.platforms["windows-x86_64"].url) {
  throw new Error("Failed to get release for Windows");
}

const { data: updater } = await repos.getReleaseByTag({
  ...repoMetaData,
  tag: UPDATER_TAG,
});

const prevReleaseAsset = updater.assets.find(
  (asset) => asset.name === UPDATER_FILE
);
if (prevReleaseAsset) {
  await repos.deleteReleaseAsset({
    ...repoMetaData,
    asset_id: prevReleaseAsset.id,
  });
}

await repos.uploadReleaseAsset({
  ...repoMetaData,
  release_id: updater.id,
  name: UPDATER_FILE,
  data: JSON.stringify(releaseData),
});
