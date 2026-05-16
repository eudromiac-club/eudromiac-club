import { Hero } from '@/components/public/hero';
import { SectionWhat } from '@/components/public/section-what';
import { SectionPhilosophy } from '@/components/public/section-philosophy';
import { SectionAccess } from '@/components/public/section-access';
import { Footer } from '@/components/public/footer';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <SectionWhat />
        <SectionPhilosophy />
        <SectionAccess />
      </main>
      <Footer />
    </>
  );
}
