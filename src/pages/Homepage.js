import React from 'react';

import HungryImg from '../assets/hungry.jpg'
import EmployeeImg from '../assets/employee.jpg'
import ReservationImg from '../assets/reservation.jpg'
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";


const Homepage = () => {
    return (
        <div className="row mt-5 gy-4 justify-content-center  pb-5">
            <div className="col col-6  col-sm-4  d-flex justify-content-center ">
                <Card className="text-center" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={HungryImg} alt="Hungry man" />
                    <Card.Body>
                        <Card.Title onClick>I'm Hungry</Card.Title>
                    </Card.Body>
                </Card>
            </div>
            <div className="col col-6  col-sm-4  d-flex  justify-content-center ">
                <Card className="text-center" style={{ width: '18rem' }}>
                    <Card.Link as ={Link} to="/reservation">
                        <Card.Img variant="top" src={ReservationImg} alt="Table Reservation" />
                        <Card.Body>
                            <Card.Title >Book a Table</Card.Title>
                        </Card.Body>
                    </Card.Link>
                </Card>
            </div>
            <div className="col col-6 col-sm-4  d-flex justify-content-center ">
                <Card className="text-center" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={EmployeeImg} alt="Employees" />
                    <Card.Body>
                        <Card.Title  >Employees Entrance</Card.Title>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default Homepage;