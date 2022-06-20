
import './App.css';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from './pages/MenuPage';
import NavbarRes from './components/NavbarRes';
import RestaurantImg from './assets/res4.png'
import Header from './components/Header';
function App() {
  return (
    <Router>
      <NavbarRes />
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
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
