import { Hero } from '@/components/public/hero';
import { SectionPillars } from '@/components/public/section-pillars';
import { SectionCollection } from '@/components/public/section-collection';
import { SectionAccess } from '@/components/public/section-access';
import { Footer } from '@/components/public/footer';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <SectionPillars />
        <SectionCollection />
        <SectionAccess />
      </main>
      <Footer />
    </>
  );
}
