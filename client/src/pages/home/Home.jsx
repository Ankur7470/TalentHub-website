import PopularCategories from "../../components/popularCategories/PopularCategories";
import HeroSection from "../../components/heroSection/HeroSection";
import Featured from "../../components/featuredProducts/Featured";
import MarketPlace from "../../components/marketPlace/MarketPlace";

function Home() {

  return (
    <>
      <HeroSection />
      <PopularCategories />
      <Featured />
      <MarketPlace />
    </>
  );
}

export default Home;
