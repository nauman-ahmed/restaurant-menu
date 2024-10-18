import { useEffect, useState } from 'react';
import Navbar from "../components/global/navbar";
import Menu from "../components/home/menu";
import Footer from "../components/global/footer";


export default function Home() {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  useEffect(() => {
    const checkTimeForBanner = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      // Set time conditions
      const isMorningBannerTime = currentHour === 7 && currentMinutes >= 0 && currentMinutes <= 30; // 7:00 AM to 7:30 AM
      const isEveningBannerTime = currentHour === 18 && currentMinutes >= 30; // 6:30 PM to 7:00 PM

      if (isMorningBannerTime) {
        setShowBanner(true);
        setBannerMessage('The Cafeteria is about to open at 7:30 AM');
      } else if (isEveningBannerTime) {
        setShowBanner(true);
        setBannerMessage('The Cafeteria is about to close at 7:00 PM');
      } else {
        setShowBanner(false); // Hide banner outside of those times
      }
    };

    // Initial check and set interval to check every minute
    checkTimeForBanner();
    const intervalId = setInterval(checkTimeForBanner, 60000); // Check every minute

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  return (
    <>
      {/* Header Section Start */}
      <header id="home" className="hero-area">
        <div className="content-box">

          <div className="overlay">
            <span></span>
          </div>
          <Navbar />
          
        </div>
      </header>
      {/* Header Section End  */}
      <section id="features" className="section">
        
        <div className="container">
          <Menu />
        </div>
      </section>

      {/* <Services /> */}
      {/* <Team /> */}
      {/* <Contact /> */}
      <Footer />

      {/* <!-- Go To Top Link --> */}
      {/* <a
        href="#"
        className="back-to-up justify-content-center align-items-center"
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();
        }}
      >
        <img src={"icons/chevron-up.svg"} />
      </a> */}

      {/* <!-- Preloader --> */}
      {/* <div id="preloader">
      <div className="loader" id="loader-1"></div>
    </div> */}
      {/* <!-- End Preloader --> */}
    </>
  )
}
