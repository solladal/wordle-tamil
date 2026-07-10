import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { HelpContent } from '../components/HelpContent';
import { Seo } from '../components/Seo';

// Standalone, indexable version of the in-game Help modal content.
export default function HowToPlayPage() {
  return (
    <>
      <Seo
        title="எப்படி விளையாடுவது - How to Play Wordle Tamil"
        description="வேடல் விளையாட்டை எப்படி விளையாடுவது என்பதற்கான முழு வழிமுறைகள் - நிற குறிப்புகள், உயிர்மெய்/மெய்/உயிர் எழுத்து துப்புகள் மற்றும் உதாரணங்கள்."
        path="/how-to-play"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'எப்படி விளையாடுவது - How to Play Wordle Tamil',
          url: 'https://solladal.github.io/wordle-tamil/how-to-play',
          inLanguage: 'ta',
          isPartOf: {
            '@type': 'Game',
            name: 'Wordle Tamil (வேடல்)',
            url: 'https://solladal.github.io/wordle-tamil/',
          },
        }}
      />
      <PageLayout title="எப்படி விளையாடுவது - How to Play Wordle Tamil">
        <HelpContent darkMode={false} />
      </PageLayout>
    </>
  );
}
