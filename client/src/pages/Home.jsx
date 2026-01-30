import HeroCarouselSection from '../components/HeroCarouselSection';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import ProductsSection from '../components/ProductsSection';
import BlogSection from '../components/BlogSection';
import NewsletterSection from '../components/NewsletterSection';
import FooterSection from '../components/FooterSection';

const Home = () => {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col">
      <HeroCarouselSection />
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <BlogSection />
      <NewsletterSection />
      <FooterSection />
    </div>
  );
};

export default Home;