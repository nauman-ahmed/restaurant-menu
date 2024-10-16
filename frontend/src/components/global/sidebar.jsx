import { IoCloseOutline } from "react-icons/io5";
import { useLocation } from 'react-router-dom';

export default function Sidebar({ showSidebar, setShowSidebar }) {
    const location = useLocation();
    const path = location.pathname;
    
    const [tab, setTab] = useState(1)

    const menuItems = ['Menu', 'About Us']
    const studentItems = ['User Preferences', 'Manage Notifications', 'Favorites']
    const adminItems = ['Favorite Insights', 'User Preferences', 'Website Settings']

    return (
        <div style={{ width: '300px', height: '100vh', top: 0, zIndex: 10000 }} className={`bg-lightorange sidebar position-fixed left-0 p-1 py-3  ${showSidebar && !isAnimatingOut ? "animate__animated animate__slideInLeft animate__faster" : ""}
          ${isAnimatingOut ? "animate__animated animate__slideOutLeft animate__faster" : ""}`}>
          <div className=" d-flex flex-col align-items-center mx-3">
            {path === '/' && (
              <>
                <div style={{
                  fontSize: '22px'
                }} className=" my-1 mb-3 cursor-pointer w-100 w-100 d-flex justify-content-between  text text-black border-circular">
                  <a >
                    <img width={60} height={60} src="img/logo.png" alt="" />
                  </a>
                  <IoCloseOutline onClick={handleSidebarToggle} />

                </div>
                {menuItems?.map((item, index) => (
                  <div onClick={() => setTab(index)} className={`cursor-pointer w-100 p-2 ${tab === index ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                    ⦿ {item}
                  </div>
                ))}
              </>
            )}
            {path === '/student' && (
              <>
                <div style={{
                  fontSize: '22px'
                }} className=" my-1 mb-3 cursor-pointer w-100 w-100 d-flex justify-content-between  text text-black border-circular">
                  Hi, Student
                  <IoCloseOutline onClick={handleSidebarToggle} />

                </div>
                {studentItems?.map((item, index) => (
                  <div onClick={() => setTab(index)} className={`cursor-pointer w-100 p-2 ${tab === index ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                    ⦿ {item}
                  </div>
                ))}
              </>
            )}
            {path === '/admin' && (
              <>
                <div style={{
                  fontSize: '22px'
                }} className=" my-1 mb-3 cursor-pointer w-100 w-100 d-flex justify-content-between  text text-black border-circular">
                  Admin Dashboard
                  <IoCloseOutline onClick={handleSidebarToggle} />

                </div>
                {adminItems?.map((item, index) => (
                  <div onClick={() => setTab(index)} className={`cursor-pointer w-100 p-2 ${tab === index ? 'bg-orange  text-white' : 'text-black'}  text border-circular`}>
                    ⦿ {item}
                  </div>
                ))}
              </>
            )}



          </div>
        </div>
    )

}