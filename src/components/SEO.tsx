import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  ogUrl?: string
  article?: boolean
  noIndex?: boolean
  structuredData?: object
  alternateLanguages?: { lang: string; url: string }[]
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage = 'https://devtone.agency/og-image.jpg',
  ogUrl = 'https://devtone.agency',
  article = false,
  noIndex = false,
  structuredData,
  alternateLanguages = []
}: SEOProps) {
  const fullTitle = title.includes('DevTone') ? title : `${title} | DevTone`;
  const siteName = "DevTone";
  
  // Default structured data for the organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "description": "Professional web development and digital marketing agency specializing in modern, responsive websites and comprehensive digital solutions",
    "url": "https://devtone.agency",
    "logo": "https://devtone.agency/logo.png",
    "image": ogImage,
    "sameAs": [
      "https://twitter.com/devtone",
      "https://linkedin.com/company/devtone",
      "https://github.com/devtone"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English"],
      "url": "https://devtone.agency/contact"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "United States"
    },
    "service": [
      {
        "@type": "Service",
        "name": "Web Development",
        "description": "Custom website development using modern technologies like React, Next.js, and TypeScript"
      },
      {
        "@type": "Service", 
        "name": "Digital Marketing",
        "description": "Comprehensive digital marketing services including SEO, social media marketing, and PPC advertising"
      },
      {
        "@type": "Service",
        "name": "Web Design",
        "description": "Responsive and user-friendly web design that converts visitors into customers"
      },
      {
        "@type": "Service",
        "name": "SEO Optimization",
        "description": "Search engine optimization to improve website visibility and organic traffic"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "foundingDate": "2019",
    "knowsAbout": [
      "Web Development",
      "Digital Marketing", 
      "SEO",
      "Web Design",
      "React",
      "Next.js",
      "TypeScript",
      "Responsive Design"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={siteName} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@devtone" />
      <meta name="twitter:creator" content="@devtone" />

      {/* Additional SEO tags */}
      <meta name="theme-color" content="#a855f7" />
      <meta name="msapplication-TileColor" content="#a855f7" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Business Information */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="business.contact_data.country_name" content="United States" />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} />
      
      {/* Alternate Languages */}
      {alternateLanguages.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Additional meta tags for better SEO */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Helmet>
  )
}