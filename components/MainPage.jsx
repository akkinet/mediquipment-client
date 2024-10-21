import HeroSection from "./HeroSection";
import DealsandOffers from "./DealsandOffers";
import Testimonials from "./Testimonials";
import TagLine from "./TagLine";
import NewArrivals from "./NewArrivals";
import HomeProduct from "./server/HomeProduct";

function MainPage() {
  return (
    <>
      <HeroSection />
      <HomeProduct />
      <DealsandOffers />
      <TagLine />
      <NewArrivals />
      <Testimonials />
    </>
  );
}

export default MainPage;
