import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import Navbar from "../components/global/navbar";
import Menu from "../components/home/menu";
import Footer from "../components/global/footer";
import { useNavigate } from "react-router-dom";
import { setCurrentTab } from "../store/sidebarTabsSlice";


export default function FAQ() {
 
  const currentTab = useSelector((state) => state.sideBarTabs.currentTab);
  const credentials = useSelector((state) => state.credentials.credentials);
  
  const [studentItems, setStudentItems] = useState(['Student Dashboard', "Favorite Items", "User Preferences", "Newsletter", "Feedback Form"]);

  const [userDetails , setUserDetails] = useState(null)
  const [tab , setTab] = useState(0)
  
  
  const navigate = useNavigate()
  const dispatch = useDispatch();

  useEffect(() => { 
    if(credentials?.role == "Student"){
      setStudentItems(['Student Dashboard', "Favorite Items", "User Preferences", "Newsletter", "Feedback Form"])
    }
    if(credentials?.role == "Admin"){
      setStudentItems(['Dashboard', 'Rating Insights', 'Favorite Insights', 'Banner Timing', "Menus", "Add menu"])
    }
  }, [credentials])

  useEffect(() => { setUserDetails(credentials); setTab(currentTab)}, [credentials, currentTab])

  const redirectHandler = (index) => {
    dispatch(setCurrentTab({ tab: index }));

    if(credentials?.role == "Student"){
      navigate("/student")
    }
    if(credentials?.role == "Admin"){
      navigate("/admin")
    }

  }

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
      <section id="features" className="section">
        <div style={{ width: '300px', height: '100vh', top: 85, zIndex: 10 }} className="bg-lightorange sidebar sidebarPage position-fixed left-0 p-1 py-3">
          <div className=" d-flex flex-col align-items-center mx-3">
              <div style={{
                  fontSize : '22px'
              }} className=" my-1 mb-3 cursor-pointer w-100  text text-black border-circular"
              >
                  Hi, {userDetails?.fullName}
              </div>
              {studentItems.map((item, index) => 
                  <div onClick={()=> {redirectHandler(index)}} style={{ fontWeight: "bold" }} className={`cursor-pointer  w-100 p-2 ${tab === index ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                  ⦿ {item}
                  </div>
              )}
          </div>
        </div>
      </section>
    </>
  )
}
