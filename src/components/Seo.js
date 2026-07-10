import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://solladal.github.io/wordle-tamil';

// Sets per-route <title>, meta description and canonical URL so each
// page (game, how-to-play, about, privacy-policy, contact) is unique
// and correctly indexable instead of every route sharing the same
// static tags from public/index.html.
export function Seo({ title, description, path = '', jsonLd }) {
  const url = `${SITE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
