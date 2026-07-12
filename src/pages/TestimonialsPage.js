import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { PageLayout } from '../components/PageLayout';
import { Seo } from '../components/Seo';
import { readSettings } from '../util/stateUtil';

// Hardcoded sample testimonials pulled from Twitter/X mentions and reader
// emails, for a first look at how a "testimonials wall" page could look.
// Replace with real, permissioned quotes before shipping.
const TESTIMONIALS = [
  {
    source: 'twitter',
    handle: '@kavitha_reads',
    name: 'Kavitha',
    date: 'ஜூன் 2026',
    quote:
      'தினமும் காலையில் காபி குடிக்கும்போது வேடல் விளையாடுவது ஒரு பழக்கமாகிவிட்டது! தமிழ் சொல் வளம் கூடுகிறது.',
  },
  {
    source: 'email',
    handle: 'wordletamil@gmail.com',
    name: 'முருகன், சென்னை',
    date: 'மே 2026',
    quote:
      'என் அம்மாவுக்கு ஆங்கில Wordle புரியாது, ஆனால் இதை அவங்க தினமும் விளையாடுறாங்க. நன்றி இப்படி ஒரு அருமையான தமிழ் விளையாட்டு உருவாக்கியதற்கு!',
  },
  {
    source: 'twitter',
    handle: '@thamizh_paiyan',
    name: 'Arun',
    date: 'ஏப்ரல் 2026',
    quote:
      'செந்தமிழ் mode-ல ஆடறது சவாலா இருக்கு, ஆனா அதனாலயே ரசிக்கிறேன். புது புதுசொற்கள் தெரிஞ்சுக்கிறேன்.',
  },
  {
    source: 'email',
    handle: 'wordletamil@gmail.com',
    name: 'Priya S.',
    date: 'மார்ச் 2026',
    quote:
      "I've tried every language Wordle out there, but this Tamil version is by far the most polished. The dark mode and easy mode are thoughtful touches!",
  },
  {
    source: 'twitter',
    handle: '@ilangovan_tech',
    name: 'Ilangovan',
    date: 'மார்ச் 2026',
    quote:
      'My streak is at 42 days now. இது ஒரு அற்புதமான வழி தமிழ் மொழியை தினமும் பயில. குடும்பம் முழுவதும் இப்போ இதை விளையாடுது!',
  },
  {
    source: 'email',
    handle: 'wordletamil@gmail.com',
    name: 'Deepa, கோயம்புத்தூர்',
    date: 'பிப்ரவரி 2026',
    quote:
      'பள்ளி நாட்களில் தமிழ் பாடம் மேல இருந்த ஆர்வம் இப்போ இந்த விளையாட்டு மூலம் திரும்பி வந்திருச்சு. நன்றி வேடல் குழுவினருக்கு!',
  },
];

// Small deterministic palette so each avatar gets a consistent, colourful
// background based on the person's name (no images needed for hardcoded data).
const AVATAR_PALETTE = ['#6aaa64', '#c9b458', '#3a7ca5', '#e0777d', '#8e6cae', '#d98e04'];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function initials(name) {
  return name.trim().charAt(0).toUpperCase();
}

const AUTOPLAY_MS = 4500;

function TestimonialSlider({ darkmode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const count = TESTIMONIALS.length;

  const goTo = useCallback((i) => {
    setActiveIndex(((i % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next, paused]);

  const SWIPE_THRESHOLD = 40;

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      prev();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      next();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setPaused(false);
  };

  const dm = darkmode ? 'true' : 'false';

  return (
    <div
      className="testimonialSlider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testimonialSliderRow">
        <button
          type="button"
          className="testimonialSliderArrow prev"
          onClick={prev}
          aria-label="முந்தையது"
          darkmode={dm}
        >
          &#8249;
        </button>

        <div
          className="testimonialSliderTrack"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="testimonialSliderRail"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {TESTIMONIALS.map((t) => (
              <div className="testimonialSlide" key={t.name}>
                <div className="testimonialCard" darkmode={dm}>
                  <span className="testimonialQuoteMark" aria-hidden="true">&ldquo;</span>
                  <div className={`testimonialSourceBadge ${t.source}`}>
                    {t.source === 'twitter' ? 'Twitter' : 'Email'}
                  </div>
                  <p className="testimonialQuote" darkmode={dm}>{t.quote}</p>
                  <div className="testimonialCardFooter">
                    <div className="testimonialAvatar" style={{ background: avatarColor(t.name) }}>
                      {initials(t.name)}
                    </div>
                    <div className="testimonialMeta">
                      <div className="testimonialName" darkmode={dm}>{t.name}</div>
                      <div className="testimonialHandle" darkmode={dm}>{t.handle} · {t.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="testimonialSliderArrow next"
          onClick={next}
          aria-label="அடுத்தது"
          darkmode={dm}
        >
          &#8250;
        </button>
      </div>

      <div className="testimonialSliderDots">
        {TESTIMONIALS.map((t, i) => (
          <button
            type="button"
            key={t.name}
            className={`testimonialSliderDot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`${i + 1} ஆவது கருத்துக்கு செல்ல`}
            darkmode={dm}
          />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const darkmode = readSettings().darkMode;

  // Standalone pages aren't rendered inside the main <App>, so they don't get
  // the body background side-effect that getMode() applies there. Mirror it
  // here so the area outside the centered content column also matches.
  useEffect(() => {
    document.body.style.backgroundColor = darkmode ? '#121213' : 'white';
  }, [darkmode]);

  const dm = darkmode ? 'true' : 'false';

  return (
    <>
      <Seo
        title="வேடல் - வாசகர் கருத்துகள் (Testimonials)"
        description="வேடல் (Wordle Tamil) விளையாட்டை பற்றி Twitter மற்றும் மின்னஞ்சல் மூலம் வாசகர்கள் தெரிவித்த கருத்துகள்."
        path="/testimonials"
      />
      <PageLayout title="" wide darkmode={darkmode}>
        <div className="testimonialsHero">
          <h1 className="testimonialsHeroTitle" darkmode={dm}>வாசகர்கள் சொல்வது</h1>
          <p className="testimonialsHeroSubtitle" darkmode={dm}>
            Twitter &amp; மின்னஞ்சல் மூலம் வந்த ரசிகர்களின் அன்பான கருத்துகள்
          </p>
        </div>
        <p className="testimonialsNote" darkmode={dm}>
          (இவை மாதிரிக்காக உருவாக்கப்பட்டவை — உண்மையான கருத்துகளுடன் இந்தப் பக்கம்
          விரைவில் புதுப்பிக்கப்படும்.)
        </p>

        <TestimonialSlider darkmode={darkmode} />

        <div className="testimonialsCta" darkmode={dm}>
          <p>உங்கள் அனுபவத்தை பகிர விரும்புகிறீர்களா?</p>
          <div className="testimonialsCtaIcons">
            <a
              className="testimonialsCtaIcon email"
              href="mailto:wordletamil@gmail.com?subject=Testimonial"
              aria-label="மின்னஞ்சல் அனுப்பு"
              title="மின்னஞ்சல் அனுப்பு"
            >
              <FaEnvelope />
            </a>
            <a
              className="testimonialsCtaIcon twitter"
              href="https://twitter.com/intent/tweet?screen_name=tamil_wordle"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter-ல் குறிப்பிடு"
              title="Twitter-ல் குறிப்பிடு"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
