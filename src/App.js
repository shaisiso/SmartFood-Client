
import './App.css';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from './pages/MenuPage';
import NavbarRestaurant from './components/NavbarRestaurant';
import RestaurantImg from './assets/res4.png'
import Header from './components/Header';
import TableReservation from './pages/TableReservation';
import OrderPage from './pages/OrderPage';
import EmployeeLogin from './pages/EmployeeLogin';

function App() {
  return (
    <Router>
      <NavbarRestaurant />
      <div className="pt-1 " style={{ backgroundImage: `url(${RestaurantImg})`, backgroundPosition: 'top center',
               minHeight:'87vh', backgroundRepeat: 'repeat'  }}>
        <div className="container-fluid p-5">
          <Header />
          <Routes>
            <Route exact path="/"
              element={<Homepage />}>
            </Route>
            <Route path="/menu"
              element={<MenuPage />}>
            </Route>
            <Route path="/reservation"
              element={<TableReservation />}>
            </Route>
            <Route path="/order"
              element={<OrderPage />}>
            </Route>
            <Route path="/login"
              element={<EmployeeLogin />}>
            </Route>
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
