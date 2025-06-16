#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple sitemap generation script
const generateSitemap = () => {
  const baseUrl = 'https://devtone.agency';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services', priority: '0.9', changefreq: 'weekly' },
    { loc: '/services/web-design', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services/landing-page', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services/social-media-marketing', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services/digital-marketing', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services/marketing-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/seo', priority: '0.8', changefreq: 'weekly' },
    { loc: '/pricing', priority: '0.7', changefreq: 'monthly' },
    { loc: '/estimate', priority: '0.9', changefreq: 'weekly' },
    { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
    { loc: '/faq', priority: '0.6', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
    { loc: '/dashboard', priority: '0.7', changefreq: 'monthly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully');
};

try {
  generateSitemap();
} catch (error) {
  console.warn('⚠️ Sitemap generation failed:', error.message);
  // Don't fail the build if sitemap generation fails
  process.exit(0);
}