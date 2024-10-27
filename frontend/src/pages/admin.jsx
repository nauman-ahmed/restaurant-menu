import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'; 
import Navbar from "../components/global/navbar";
import { useNavigate } from "react-router-dom";
import UserDetails from "./allUsers";
import { getAllUser } from "../APIs/users";
import RatingInsight from "./ratingInsight"
import { getCleanText } from "../utilities";
import BannerTime from "./banner";

export default function Admin() {
  
    const currentTab = useSelector((state) => state.sideBarTabs.currentTab);
    const credentials = useSelector((state) => state.credentials.credentials);
    const navigate = useNavigate()
    const [tab, setTab] = useState(1)
    const [userDetails, setUserDetails] = useState(null)
    const [userRatings, setUserRatings] = useState(null)
    const [userFavorites, setUserFavorites] = useState(null)
    const [maxCount, setMaxCount] = useState(0)
    
    const favoriteInsightGroupAndCountHandler = (totalFavourites) => {
        const nameMap = {}; // Object to store the count of each name

        totalFavourites.forEach(item => {
        const cleanedName = getCleanText(item.name); // Clean the name
        
        // If the name already exists, increment its count
        if (nameMap[cleanedName]) {
            nameMap[cleanedName].count += 1;
        } else {
            // If the name doesn't exist, initialize it with a count of 1 and store the object
            nameMap[cleanedName] = { count: 1, item: item };
        }
        });

        // Convert the nameMap object to an array to store each object along with its count
        const nameCountArray = Object.keys(nameMap).map(name => ({
        name: name,
        count: nameMap[name].count,
        _id: nameMap[name].item._id
        }));

        let maxCount = nameCountArray.reduce((maxItem, currentItem) => {
            return currentItem.count > maxItem.count ? currentItem : maxItem;
        }, nameCountArray[0]);
        setUserFavorites(nameCountArray)
        setMaxCount(maxCount.count)
    }

    const ratingInsightGroupAndAvgHandler = (totalRatings) => {
        if (totalRatings && totalRatings.length > 0) {
            const ratingMap = {}; // To store grouped items with their total and count
            let maxCount = 0

            totalRatings.forEach(item => {
              const cleanedName = getCleanText(item.name); // Clean special characters
              if (ratingMap[cleanedName]) {
                ratingMap[cleanedName].totalRating += item.rating;
                ratingMap[cleanedName].count += 1;
                
              } else {
                ratingMap[cleanedName] = { totalRating: item.rating, count: 1 };
              }
            });
      
            const data = [];
      
            Object.keys(ratingMap).forEach(key => {
              const averageRating = ratingMap[key].totalRating / ratingMap[key].count;
              data.push({name: key, rating: averageRating});
            });
            setUserRatings(data)
        }
    }

    const getAllUsers = async () => {
        try {
            const { data, status } = await getAllUser()
            let totalRatings = []
            let totalFavorites = []
            data.map((user) => {
                user.ratings?.map((ratingArray) => {
                    totalRatings = [...totalRatings, ratingArray]
                })
                user.favorites?.map((favoriteArray) => {
                    totalFavorites = [...totalFavorites, favoriteArray]
                })
            })
            ratingInsightGroupAndAvgHandler(totalRatings)
            favoriteInsightGroupAndCountHandler(totalFavorites)
            setUserDetails(data)
        } catch (error) {
            console.log("Error", error)
        }
    }
    useEffect(() => {
       
        if (credentials?.role !== 'Admin') {
            navigate('/')
        } 
        getAllUsers()
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

    useEffect(() => { setTab(currentTab)}, [currentTab])
   
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
                        <div onClick={() => setTab(0)} className={`cursor-pointer w-100 p-2 ${tab === 0 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Dashboard
                        </div>
                        <div onClick={() => setTab(1)} className={`cursor-pointer w-100 p-2 ${tab === 1 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Rating Insights
                        </div>
                        <div onClick={() => setTab(2)} className={`cursor-pointer w-100 p-2 ${tab === 2 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Favorite Insights
                        </div>
                        <div onClick={() => setTab(3)} className={`cursor-pointer w-100 p-2 ${tab === 3 ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                            ⦿ Banner Timing
                        </div>

                    </div>
                </div>
                <div style={{ padding: '10px' }}  className="menuForPages">
                    {tab == 0 && <UserDetails userDetails= {userDetails}/>}
                    {tab == 1 && <RatingInsight title = {"Rating Insight"} data={userRatings} />}
                    {tab == 2 && <RatingInsight title = {"Favorite Insight"} data={userFavorites} maxCount={maxCount}/>}
                    {tab == 3 && <BannerTime title = {"Banner Timing"}/>}
                </div>
            </section>

        </>
    )
}
