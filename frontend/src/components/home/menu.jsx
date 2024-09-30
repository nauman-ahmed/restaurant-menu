import { useEffect, useState } from "react"
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import dayjs from 'dayjs';
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Staurday', 'Sunday']
export default function Menu() {
  const [duration, setDuration] = useState('day')
  const [dataIndex, setDataIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState(0)
  const [selectedDay, setSelectedDay] = useState('Monday')
  // Function to go to the next day
  const handleNextDay = () => {
    setOpenMenu(0)
    setDataIndex(dataIndex + 1)
  };
  const [menu, setMenu] = useState(null)
  const getData = async () => {
    await axios.get(backendUrl + '/scrape').then(res => {
      localStorage.setItem('menuData', JSON.stringify(res.data))
      console.log(res.data);
      setMenu(res.data)

    }).catch(err => console.log(err))
  }
  useEffect(() => {
    if (localStorage.getItem('menuData')) {
      console.log(JSON.parse(localStorage.getItem('menuData')));

      setMenu(localStorage.getItem('menuData') && JSON.parse(localStorage.getItem('menuData')))
    } else {
      getData()
    }
  }, [])
  // Function to go to the previous day
  const handlePreviousDay = () => {
    setOpenMenu(0)
    setDataIndex(dataIndex - 1)

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
          <div className=" w-100 d-flex flex-col gap-2 border  p-2 border-circular">
            <div style={{ gap: '20px' }} className="w-100 d-flex justify-content-center align-items-center flex-row">
              <div onClick={() => setDuration('day')} className={`p-2 text-center dayWeek-option ${duration === 'day' ? "dayWeek-selected" : ''} border-circular`}>
                DAY
              </div>
              <div onClick={() => setDuration('week')} className={` p-2 text-center  ${duration === 'week' ? "dayWeek-selected" : ''} dayWeek-option border-circular`}>
                WEEK
              </div>
            </div>
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
                        <p className={`${openMenu === index ? 'text-white' : 'text-black'} text `}>{foodInfo.meal}</p>

                        {openMenu === index ? <FaChevronUp className="cursor-pointer" /> :
                          <FaChevronDown className="cursor-pointer" />
                        }
                      </div>
                      {openMenu === index && (
                        <ul className="bg-lightorange p-3 border-circular" style={{ paddingLeft: '20px', marginBottom: '15px' }}>
                          {foodInfo.foods?.map((food, foodIndex) => (
                            <li key={foodIndex} style={{ fontSize: '16px' }}
                              dangerouslySetInnerHTML={{ __html: `○ ${food}` }} // Using dangerouslySetInnerHTML
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
                              dangerouslySetInnerHTML={{ __html: `○ ${food}` }} // Using dangerouslySetInnerHTML
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
        ) : (<p className="text text-center" style={{ color : 'orange'}}> Loading...</p>)}

      </div>
      {/* <!-- End Row --> */}

      {/* <!-- Cool Fetatures Section End -->  */}
    </>
  )
}
