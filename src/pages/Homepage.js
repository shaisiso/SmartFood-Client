import React from 'react';

import HungryImg from '../assets/hungry.jpg'
import EmployeeImg from '../assets/employee.webp'
import ReservationImg from '../assets/reservation.jpg'
import { Card, Button } from 'react-bootstrap';
//import Card from '../components/Card';

const Homepage = () => {
    return (
        <div className="row gy-4 justify-content-center  pb-5">
            <div className="col col-6  col-sm-4  d-flex justify-content-center ">
                <Card className="text-center" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={HungryImg} />
                    <Card.Body>
                        <Card.Title >I'm Hungry</Card.Title>
                    </Card.Body>
                </Card>
            </div>
            <div className="col col-6  col-sm-4  d-flex justify-content-center ">
                <Card className="text-center" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={ReservationImg} />
                    <Card.Body>
                        <Card.Title >Book a Table</Card.Title>
                    </Card.Body>
                </Card>
            </div>
            <div className="col col-6 col-sm-4  d-flex justify-content-center ">
                <Card className="text-center" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={EmployeeImg} />
                    <Card.Body>
                        <Card.Title >Employees entrance</Card.Title>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default Homepage;