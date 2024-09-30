
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import { IoCloseOutline } from "react-icons/io5";
import { Col, Row } from "reactstrap";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";


export default function Navbar({ page }) {
  const [tab, setTab] = useState(1)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [loginModal, setLoginModal] = useState(false)
  const navigate = useNavigate()
  const [path, setPath] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [theme, setTheme] = useState(document.body.getAttribute('data-theme'))
  useEffect(() => {
    setPath(window.location.pathname);
  }, [window.location.pathname]);
  const handleSidebarToggle = () => {
    if (showSidebar) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsAnimatingOut(false);
        setShowSidebar(false);
      }, 500); // The timeout should match the duration of the slide-out animation
    } else {
      setShowSidebar(true);
    }
  }
  const menuItems = ['Menu', 'About Us']
  const studentItems = ['User Preferences', 'Manage Notifications', 'Favorites']
  const adminItems = ['Favorite Insights', 'User Preferences', 'Website Settings']
  const toggleTheme = () => {
    const currentTheme = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
    setTheme(document.body.getAttribute('data-theme'))
  }
  



  return (
    <>

      <nav style={{ backgroundColor: 'black' }} className="navbar navbar-expand-md bg-inverse fixed-top scrolling-navbar">
        <div style={{ height: '75px' }} className="container">
          <a className="navbar-brand">
            <img width={90} height={90} src="img/logo.png" alt="" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <img src={"icons/menu.svg"} />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto w-100 justify-content-end">
              <li className="nav-item">
                <a className="nav-link page-scroll cursor-pointer" onClick={() => navigate('/')}>
                  Menu
                </a>
              </li>


              <li className="nav-item">
                <a className="nav-link page-scroll cursor-pointer" >
                  About Us
                </a>
              </li>
              <li className="nav-item">
                {page ?
                  <a onClick={() => {
                    localStorage.removeItem('credentials')
                    navigate('/')
                  }} className="btn btn-singin text-white" >
                    Log Out
                  </a>
                  :
                  <a onClick={() => setLoginModal(true)} className="btn btn-singin text-white" >
                    Log In
                  </a>
                }
              </li>
              <li className="nav-item">
                <div onClick={toggleTheme} style={{ width: '40px', height: '40px', borderRadius: '100px' }} className='ml-2 cursor-pointer'>
                  {theme === 'dark' ?
                    <CiLight style={{ fontSize: '40px', color: 'white' }} />
                    : <CiDark style={{ fontSize: '40px', color: 'white' }} />
                  }
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>


      <nav style={{ backgroundColor: 'black' }} className=" fixed-top navbar-mobile scrolling-navbar">
        <div style={{ height: '75px' }} className="container d-flex justify-content-between align-items-center">
          <div>

            <button onClick={handleSidebarToggle}
              className="navbar-toggler"

            >
              <img src={"icons/menu.svg"} />
            </button>
            <a >
              <img width={60} height={60} src="img/logo.png" alt="" />
            </a>
          </div>








          <div className="nav-item d-flex flex-row gap-2">
            {page ?
              <a style={{
                background: 'orange',
                color: 'white',
                padding: '8px 10px',
                marginLeft: '30px',
                boxShadow: '0px 8px 9px 0px rgba(96, 94, 94, 0.17)'

              }} onClick={() => {
                localStorage.removeItem('credentials')
                navigate('/')
              }} className="btn " >
                Log Out
              </a>
              :
              <a style={{
                background: 'orange',
                color: 'white',
                padding: '8px 10px',
                marginLeft: '30px',
                boxShadow: '0px 8px 9px 0px rgba(96, 94, 94, 0.17)'

              }} onClick={() => setLoginModal(true)} className="btn" >
                Log In
              </a>
            }
            <div onClick={toggleTheme} style={{ width: '40px', height: '40px', borderRadius: '100px' }} className='ml-2 cursor-pointer'>
              {theme === 'dark' ?
                <CiLight style={{ fontSize: '40px', color: 'white' }} />
                : <CiDark style={{ fontSize: '40px', color: 'white' }} />
              }
            </div>
          </div>
        

        </div>
      </nav>
      {showSidebar && (

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

      )}
      <Modal isOpen={loginModal} centered={true} size="md" className=''  >
        <ModalHeader><p style={{
          fontSize: '20px',
          fontWeight: 'bold'
        }} className=' w-100 text-black fw-bold text-center theme-color'>Log In to your Account</p></ModalHeader>
        <Form onSubmit={(e) => {
          e.preventDefault()
          if (username === 'student' && password === 'abc123ABC') {
            localStorage.setItem('credentials', JSON.stringify({ username, password }))
            navigate('/student')
          } else if (username === 'admin' && password === 'abc123ABC') {
            localStorage.setItem('credentials', JSON.stringify({ username, password }))
            navigate('/admin')
          } else {
            alert('Wrong Credentials')
          }
        }}>


          <ModalBody className='p-5'>
            <Row>
              <Col xs='12' className='my-2' >
                <div style={{
                  fontSize: '16px',
                  color: 'gray'
                }} className="label theme-color">Username</div>
                <input value={username} onChange={(e) => setUserName(e.target.value)} type="text" name="userName" className='searchInput border-circular w-100 bg-white' required />
              </Col>
              <Col xs='12' className='my-2' >
                <div style={{
                  fontSize: '16px',
                  color: 'gray'
                }} className="label theme-color">Password</div>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} name="userName" className='searchInput border-circular w-100 bg-white' required />
              </Col>

            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type='submit' style={{ backgroundColor: 'orange' }}
            //  onClick={!updating && handleUpdateUserData}
            >
              {/* {updating ? (
              <div className='w-100'>
                <div class="smallSpinner mx-auto"></div>
              </div>
            ) : ( */}
              LOG IN
              {/* )} */}
            </Button>
            <Button onClick={() => setLoginModal(false)} color="danger">
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}
