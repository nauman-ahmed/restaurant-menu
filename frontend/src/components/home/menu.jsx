import { useEffect, useState } from "react"
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import dayjs from 'dayjs';
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Staurday', 'Sunday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemer', 'December']
export default function Menu() {
  const [duration, setDuration] = useState('day')
  const [dataIndex, setDataIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [searchedData, setSearchedData] = useState(null)
  const [searching, setSearching] = useState(false)
  // Function to go to the next day
  const handleNextDay = () => {
    setOpenMenu(0)
    setDataIndex(dataIndex + 1)
  };
  const [menu, setMenu] = useState(null)
  const getData = async () => {
    await axios.get(backendUrl + '/scrape').then(res => {
      localStorage.setItem('menuData', JSON.stringify(res.data))
      const index = res.data.findIndex(obj => obj.date.split(' ')[1] == new Date().getDate())
      setDataIndex(index)
      setMenu(res.data)

    }).catch(err => console.log(err))
  }
  useEffect(() => {
    if (localStorage.getItem('menuData')) {
      const menuData = JSON.parse(localStorage.getItem('menuData'))
      if (menuData?.some(obj => obj.date.includes(months[new Date().getMonth()])) && menuData?.some(obj => obj.date.split(' ')[1] === new Date().getDate)) {
        const index = menuData.findIndex(obj => obj.date.split(' ')[1] == new Date().getDate())
        setDataIndex(index)
        setMenu(localStorage.getItem('menuData') && JSON.parse(localStorage.getItem('menuData')))
      } else {
        getData()
      }
    } else {
      getData()
    }
  }, [])
  // Function to go to the previous day
  const handlePreviousDay = () => {
    setOpenMenu(0)
    setDataIndex(dataIndex - 1)

  };
  console.log(menu);

  const applySearch = () => {
    if (searchText?.length > 0) {
      setSearching(true)
      setDuration('')
      const searchingData = [];
      menu?.forEach(mainobj => {
        mainobj.data.forEach(mealObj => {
          mealObj.foods.forEach(item => {
            if (item.toLowerCase().split(' ').some(itemWord => itemWord?.startsWith(searchText?.toLowerCase()))) {
              searchingData.push({
                date: mainobj.date + ' | ' + mainobj.day,
                meal: mealObj.meal,
                item: item
              })
            }
          })
        })
      })
      setSearchedData(searchingData)
   
    }
  }

  const handleKeyDown = (event) => {
    console.log(`Key pressed: ${event.key}`);
    if (event.key === 'Enter') {
      if (searchText?.length > 0) {
        applySearch()
      }
    }
  };

  return (
    <>
      {/* <!-- Cool Fetatures Section Start --> */}

      {/* <!-- Start Row --> */}
      <div>


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


        {/* <!-- End Row --> */}
        {/* <!-- Start Row --> */}

        {menu ? (
          <>
            <div className=" w-100 d-flex flex-col gap-2 border  p-2 border-circular">
              <div className="d-flex justify-content-end mt-2 mb-4 w-100">
                <input onKeyDown={handleKeyDown} value={searchText} onChange={(e) => setSearchText(e.target.value)} className="searchInput border-circular" placeholder="Search here" type="text" />
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
                    <div className="theme-color" style={{ minWidth: '70%', textAlign: "center", fontSize: '20px' }}>{menu[dataIndex].date}, {dayjs().format('YYYY')} | {menu[dataIndex].day}</div>
                    {dataIndex < menu.length - 1 && (
                      <div onClick={handleNextDay} style={{ width: '40px', height: '40px', borderRadius: '100%' }} className=" bg-orange d-flex justify-content-center align-items-center cursor-pointer ">
                        <FiChevronRight style={{ fontSize: '25px' }} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div style={{ maxWidth: '700px', width: '100%' }} className=" my-5 text text-black mx-auto">
                    {menu[dataIndex].data?.map((foodInfo, index) => (
                      <>
                        <div key={index} onClick={() => {
                          setOpenMenu(openMenu === index ? null : index)
                        }} className={`w-100 d-flex cursor-pointer justify-content-between border-circular ${openMenu === index ? 'bg-orange text-white' : 'bg-lightdark text-black'}   align-items-center p-2 border-bottom border-secondary`}>
                          <p className={`${openMenu === index ? 'text-white fs-20' : 'text-black'} text `}>{foodInfo.meal}</p>

                          {openMenu === index ? <FaChevronUp className="cursor-pointer" /> :
                            <FaChevronDown className="cursor-pointer" />
                          }
                        </div>
                        {openMenu === index && (
                          <ul className="bg-lightorange p-3 border-circular" style={{ paddingLeft: '20px', marginBottom: '15px' }}>
                            {foodInfo.foods?.map((food, foodIndex) => (
                              <li key={foodIndex} style={{ fontSize: '16px' }}
                                dangerouslySetInnerHTML={{ __html: `○ <b>${food.split('-')[0]}</b>${food.split('-')[1] ? ` - ${food.split('-')[1]}` : ''}${food.split('-')[2] ? ` - ${food.split('-')[2]}` : ''}${food.split('-')[3] ? ` - ${food.split('-')[3]}` : ''}${food.split('-')[4] ? ` - ${food.split('-')[4]}` : ''}` }} // Using dangerouslySetInnerHTML
                              />
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
                    {menu.map((obj, index) => (
                      <div style={{ borderRadius: '40px', }} onClick={() => {
                        setOpenMenu(0)
                        setDataIndex(index)
                      }} className={`p-2 text-center day-option ${dataIndex === index ? "dayWeek-selected" : ''} `}>
                        {obj.day}
                      </div>
                    ))}

                  </div>
                  <div style={{ maxWidth: '700px', width: '100%' }} className=" my-5 text text-black mx-auto">
                    {menu[dataIndex].data?.map((foodInfo, index) => (
                      <>
                        <div key={index} onClick={() => {
                          setOpenMenu(openMenu === index ? null : index)
                        }} className={`w-100 d-flex cursor-pointer justify-content-between border-circular ${openMenu === index ? 'bg-orange text-white' : 'bg-lightdark text-black'}   align-items-center p-2 border-bottom border-secondary`}>
                          <p className={`${openMenu === index ? 'text-white' : 'text-black'} text `}>{foodInfo.meal}</p>

                          {openMenu === index ? <FaChevronUp className="cursor-pointer" /> :
                            <FaChevronDown className="cursor-pointer" />
                          }
                        </div>
                        {openMenu === index && (
                          <ul className="bg-lightorange p-3 border-circular" style={{ paddingLeft: '20px', marginBottom: '15px' }}>
                            {foodInfo.foods?.map((food, foodIndex) => (
                              <li key={foodIndex} style={{ fontSize: '16px' }}
                                dangerouslySetInnerHTML={{ __html: `○ <b>${food.split('-')[0]}</b>${food.split('-')[1] ? ` - ${food.split('-')[1]}` : ''}${food.split('-')[2] ? ` - ${food.split('-')[2]}` : ''}${food.split('-')[3] ? ` - ${food.split('-')[3]}` : ''}${food.split('-')[4] ? ` - ${food.split('-')[4]}` : ''}` }} // Using dangerouslySetInnerHTML
                              />
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


        ) : (<p className="text text-center" style={{ color: 'rgba(252,114,76,255)' }}> Loading...</p>)}

      </div>
      {/* <!-- End Row --> */}

      {/* <!-- Cool Fetatures Section End -->  */}
    </>
  )
}
