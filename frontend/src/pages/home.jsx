import { useEffect } from "react";
import Navbar from "../components/global/navbar";
import MainSection from "../components/home/mainBox";
import Services from "../components/home/services";
import Menu from "../components/home/menu";
import Team from "../components/home/team";
import Contact from "../components/home/contact";
import Footer from "../components/global/footer";


export default function Home() {


  return (
    <>
      {/* Header Section Start */}
      <header id="home" className="hero-area">
        <div className="content-box">

          <div className="overlay">
            <span></span>
          </div>
          <Navbar />
          {/* <MainSection /> */}
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
