// IndexNow Instant Indexing Dispatcher
// Submits canonical URLs directly to Bing, Copilot, and IndexNow participating search engines.

const HOST = "freeconvertingtools.co.in";
const KEY = "b67909dc8a7d4a23b8f10257e2a9b401";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/all-tools`,
  `https://${HOST}/all-tools/pdf`,
  `https://${HOST}/all-tools/image`,
  `https://${HOST}/all-tools/video-audio`,
  `https://${HOST}/all-tools/downloaders`,
  `https://${HOST}/all-tools/edit-convert`,
  `https://${HOST}/all-tools/pdf/pdf-to-word`,
  `https://${HOST}/all-tools/pdf/pdf-merge`,
  `https://${HOST}/all-tools/pdf/pdf-to-jpg`,
  `https://${HOST}/all-tools/pdf/image-to-pdf`,
  `https://${HOST}/all-tools/pdf/sign-pdf`,
  `https://${HOST}/all-tools/image/compress-image`,
  `https://${HOST}/all-tools/image/remove-bg`,
  `https://${HOST}/all-tools/video-audio/video-to-mp3`,
  `https://${HOST}/all-tools/downloaders/youtube-downloader`,
  `https://${HOST}/all-tools/downloaders/tiktok-saver`,
  `https://${HOST}/all-tools/downloaders/insta-reels`,
  `https://${HOST}/all-tools/downloaders/twitter-media`,
];

async function submitIndexNow() {
  console.log(`[IndexNow] Submitting ${URLS.length} URLs for ${HOST}...`);
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: URLS,
      }),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`[IndexNow] Successfully submitted to IndexNow! (Status: ${response.status})`);
    } else {
      console.log(`[IndexNow] Response status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("[IndexNow] Failed to submit:", error.message);
  }
}

submitIndexNow();
