import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'; 
import Navbar from "../components/global/navbar";
import Menu from "../components/home/menu";
import { useNavigate } from "react-router-dom";
import FavoriteTab from "./favorite";
import { getRatingsObj } from "../utilities";
import { getUserRatings, updateRating } from "../APIs/ratings";
import UserUpdateModal from "../components/global/userDetailsUpdateModal";

export default function Student() {
    
    const currentTab = useSelector((state) => state.sideBarTabs.currentTab);
    const credentials = useSelector((state) => state.credentials.credentials);
    const navigate = useNavigate()
    const [ratings, setRatings] = useState({});  // State to store ratings for food items
    const [tab , setTab] = useState(0)
    const [userDetails , setUserDetails] = useState(null)
    const [updateModal , setUpdateModal] = useState(false)
    
    const getUserFavoriteAndRatingsHandler = async () => {
        try {
          
          let ratings = await getUserRatings();
          setRatings(getRatingsObj(ratings.data))
        } catch (error) {
          console.log("Error", error);
        }
      };
    
    const handleRating = async (food, rating) => {

    try {
        
        if(ratings[food] == rating){
            const { data, status } = await updateRating(food, 0)
            setRatings(getRatingsObj(data.ratings));
        }else{
            const { data, status } = await updateRating(food, rating)
            setRatings(getRatingsObj(data.ratings));
        }
        
    } catch (error) {
        console.log("Error", error)     
    }
    
    };


    useEffect(() => {
        if (credentials?.role !== 'Student') {
            navigate('/')
        } 
        getUserFavoriteAndRatingsHandler();

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const backToTopButton = document.querySelector(".back-to-up");
           
            if (scrollPosition > 300) {
                // Adjust the scroll threshold as needed
                if(backToTopButton){
                    backToTopButton.style.display = "flex";
                }
            } else {
                if(backToTopButton){
                    backToTopButton.style.display = "none";
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => { setUserDetails(credentials); setTab(currentTab)}, [credentials, currentTab])

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
                </div>
            </header>
            {/* Header Section End  */}
            <section id="features" className="section">
                <div style={{ width: '300px', height: '100vh', top: 85, zIndex: 10 }} className="bg-lightorange sidebar sidebarPage position-fixed left-0 p-1 py-3">
                    <div className=" d-flex flex-col align-items-center mx-3">
                        <div style={{
                            fontSize : '22px'
                        }} className=" my-1 mb-3 cursor-pointer w-100  text text-black border-circular"
                            onClick={() => setUpdateModal(true)}
                        >
                            Hi, {userDetails?.fullName}
                        </div>
                        <div onClick={()=> setTab(0)} className={`cursor-pointer w-100 p-2 ${tab === 0 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Student Dashboard
                        </div>
                        <div onClick={()=> {setTab(1)}} className={`cursor-pointer w-100 p-2 ${tab === 1 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Favorite Items
                        </div>
                        {/* <div onClick={()=> setTab(3)} className={`cursor-pointer w-100 p-2 ${tab === 3 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Favorites
                        </div> */}


                    </div>
                </div>
                <div style={{ padding: '10px' }} className="menuForPages">
                    {updateModal && <UserUpdateModal updateModal={updateModal} setUpdateModal={setUpdateModal}/> }
                    {tab == 0 && <Menu handleRating={handleRating} ratings={ratings}/>}
                    {tab == 1 && <FavoriteTab ratings={ratings}/>}
                </div>
            </section>
        </>
    )
}
