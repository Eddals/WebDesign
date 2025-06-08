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
  ogImage = 'https://devtone.com/og-image.jpg', // Replace with your default OG image
  ogUrl = 'https://devtone.com', // Replace with your domain
  article = false
}: SEOProps) {
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title} | Devtone - Web Development</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Devtone" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  )
}