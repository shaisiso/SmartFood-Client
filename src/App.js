
import './App.css';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from './pages/MenuPage';
import NavbarRes from './components/NavbarRes';
import RestaurantImg from './assets/res3.png'
import Header from './components/Header';
function App() {
  return (
    <Router>
      <NavbarRes />
      <div className="pt-1 bg-image-full" style={{ backgroundImage: `url(${RestaurantImg})`, minHeight: '87vh' }}>
        <div className="container-fluid pt-5 ">
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
