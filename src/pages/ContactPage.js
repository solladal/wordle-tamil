import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Seo } from '../components/Seo';

export default function ContactPage() {
  return (
    <>
      <Seo
        title="தொடர்பு கொள்ள - Contact Wordle Tamil"
        description="வேடல் (Wordle Tamil) பற்றிய கருத்துகள், பிழை தெரிவிப்புகள் மற்றும் பரிந்துரைகளை எங்களுக்கு அனுப்ப தொடர்பு விவரங்கள்."
        path="/contact"
      />
      <PageLayout title="தொடர்பு கொள்ள - Contact Us">
      <p>
        வேடல் (Wordle Tamil) பற்றிய கருத்துகள், பிழை தெரிவிப்புகள் மற்றும்
        பரிந்துரைகளை வரவேற்கிறோம். எங்களை பின்வரும் வழிகளில் தொடர்பு
        கொள்ளலாம்:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{' '}
          <a href="mailto:wordletamil@gmail.com?subject=Feedback">wordletamil@gmail.com</a>
        </li>
        <li>
          <strong>Twitter:</strong>{' '}
          <a href="https://twitter.com/intent/tweet?screen_name=tamil_wordle" target="_blank" rel="noreferrer">
            @tamil_wordle
          </a>
        </li>
      </ul>
      <p>
        விளையாட்டில் தவறு ஏதேனும் இருந்தால் அல்லது புதிய சொல் பரிந்துரைக்க
        விரும்பினால், மேலே உள்ள மின்னஞ்சல் அல்லது Twitter வழியாக அறியத்தட்டவும்.
        உங்கள் கருத்துகள் இந்த விளையாட்டை மேம்படுத்த உதவும்.
      </p>
    </PageLayout>
    </>
  );
}
