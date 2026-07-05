'use client';

import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamic import for HeroSection to avoid SSR issues with Three.js/GSAP
const HeroSection = dynamic(
  () => import('@/components/hero/HeroSection'),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* Next Section — slides up naturally after hero unpin */}
      <section className={styles.nextSection} id="collection">
        <div className={styles.nextContent}>
          <span className={styles.nextBadge}>
            <span className={styles.nextBadgeLine} />
            The Collection
          </span>
          <h2 className={styles.nextHeadline}>
            Redefining<br />
            Modern Beauty
          </h2>
          <p className={styles.nextSubtext}>
            Each shade tells a story of craftsmanship, precision, and
            uncompromising luxury. From the first touch to the final look,
            experience beauty reimagined.
          </p>

          {/* Product grid with generated images */}
          <div className={styles.productGrid}>
            {[
              { name: 'Velvet Rosé', src: '/images/velvet_rose.png' },
              { name: 'Noir Elegance', src: '/images/noir_elegance.png' },
              { name: 'Champagne Kiss', src: '/images/champagne_kiss.png' }
            ].map(
              (product, i) => (
                <div key={i} className={styles.productCard}>
                  <div className={styles.productImage}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.src}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>
                    ${(48 + i * 4).toFixed(2)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
