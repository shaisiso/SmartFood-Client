
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef } from "react";
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from './pages/MenuPage';
import NavbarRestaurant from './components/NavbarRestaurant';
import RestaurantImg from './assets/backgrounds/restaurant.png'
import WoodImg from './assets/backgrounds/white_wood.jpg'
import Header from './components/Header';
import TableReservation from './pages/TableReservation';
import OrderPage from './pages/OrderPage';
import Login from './pages/Login';
import EmployeeHomepage from './pages/EmployeeHomepage';
import NotFound404 from './pages/NotFound404';
import QROrder from './pages/QROrder';
import WaitingListApprove from './pages/WaitingListApprove';
import MyReservations from './pages/MyReservations';
import MemberRegistration from './pages/MemberRegistration';
import About from './pages/About';
import Contact from './pages/Contact';
import MyOrders from './pages/MyOrders';

function App() {

  const [isEmployeeLogged, setIsEmployeeLogged] = useState(JSON.parse(window.localStorage.getItem("isEmployeeLogged")) || false)
  const [isMemberLogged, setIsMemberLogged] = useState(JSON.parse(window.localStorage.getItem("isMemberLogged")) || false)
  const [r, setR] = useState(false);
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
  });

  const handleEmployeeLogin = () => {
    window.localStorage.setItem("isEmployeeLogged", true);
    setIsEmployeeLogged(true)
  }
  const handleMemberLogin = () => {
    window.localStorage.setItem("isMemberLogged", true);
    setIsMemberLogged(true)
  }
  const handleLogout = () => {
    localStorage.clear();
    setIsEmployeeLogged(false);
    setIsMemberLogged(false);
  }

  const getNavbar = () => {
    if (isEmployeePage())
      return null
    else
      return <NavbarRestaurant isMemberLogged={isMemberLogged} handleLogout={handleLogout} isEmployeeLogged={isEmployeeLogged} render={onRender} />
  }
  const getHeader = () => {
    return isEmployeePage() ? null : <Header />
  }
  const isEmployeePage = () => {
    return window.location.pathname.includes('/employee') && isEmployeeLogged
  }
  const onRender = () => {
    setR(!r)
  }
  return (
    <Router>
      {getNavbar()}
      <div style={!isEmployeePage() ?
        {
          backgroundImage: `url(${RestaurantImg})`, backgroundPosition: 'top center',
          minHeight: '87vh', backgroundRepeat: 'repeat'
        } : { backgroundImage: `url(${WoodImg})` }}>
        <div className="container-fluid p-0">
          {getHeader()}
          <Routes>
            {/* <Route exact path="/" element={isEmployeeLogged ? <Navigate to="/employee" /> : <Homepage />} /> */}
            <Route exact path="/" element={<Homepage render={onRender} />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservation" element={<TableReservation />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user/reservations" element={<MyReservations />} />
            <Route path="/user/orders" element={<MyOrders />} />
            <Route path="/sign-up" element={<MemberRegistration />} />
            <Route path="/login/member" element={
              isMemberLogged || isEmployeeLogged ? <Navigate to="/" /> : <Login type="Members" handleMemberLogin={handleMemberLogin} />
            } />
            <Route path="/login/employee"
              element={
                isEmployeeLogged ?
                  <Navigate to="/employee" />
                  :
                  <Login handleEmployeeLogin={handleEmployeeLogin} type="Employees" />
              } />
            <Route path="employee/*"
              element={
                isEmployeeLogged ?
                  <EmployeeHomepage handleLogout={handleLogout} />
                  :
                  <Navigate to="/login/employee" />
              } />
            <Route path="/qr-order/*" element={<QROrder />} />
            <Route path="/waiting-list/*" element={< WaitingListApprove />} />
            {/* {isEmployeeLogged ?
              <Route path="*" exact={true} element={<EmployeeHomepage handleLogout={handleLogout} />} />
              :
              <Route path="*" exact={true} element={<NotFound404 />} />
            } */}
            <Route path="*" exact={true} element={<NotFound404 />} />

          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
