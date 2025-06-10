import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  ogUrl?: string
  article?: boolean
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage = 'https://www.devtone.agency/og-image.jpg',
  ogUrl = 'https://www.devtone.agency',
  article = false
}: SEOProps) {
  const fullTitle = title.includes('DevTone') ? title : `${title} | DevTone`;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="DevTone" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@devtone" />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="DevTone" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Business Information */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="business.contact_data.country_name" content="United States" />

      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} />

      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "DevTone",
          "description": "Professional web development and digital marketing agency",
          "url": "https://www.devtone.agency",
          "logo": "https://www.devtone.agency/logo.png",
          "sameAs": [
            "https://twitter.com/devtone",
            "https://linkedin.com/company/devtone"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "English"
          }
        })}
      </script>
    </Helmet>
  )
}