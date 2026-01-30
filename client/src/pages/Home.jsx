import HeroCarouselSection from '../components/landing/HeroCarouselSection';
import HighlightSection from '../components/landing/HighlightSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ProductsSection from '../components/landing/ProductsSection';
import BlogSection from '../components/landing/BlogSection';
import NewsletterSection from '../components/landing/NewsletterSection';
import FooterSection from '../components/FooterSection';

const Home = () => {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col">
      <HeroCarouselSection />
      <HighlightSection />
      <ProductsSection />
      <FeaturesSection />
      <BlogSection />
      <NewsletterSection />
      <FooterSection />
    </div>
  );
};

export default Home;