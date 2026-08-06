import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/env";
import { getActivePackageSlugs } from "@/lib/packages/public";
import { getActiveProductSlugs } from "@/lib/products/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/paketi`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/proizvodi`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/o-nama`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/kontakt`, changeFrequency: "monthly", priority: 0.8 },
  ];

  try {
    const [{ data }, { data: products }] = await Promise.all([getActivePackageSlugs(), getActiveProductSlugs()]);
    return [
      ...staticRoutes,
      ...(data ?? []).map((item) => ({
        url: `${siteUrl}/paketi/${item.slug}`,
        lastModified: item.updated_at,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...(products ?? []).map((item) => ({
        url: `${siteUrl}/proizvodi/${item.slug}`,
        lastModified: item.updated_at,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
