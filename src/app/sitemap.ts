import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://girquell.cat",          lastModified: new Date(), changeFrequency: "monthly", priority: 1   },
    { url: "https://girquell.cat/#profile",  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://girquell.cat/#work",     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: "https://girquell.cat/#contact",  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.7 },
  ];
}
