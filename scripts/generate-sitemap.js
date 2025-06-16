import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define your website's base URL
const BASE_URL = 'https://www.devtone.agency';

// Define your routes with their priorities and change frequencies
const routes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/about',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/services',
    priority: 0.9,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/services/web-design',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/services/landing-page',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/services/social-media-marketing',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/services/digital-marketing',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/services/marketing-automation',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/seo',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/pricing',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/estimate',
    priority: 0.9,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/contact',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/faq',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/privacy',
    priority: 0.3,
    changefreq: 'yearly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/terms',
    priority: 0.3,
    changefreq: 'yearly',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Generate XML sitemap
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Generate robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /chat-dashboard/
Disallow: /*.json$
Disallow: /*.xml$

# Allow specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;
}

// Write files
function writeFiles() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap.xml
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, generateSitemap());
  console.log('✅ Generated sitemap.xml');

  // Write robots.txt
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, generateRobotsTxt());
  console.log('✅ Generated robots.txt');

  console.log(`📍 Files generated in: ${publicDir}`);
  console.log(`🌐 Sitemap URL: ${BASE_URL}/sitemap.xml`);
  console.log(`🤖 Robots URL: ${BASE_URL}/robots.txt`);
}

// Run the generator
try {
  writeFiles();
  console.log('🎉 SEO files generated successfully!');
} catch (error) {
  console.error('❌ Error generating SEO files:', error);
  process.exit(1);
}