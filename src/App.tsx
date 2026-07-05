import HeroSection from '@/components/hero/HeroSection';
import { lazy, Suspense, useEffect, useState } from 'react';
import styles from './App.module.css';

const PhilosophySection = lazy(() => import('@/components/philosophy/PhilosophySection'));
const IngredientsSection = lazy(() => import('@/components/ingredients/IngredientsSection'));
const ColorCollection = lazy(() => import('@/components/collection/ColorCollection'));
const TextureSection = lazy(() => import('@/components/texture/TextureSection'));
const PackagingSection = lazy(() => import('@/components/packaging/PackagingSection'));
const CampaignGallery = lazy(() => import('@/components/campaign/CampaignGallery'));
const TestimonialsSection = lazy(() => import('@/components/testimonials/TestimonialsSection'));
const BrandStory = lazy(() => import('@/components/brand/BrandStory'));
const FeaturedCollection = lazy(() => import('@/components/featured/FeaturedCollection'));
const NewsletterSection = lazy(() => import('@/components/newsletter/NewsletterSection'));
const Footer = lazy(() => import('@/components/footer/Footer'));

function DeferredSections() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setShouldRender(true), {
        timeout: 1800,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = globalThis.setTimeout(() => setShouldRender(true), 900);
    return () => globalThis.clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <PhilosophySection />
      <IngredientsSection />
      <ColorCollection />
      <TextureSection />
      <PackagingSection />
      <CampaignGallery />
      <TestimonialsSection />
      <BrandStory />
      <FeaturedCollection />
      <NewsletterSection />
      <Footer />
    </Suspense>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <DeferredSections />
    </main>
  );
}
