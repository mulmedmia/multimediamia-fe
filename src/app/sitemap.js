export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mia2026.com";
  const currentDate = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/category", priority: 0.9, changeFrequency: "weekly" },
    { path: "/show-it", priority: 0.9, changeFrequency: "daily" },
    { path: "/leaderboard", priority: 0.8, changeFrequency: "daily" },
    { path: "/misi-harian", priority: 0.8, changeFrequency: "daily" },
    { path: "/product", priority: 0.8, changeFrequency: "weekly" },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
