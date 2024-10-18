import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaChevronDown, FaChevronUp, FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa6";  // Import star icons
import dayjs from "dayjs";
import axios from "axios";
import { toast } from 'react-toastify';
import { addFavorite, getUserFavorite, removeFavorite } from "../../APIs/favourite";
import { getUserRatings, updateRating } from "../../APIs/ratings";
import { getFoodNames, getRatingsObj } from "../../utilities";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Staurday', 'Sunday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemer', 'December'];

export default function Menu() {
  const [duration, setDuration] = useState('day');
  const [dataIndex, setDataIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchedData, setSearchedData] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [menu, setMenu] = useState(null);
  const [ratings, setRatings] = useState({});  // State to store ratings for food items
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

  const handleNextDay = () => {
    setOpenMenu(0);
    setDataIndex(dataIndex + 1);
  };

  const handlePreviousDay = () => {
    setOpenMenu(0);
    setDataIndex(dataIndex - 1);
  };

  const toggleFavorite = async (food) => {
    try {
      if (favorites.includes(food)) {
        const { data, status } = await removeFavorite(food);
        if(status !== 200){
            toast.error('Login failed. Try again.');
            return 
        }
        const foodNames = getFoodNames(data.favorites);
        setFavorites(foodNames);
      } else {
        const { data, status } = await addFavorite(food);
        if(status !== 200){
            toast.error('Login failed. Try again.');
            return 
        }
        const foodNames = getFoodNames(data.favorites);
        setFavorites([...foodNames]);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getUserFavoriteAndRatingsHandler = async () => {
    try {
      const { data, status } = await getUserFavorite();
      setFavorites(getFoodNames(data));
      let ratings = await getUserRatings();
      setRatings(getRatingsObj(ratings.data))
    } catch (error) {
      console.log("Error", error);
    }
  };

  

  const getData = async () => {
    await axios.get(backendUrl + '/scrape').then(res => {
      localStorage.setItem('menuData', JSON.stringify(res.data));
      const index = res.data.findIndex(obj => obj.date.split(' ')[1] == new Date().getDate());
      setDataIndex(index);
      setMenu(res.data);
    }).catch(err => console.log(err));
  };

  useEffect(() => {
    const credentials = localStorage.getItem('credentials') && JSON.parse(localStorage.getItem('credentials'));
    
    if (credentials?.role === 'Student') {
      setShowFavorites(true);
      getUserFavoriteAndRatingsHandler();
    } 
    // localStorage.removeItem('menuData')
    if (localStorage.getItem('menuData')) {
      const menuData = JSON.parse(localStorage.getItem('menuData'));
      if (menuData?.some(obj => obj.date.includes(months[new Date().getMonth()])) && menuData?.some(obj => obj.date.split(' ')[1] === new Date().getDate)) {
        const index = menuData.findIndex(obj => obj.date.split(' ')[1] == new Date().getDate());
        setDataIndex(index);
        setMenu(localStorage.getItem('menuData') && JSON.parse(localStorage.getItem('menuData')));
      } else {
        getData();
      }
    } else {
      getData();
    }
  }, []);

  const applySearch = () => {
    if (searchText?.length > 0) {
      setSearching(true);
      setDuration('');
      const searchingData = [];
      
      menu?.forEach(mainobj => {
        mainobj.data.forEach(mealObj => {
          mealObj.foods.forEach(item => {
            // Split the item into an array of words before applying some()
            if (item.toLowerCase().startsWith(searchText?.toLowerCase())) {
              searchingData.push({
                date: mainobj.date + ' | ' + mainobj.day,
                meal: mealObj.meal,
                item: item
              });
            }
          });
        });
      });
    
      setSearchedData(searchingData);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (searchText?.length > 0) {
        applySearch();
      }
    }
  };

  const handleRating = async (food, rating) => {

    try {
      const { data, status } = await updateRating(food, rating)
      setRatings(getRatingsObj(data.ratings));
        
    } catch (error) {
      console.log("Error", error)     
       
    }
    
  };

  return (
    <>
      <div>
        {showBanner && (
          <div className="banner">
            <h2 className="banner-text">{bannerMessage}</h2>
          </div>
        )}
        <div className="features-text section-header text-center">
          <div>
            <h2 className="section-title">Our Food Menu</h2>
            <div className="desc-text">
              <p>
                Explore our menu featuring a delicious variety of appetizers, <br /> main courses, and desserts to satisfy every craving
              </p>
            </div>
          </div>
        </div>

        {menu ? (
          <>
            <div className=" w-100 d-flex flex-col gap-2 border  p-2 border-circular">
              <div className="d-flex justify-content-end mt-2 mb-4 w-100">
                <input
                  onKeyDown={handleKeyDown}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="searchInput border-circular"
                  placeholder="Search here"
                  type="text"
                />
              </div>

              {searching && (
                <>
                  {searchedData ? <>
                    {searchedData.length > 0 ?
                      <div style={{ gap: '5px' }} className="w-100 d-flex my-4 flex-col">
                        {searchedData?.map(data => <div className="border-circular w-100 bg-lightorange p-2 d-flex flex-col ">
                          <p className="fs-17 my-1" dangerouslySetInnerHTML={{ __html: `○ <b>${data.item.split('-')[0]}</b>${data.item.split('-')[1] ? ` - ${data.item.split('-')[1]}` : ''}${data.item.split('-')[2] ? ` - ${data.item.split('-')[2]}` : ''}${data.item.split('-')[3] ? ` - ${data.item.split('-')[3]}` : ''}${data.item.split('-')[4] ? ` - ${data.item.split('-')[4]}` : ''}` }}>
                          </p>
                          <div className="w-100 d-flex justify-content-end ">
                            <div style={{ width: '250px' }} className=" fs-14 bg-orange p-1 border-circular text-white">
                              {data.date}<br/> {data.meal}
                            </div>
                          </div>
                        </div>
                        )}
                      </div>
                      :
                      <p className="text text-center my-4" style={{ color: 'rgba(252,114,76,255)' }}>No any food item Found!</p>
                    }
                  </> :
                    <>
                      <p className="text text-center my-4" style={{ color: 'rgba(252,114,76,255)' }}>Searching...</p>
                    </>}


                 
                </>
              )}
              
              {duration === 'day' && (
                <>
                  <div style={{ gap: '10px', maxWidth: '400px' }} className="w-100 mx-auto mt-5 d-flex justify-content-center align-items-center flex-row">
                    {dataIndex > 0 && (
                      <div onClick={handlePreviousDay} style={{ width: '40px', height: '40px', borderRadius: '100%' }} className=" bg-orange d-flex justify-content-center align-items-center cursor-pointer ">
                        <FiChevronLeft style={{ fontSize: '25px' }} className="text-white" />
                      </div>
                    )}
                    <div className="theme-color" style={{ minWidth: '70%', textAlign: "center", fontSize: '20px' }}>
                      {menu[dataIndex].date}, {dayjs().format('YYYY')} | {menu[dataIndex].day}
                    </div>
                    {dataIndex < menu.length - 1 && (
                      <div onClick={handleNextDay} style={{ width: '40px', height: '40px', borderRadius: '100%' }} className=" bg-orange d-flex justify-content-center align-items-center cursor-pointer ">
                        <FiChevronRight style={{ fontSize: '25px' }} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div style={{ maxWidth: '700px', width: '100%' }} className=" my-5 text text-black mx-auto">
                    {menu[dataIndex].data?.map((foodInfo, index) => (
                      <>
                        <div key={index} onClick={() => setOpenMenu(openMenu === index ? null : index)} className={`w-100 d-flex cursor-pointer justify-content-between border-circular ${openMenu === index ? 'bg-orange text-white' : 'bg-lightdark text-black'} align-items-center p-2 border-bottom border-secondary`}>
                          <p className={`${openMenu === index ? 'text-white fs-20' : 'text-black'} text `}>{foodInfo.meal}</p>

                          {openMenu === index ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
                        </div>
                        {openMenu === index && (
                          <ul className="bg-lightorange p-3 border-circular" style={{ paddingLeft: '20px', marginBottom: '15px' }}>
                            {foodInfo.foods?.map((food, foodIndex) => (
                              <li key={foodIndex} style={{ fontSize: '16px' }} className="d-flex align-items-center justify-content-between">
                                <span dangerouslySetInnerHTML={{ __html: `○ <b>${food.split('-')[0]}</b>${food.split('-')[1] ? ` - ${food.split('-')[1]}` : ''}` }}></span>
                                {/* Rating System */}
                                <div className="rating-system d-flex">
                                  {/* Favorite Icon */}
                                  {showFavorites ? favorites.includes(food) ? (
                                    <FaHeart onClick={() => toggleFavorite(food)} style={{ color: 'red', cursor: 'pointer' }} />
                                  ) : (
                                    <FaRegHeart onClick={() => toggleFavorite(food)} style={{ cursor: 'pointer' }} />
                                  ): null}
                                  <div className="ml-3">
                                    {showFavorites && [1, 2, 3, 4, 5].map((star) => (
                                      ratings[food] >= star ? (
                                        <FaStar key={star} onClick={() => handleRating(food, star)} style={{ color: 'gold', cursor: 'pointer' }} />
                                      ) : (
                                        <FaRegStar key={star} onClick={() => handleRating(food, star)} style={{ cursor: 'pointer' }} />
                                      )
                                    ))}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (<p className="text text-center" style={{ color: 'rgba(252,114,76,255)' }}>Loading...</p>)}
      </div>
    </>
  );
}
