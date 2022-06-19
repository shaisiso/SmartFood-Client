import React from 'react';
import SmartFood from '../assets/SmartFood.png';

const Header = () => {
    return (
        <header className="row text-center justify-content-center">
            <div className="text-center ">
                <img src={SmartFood} className="img-fluid" alt="SmartFood" />
            </div>
        </header>
    );
};

export default Header;