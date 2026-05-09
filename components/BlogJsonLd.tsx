/**
 * JSON-LD structured data for blog articles.
 * Helps Google show rich results (author, date, image).
 */
export default function BlogJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  const url = `https://veronica-method.vercel.app/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: "Veronica Method",
      url: "https://veronica-method.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Veronica Method",
      logo: {
        "@type": "ImageObject",
        url: "https://veronica-method.vercel.app/icon-512.png",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image.startsWith("http") ? image : `https://veronica-method.vercel.app${image}`,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
