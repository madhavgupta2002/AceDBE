import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://acedbe.vercel.app';

    // Base routes
    const routes = [
        '',
        // Add other static routes here if any
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }));

    return [
        ...routes,
        // Add dynamic subject routes if needed
    ];
}
