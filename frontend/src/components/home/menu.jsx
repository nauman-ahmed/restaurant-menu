import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'; 
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaChevronDown, FaChevronUp, FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa6";  // Import star icons
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import { addFavorite, getUserFavorite, removeFavorite } from "../../APIs/favourite";
import { getFoodNames } from "../../utilities";
import { getBannerTiming } from "../../APIs/banner"
import { scrapeMenus, fetchMenus, updateMenusApi } from '../../store/menuSlice';
import { Button } from 'reactstrap';
import MenuModal from "../global/menuModal";
import { setCurrentTab } from '../../store/sidebarTabsSlice'
import { useNavigate } from "react-router-dom";

const dayToFetch = 1 // 0 is Sunday 6 is Saturday

export default function Menu({ handleRating, ratings, getUserFavoriteAndRatingsHandler, adminLogin }) {

  const credentials = useSelector((state) => state.credentials.credentials);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { loading, menus, error } = useSelector((state) => state.menus);

  const [menuUpdateModal, setMenuUpdateModal] = useState(false)
  const [buttonText, setButtonText] = useState(true);
  const [duration, setDuration] = useState('day');
  const [dataIndex, setDataIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState([0]);
  const [searchText, setSearchText] = useState('');
  const [searchedData, setSearchedData] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [timing, setTiming] = useState({
    startTimeOne: '',
    endTimeOne: '',
    startTimeTwo: '',
    endTimeTwo: '',
    startTimeText: '',
    endTimeText: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const daysPerPage = 7;
  const endIndex = currentPage * daysPerPage;
  const startIndex = endIndex - daysPerPage;

  const gatBannerTimingHandler = async () => {
    
    const { data, status} = await getBannerTiming(null)
    setTiming(data)

  }

  const isWithinTimeRange = (startTime, endTime) => {
   
    const current = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return current >= start && current <= end;

  };

  useEffect(() => {
    const checkTimeForBanner = () => {
      const isMorningBannerTime = isWithinTimeRange(timing.startTimeOne, timing.startTimeTwo);
      const isEveningBannerTime = isWithinTimeRange(timing.endTimeOne, timing.endTimeTwo);

      if (isMorningBannerTime) {
        if(!showBanner){
          setShowBanner(true);
          setBannerMessage(timing.startTimeText);
        }
      } else if (isEveningBannerTime) {
        if(!showBanner){
          setShowBanner(true);
          setBannerMessage(timing.endTimeText);
        }
      } else {
        if(showBanner){
          setShowBanner(false);
          }
      }
    };

    // Initial check and set interval to check every minute
    
    let intervalId;
    if(timing.startTimeOne){
      checkTimeForBanner();
      intervalId = setInterval(checkTimeForBanner, 1000); // Check every minute
    }else{
      gatBannerTimingHandler()
    }

    return () => clearInterval(intervalId); // Clean up on component unmount

  }, [timing]);

  const handleNextDay = () => {
    setOpenMenu([0]);
    setDataIndex(dataIndex + 1);
  };

  const handlePreviousDay = () => {
    setOpenMenu([0]);
    setDataIndex(dataIndex - 1);
  };

  const handleNextWeek = () => {
    setOpenMenu([0]);
    setCurrentPage(prevStat => prevStat + 1)
  };

  const handlePreviousWeek = () => {
    setOpenMenu([0]);
    setCurrentPage(prevStat => prevStat - 1)
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
      getUserFavoriteAndRatingsHandler()
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getUserFavoriteHandler = async () => {
    try {
      
      const { data, status } = await getUserFavorite();
      setFavorites(getFoodNames(data));
      
    } catch (error) {
      console.log("Error", error);
    } 
  };

  useEffect(() => {
    if(new Date().getDay() === dayToFetch){
      dispatch(scrapeMenus());
    }else{
      dispatch(fetchMenus());
    }
  }, [dispatch]);

  useEffect(() => {
    const index = menus.findIndex(obj => new Date(obj.date).getDate() == new Date().getDate());
    setDataIndex(index == -1 ? 6 : index);
    setCurrentPage(menus.length / 7)
  }, [menus]);

  useEffect(() => {
    
    if (credentials?.role === 'Student') {
      setShowFavorites(true);
      getUserFavoriteHandler();
    } 
    if (credentials?.role === 'Admin') {
      navigate("/admin")
    } 
  }, []);

  const applySearch = () => {
    if (searchText?.length > 0) {
      console.log("Chala")
      setSearching(true);
      setDuration('');
      const searchingData = [];
      
      menus?.slice(menus.length - 7, menus.length).forEach(mainobj => {
      console.log("Chala 2")
      mainobj.data.forEach(mealObj => {
          mealObj.foods.forEach(item => {
            if (item.toLowerCase().includes(searchText?.toLowerCase())) {
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

  const onUpdate = (updatedMenu) => {
    dispatch(updateMenusApi(updatedMenu))
    dispatch(fetchMenus());
  }

  const collapseHandler = () => {
    if(buttonText){
      setOpenMenu([0,1,2,3])
      setButtonText(!buttonText)
    }else{
      setOpenMenu([])
      setButtonText(!buttonText)
    }
  }

  return (
    <>
      {/* {menuUpdateModal && !loading &&
        <MenuModal 
          menuUpdateModal={menuUpdateModal} 
          setMenuUpdateModal={setMenuUpdateModal} 
          data={menus}
          onUpdate={onUpdate}
        />
      } */}
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

        {menus ? (
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

              <div style={{ gap: '20px' }} className="w-100 d-flex justify-content-center align-items-center flex-row">
                <div onClick={() => {
                  setDuration('day')
                  setSearchText('')
                  setSearching(false)
                  setSearchedData(null)
                } } className={`p-2 text-center dayWeek-option ${duration === 'day' ? "dayWeek-selected" : ''} border-circular`}>
                  DAY
                </div>
                <div onClick={() => {
                  setDuration('week')
                  setSearching(false);
                  setSearchedData(null)
                  setSearchText('')
                }} className={` p-2 text-center  ${duration === 'week' ? "dayWeek-selected" : ''} dayWeek-option border-circular`}>
                  WEEK
                </div>
              </div>
              <div className="d-flex justify-content-center mt-2 mb-4 w-100">
                <Button className="mx-2 dayWeek-selected" onClick={collapseHandler} >{buttonText ? "Collapse" : "Uncollapse"}</Button>
              </div>
              {searching && (
                <>
                  {searchedData ? <>
                    {searchedData.length > 0 ?
                      <div style={{ gap: '5px' }} className="w-100 d-flex my-4 flex-col">
                        {searchedData?.map((data, index) => <div key={index} className="border-circular w-100 bg-lightorange p-2 d-flex flex-col ">
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
                      {menus[dataIndex]?.date}, {dayjs().format('YYYY')} | {menus[dataIndex]?.day}
                    </div>
                    {dataIndex < menus.length - 1 && (
                      <div onClick={handleNextDay} style={{ width: '40px', height: '40px', borderRadius: '100%' }} className=" bg-orange d-flex justify-content-center align-items-center cursor-pointer ">
                        <FiChevronRight style={{ fontSize: '25px' }} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div style={{ maxWidth: '700px', width: '100%' }} className=" my-5 text text-black mx-auto">
                    {menus[dataIndex]?.data?.map((foodInfo, index) => (
                      <>
                        <div key={index} onClick={() => openMenu.includes(index) ? setOpenMenu((prevOpenMenu) => prevOpenMenu.filter((item) => item !== index)) : setOpenMenu((prevStat) => [...prevStat,index])} className={`w-100 d-flex cursor-pointer justify-content-between border-circular ${openMenu.includes(index) ? 'bg-orange text-white' : 'bg-lightdark text-black'} align-items-center p-2 border-bottom border-secondary`}>
                          <p className={`${openMenu.includes(index) ? 'text-white fs-20' : 'text-black'} text `}>{foodInfo.meal}</p>
                          {openMenu.includes(index) ? <FaChevronUp className="cursor-pointer" /> : <FaChevronDown className="cursor-pointer" />}
                        </div>
                        {openMenu.includes(index) && (
                          <ul className="bg-lightorange p-3 border-circular" style={{ paddingLeft: '20px', marginBottom: '15px' }}>
                            {foodInfo.foods?.map((food, foodIndex) => (
                              <li key={foodIndex} style={{ fontSize: '16px', display: "flex !important", alignItems: "start !important" }} className="d-flex align-items-center justify-content-between">
                                <span style={showFavorites ? { width: "60%" } : { width: "100%" }} dangerouslySetInnerHTML={{ __html: `○ <b>${food.split('-')[0]}</b>${food.split('-')[1] ? ` - ${food.split('-')[1]}` : ''}` }}></span>
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

              {duration === 'week' && (
                <>
                  <div style={{ gap: '20px', }} className="w-100 mt-5 d-flex justify-content-center flex-wrap align-items-center flex-row">
                    {startIndex > 0 && (
                      <div onClick={handlePreviousWeek} style={{ width: '40px', height: '40px', borderRadius: '100%' }} className=" bg-orange d-flex justify-content-center align-items-center cursor-pointer ">
                        <FiChevronLeft style={{ fontSize: '25px' }} className="text-white" />
                      </div>
                    )}
                    {menus?.slice(startIndex, endIndex).map((obj, index) => (
                      <div style={{ borderRadius: '40px', }} onClick={() => {
                        setOpenMenu([0])
                      }} className={`p-2 text-center day-option ${new Date(obj.date).getDate() == new Date().getDate() ? "dayWeek-selected" : ''} `}>
                        {obj.day}
                      </div>
                    ))}
                    {endIndex < menus.length && (
                      <div onClick={handleNextWeek} style={{ width: '40px', height: '40px', borderRadius: '100%' }} className=" bg-orange d-flex justify-content-center align-items-center cursor-pointer ">
                        <FiChevronRight style={{ fontSize: '25px' }} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div style={{ maxWidth: '700px', width: '100%' }} className=" my-5 text text-black mx-auto">
                    {menus[dataIndex].data?.map((foodInfo, index) => (
                      <>
                        <div key={index} onClick={() => {
                          openMenu.includes(index) ? setOpenMenu((prevOpenMenu) => prevOpenMenu.filter((item) => item !== index)) : setOpenMenu((prevStat) => [...prevStat,index])
                        }} className={`w-100 d-flex cursor-pointer justify-content-between border-circular ${openMenu.includes(index) ? 'bg-orange text-white' : 'bg-lightdark text-black'}   align-items-center p-2 border-bottom border-secondary`}>
                          <p className={`${openMenu.includes(index) ? 'text-white' : 'text-black'} text `}>{foodInfo.meal}</p>

                          {openMenu.includes(index) ? <FaChevronUp className="cursor-pointer" /> :
                            <FaChevronDown className="cursor-pointer" />
                          }
                        </div>
                        {openMenu.includes(index) && (
                          <ul className="bg-lightorange p-3 border-circular" style={{ paddingLeft: '20px', marginBottom: '15px' }}>
                            {foodInfo.foods?.map((food, foodIndex) => (
                              <li key={foodIndex} style={{ fontSize: '16px', display: "flex !important", alignItems: "start !important" }}
                              className="d-flex align-items-center justify-content-between"
                              >
                                <span style={showFavorites ? { width: "60%" } : { width: "100%" }} dangerouslySetInnerHTML={{ __html: `○ <b>${food.split('-')[0]}</b>${food.split('-')[1] ? ` - ${food.split('-')[1]}` : ''}${food.split('-')[2] ? ` - ${food.split('-')[2]}` : ''}${food.split('-')[3] ? ` - ${food.split('-')[3]}` : ''}${food.split('-')[4] ? ` - ${food.split('-')[4]}` : ''}` }} /> 
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
                  </div >
                </>
              )}

            </div>
          </>
        ) : (<p className="text text-center" style={{ color: 'rgba(252,114,76,255)' }}>Loading...</p>)}
      </div>
    </>
  );
}
