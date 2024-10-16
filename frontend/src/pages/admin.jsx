import { useEffect, useState } from "react";
import Navbar from "../components/global/navbar";
import Menu from "../components/home/menu";
import { useNavigate } from "react-router-dom";


export default function Admin() {
    const navigate = useNavigate()
    const [tab, setTab] = useState(1)
    useEffect(() => {
        const credentials = localStorage.getItem('credentials') && JSON.parse(localStorage.getItem('credentials'))
        if (credentials?.role !== 'Admin') {
            navigate('/')

        } 
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const backToTopButton = document.querySelector(".back-to-up");
           
            if (scrollPosition > 300) {
                // Adjust the scroll threshold as needed
                backToTopButton.style.display = "flex";
            } else {
                backToTopButton.style.display = "none";
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {/* Header Section Start */}
            <header id="home" className="hero-area">
                <div className="content-box">

                    <div className="overlay">
                        <span></span>
                    </div>
                    <Navbar page={true} />
                    {/* <MainSection /> */}
                </div>
            </header>
            {/* Header Section End  */}
            <section id="features" className="section">
                <div style={{ width: '300px', height: '100vh', top: 85, zIndex: 10 }} className="bg-lightorange sidebar sidebarPage position-fixed left-0 p-1 py-3">
                    <div className=" d-flex flex-col align-items-center mx-3">

                        <div style={{
                            fontSize: '22px'
                        }} className=" my-1 mb-3 cursor-pointer w-100  text text-black border-circular">
                            Admin Dashboard
                        </div>
                        {/* <div onClick={() => setTab(1)} className={`cursor-pointer w-100 p-2 ${tab === 1 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Favorite Insights
                        </div>
                        <div onClick={() => setTab(2)} className={`cursor-pointer w-100 p-2 ${tab === 2 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ User Preferences
                        </div>
                        <div onClick={() => setTab(3)} className={`cursor-pointer w-100 p-2 ${tab === 3 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Website Settings
                        </div> */}


                    </div>
                </div>
                <div style={{ padding: '10px' }}  className="menuForPages">

                    <Menu />

                </div>
            </section>

            {/* <Services /> */}
            {/* <Team /> */}
            {/* <Contact /> */}
            {/* <Footer /> */}

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
