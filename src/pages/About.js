import React from 'react';
import AboutImg from '../assets/img/about.png'

const About = () => {
    return (
        <div className="pb-5">
            <div className="mx-5 p-5 pt-3" style={{ background: '#ffffffc0' }}>
                <h1 className='App mt-3  hRestaurant'><b><u>About SmartFood</u></b></h1>
                <div className="row mx-auto">
                    <h3 className="col col-xl-9 col-12 my-auto " style={{ fontFamily: 'monospace' }}>
                        SmartFood was devloped by Shai Siso and Shahar Avital as a final project in our degree. <br />
                        There are many challenges in managing a restaurant. From the daily operation of the
                        restaurant to the customer external services. So far, the overall management of a
                        restaurant can be maintained by several different systems (restaurant operation,
                        deliveries, shifts management and more). Our goal is to combine all those features
                        into one efficient and convenient system that benefit both the restaurant and its
                        customers. In addition, our system have new features such as table reservation /
                        entering a waiting list automatically, and independent ordering at the restaurant
                        through a barcode scan and without waiting to a waiter. During the development we
                        used advanced technologies that allowed us to establish a user-friendly and up-to-date
                        interface.
                        <br/>
                        <br/>
                        <b><u>Github Source Code</u>:</b>
                        <div className='h4 mt-2'> 
                            <a href="https://github.com/shaisiso/SmartFood-Server" target="_blank" rel="noopener noreferrer">
                            Smartfood Server</a> </div>
                        <div className='h4'>
                            <a href="https://github.com/shaisiso/SmartFood-Client" target="_blank" rel="noopener noreferrer">
                            Smartfood Client</a> </div>
                        <b><u>Documents</u>:</b>
                        <div className='h4'>
                            <a href="https://s3.eu-central-1.amazonaws.com/smartfood-project.link/Capstone+Final+Project+Book+-Smartfood.pdf" target="_blank" rel="noopener noreferrer">
                                Project  Book
                            </a>
                        </div>
                        <div className='h4'>
                            <a href="https://s3.eu-central-1.amazonaws.com/smartfood-project.link/Capstone+Final+Project+Presentation-Smartfood.pptx" target="_blank" rel="noopener noreferrer">
                                Project  Presentation
                            </a>
                        </div>
                    </h3>
                    <div className="col col-xl-3 col-12 my-auto">
                        <img className="img-fluid" src={AboutImg} alt="About" />

                    </div>
                </div>
            </div>
        </div>

    );
};

export default About;