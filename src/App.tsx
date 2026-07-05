import HeroSection from '@/components/hero/HeroSection';
import styles from './App.module.css';

import PhilosophySection from '@/components/philosophy/PhilosophySection';
import IngredientsSection from '@/components/ingredients/IngredientsSection';
import ColorCollection from '@/components/collection/ColorCollection';
import TextureSection from '@/components/texture/TextureSection';
import PackagingSection from '@/components/packaging/PackagingSection';
import CampaignGallery from '@/components/campaign/CampaignGallery';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import BrandStory from '@/components/brand/BrandStory';
import FeaturedCollection from '@/components/featured/FeaturedCollection';
import NewsletterSection from '@/components/newsletter/NewsletterSection';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
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
    </main>
  );
}
