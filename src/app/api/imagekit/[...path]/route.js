import https from "https";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams?.path;

  if (!pathSegments || !Array.isArray(pathSegments) || pathSegments.length === 0) {
    return new Response("Missing path parameter", { status: 400 });
  }

  const imagePath = pathSegments.join("/");
  const requestUrl = new URL(request.url);
  const searchParams = requestUrl.search || "";
  const cloudfrontHost = "d28h3jm4r3crf8.cloudfront.net";
  const targetUrl = `https://${cloudfrontHost}/${imagePath}${searchParams}`;

  try {
    return await new Promise((resolve) => {
      const options = {
        headers: {
          Host: "ik.imagekit.io",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        servername: cloudfrontHost,
      };

      const req = https.get(targetUrl, options, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          return resolve(
            new Response(`Upstream error: ${res.statusCode}`, {
              status: res.statusCode,
            })
          );
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const responseHeaders = new Headers();

          if (res.headers["content-type"]) {
            responseHeaders.set("Content-Type", res.headers["content-type"]);
          }
          if (res.headers["content-length"]) {
            responseHeaders.set("Content-Length", res.headers["content-length"]);
          }

          // Cache control for CDN and browser (30 days)
          responseHeaders.set(
            "Cache-Control",
            "public, max-age=2592000, s-maxage=2592000, immutable"
          );

          resolve(
            new Response(buffer, {
              status: 200,
              headers: responseHeaders,
            })
          );
        });
      });

      req.on("error", (err) => {
        console.error("ImageKit Proxy Error:", err);
        resolve(
          new Response(`ImageKit proxy error: ${err.message}`, { status: 502 })
        );
      });
    });
  } catch (error) {
    return new Response(`Server error: ${error.message}`, { status: 500 });
  }
}
