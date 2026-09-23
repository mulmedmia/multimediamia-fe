export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mia2026.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/juri/",
          "/api/",
          "/profile/",
          "/dashboard/",
          "/maintenance/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
