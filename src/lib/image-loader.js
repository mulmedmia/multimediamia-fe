export function getSafeImageUrl(url) {
  if (typeof url === "string") {
    if (url.startsWith("https://ik.imagekit.io/")) {
      return url.replace("https://ik.imagekit.io/", "/api/imagekit/");
    }
    if (url.startsWith("http://ik.imagekit.io/")) {
      return url.replace("http://ik.imagekit.io/", "/api/imagekit/");
    }
    if (url.startsWith("//ik.imagekit.io/")) {
      return url.replace("//ik.imagekit.io/", "/api/imagekit/");
    }
  }
  return url;
}

export default function imageLoader({ src }) {
  return getSafeImageUrl(src);
}
