import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthService from '../services/AuthService';
import { cleanAll } from '../utility/Utils';


const NavbarRestaurant = (props) => {
    const [active, setActive] = useState(0);
    const handleSelect = (eventKey) => setActive(eventKey);
    const navigate = useNavigate()
    const onClickLogout = e => {
        e.preventDefault();
        AuthService.logout()
        props.handleLogout()
        navigate('/')
        cleanAll()
    }
    return (
        <Navbar className="navbarclient" collapseOnSelect expand="lg" bg="dark" variant="dark" onSelect={handleSelect}>
            <Container>
                <Nav.Link className="navbarclient" eventKey="0" as={Link} to="/">
                    <Navbar.Brand style={{ fontFamily: 'Pacifico' }}>Smart Food</Navbar.Brand>
                </Nav.Link>
                <Navbar.Toggle className="navbarclient-nav ms-auto" />
                <Navbar.Collapse >
                    <Nav className="navbarclient me-auto" activeKey={active}>
                        <Nav.Link eventKey="1" as={Link} to="/reservation">Book a Table</Nav.Link>
                        <Nav.Item>
                            <Nav.Link eventKey="2" as={Link} to="/order">Order Now</Nav.Link>
                        </Nav.Item>
                        {
                            props.isMemberLogged ?
                                <Nav.Item >
                                    <Nav.Link eventKey="8" as={Link} to="/user/reservations">My Reservations</Nav.Link>
                                </Nav.Item>
                                : null
                        }
                        {
                            props.isMemberLogged ?
                                <Nav.Item >
                                    <Nav.Link eventKey="9" as={Link} to="/user/orders">My Orders</Nav.Link>
                                </Nav.Item>
                                : null
                        }
                        <Nav.Item>
                            <Nav.Link eventKey="3" as={Link} to="/menu">Menu</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="4" as={Link} to="/about">About</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="5" as={Link} to="/contact">Contact</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {
                        props.isMemberLogged ?
                            <Nav className="navbarclient-nav ms-auto mb-2 mb-lg-0" activeKey={active}>
                                <Nav.Item >
                                    <Nav.Link eventKey="7" onClick={onClickLogout}>Logout</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            :
                            <Nav className="navbarclient-nav ms-auto mb-2 mb-lg-0" activeKey={active}>
                                <Nav.Item>
                                    <Nav.Link eventKey="6" as={Link} to="/login/member">Members Login</Nav.Link>
                                </Nav.Item>
                                <Nav.Item >
                                    <Nav.Link eventKey="7" as={Link} to="/login/employee" > Employee Login</Nav.Link>
                                </Nav.Item>
                            </Nav>
                    }

                </Navbar.Collapse>

            </Container>
        </Navbar >
    );
};

export default NavbarRestaurant;