/**
 * Utilitas Parser dan Embed YouTube untuk Karya Submission
 */

/**
 * Mengekstrak YouTube Video ID dari berbagai format URL YouTube:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID&feature=share
 * - https://youtu.be/VIDEO_ID?si=...
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 */
export function getYouTubeVideoId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  const regExp =
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Mengembalikan embed URL YouTube yang valid untuk iframe
 */
export function getYouTubeEmbedUrl(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Mengambil embed URL YouTube dari sebuah submission karya peserta
 * Memeriksa link yang bertipe YOUTUBE terlebih dahulu, lalu memeriksa semua tautan jika ada URL YouTube
 */
export function extractYouTubeUrlFromSubmission(submission) {
  if (!submission?.links || !Array.isArray(submission.links)) return null;

  // 1. Cek link eksplisit bertipe YOUTUBE
  const explicitLink = submission.links.find(
    (l) => l?.link_type?.toUpperCase() === "YOUTUBE" && l.url
  );
  if (explicitLink) {
    const embed = getYouTubeEmbedUrl(explicitLink.url);
    if (embed) return embed;
  }

  // 2. Fallback: Cari di semua link apakah ada url YouTube
  for (const link of submission.links) {
    if (link?.url) {
      const embed = getYouTubeEmbedUrl(link.url);
      if (embed) return embed;
    }
  }

  return null;
}
