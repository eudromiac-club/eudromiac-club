import { Hero } from '@/components/public/hero';
import { SectionPillars } from '@/components/public/section-pillars';
import { SectionCollection } from '@/components/public/section-collection';
import { SectionExtractosTeaser } from '@/components/public/section-extractos-teaser';
import { SectionBrandFilm } from '@/components/public/section-brand-film';
import { SectionExperiencias } from '@/components/public/section-experiencias';
import { SectionAccess } from '@/components/public/section-access';
import { Footer } from '@/components/public/footer';
import { PageBackground } from '@/components/layout/page-background';

export default function Home() {
  return (
    <>
      <PageBackground
        mobileSrc="/home/home-fondo-mobile.webp"
        webSrc="/home/home-fondo-web.webp"
        priority
        overlayStyle={{
          background:
            'linear-gradient(to bottom, hsl(var(--background) / 0.45), hsl(var(--background) / 0.58) 45%, hsl(var(--background) / 0.68))',
        }}
      />
      <main>
        <Hero />
        <SectionPillars />
        <SectionCollection />
        <SectionExtractosTeaser />
        <SectionBrandFilm />
        <SectionExperiencias />
        <SectionAccess />
      </main>
      <Footer />
    </>
  );
}
