import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';


const NavbarRestaurant = () => {
    const [active, setActive] = useState(0);
    const handleSelect = (eventKey) => setActive(eventKey);
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" onSelect={handleSelect}>
            <Container>
                <Nav.Link eventKey="0" as={Link} to="/">
                    <Navbar.Brand style={{ fontFamily: 'Pacifico' }}>Smart Food</Navbar.Brand>
                </Nav.Link>
                <Navbar.Toggle className="navbar-nav ms-auto" />
                <Navbar.Collapse >
                    <Nav className="me-auto" activeKey={active}>
                        <Nav.Link eventKey="1" as={Link} to="/reservation">Book a Table</Nav.Link>
                        <Nav.Item>
                            <Nav.Link eventKey="2" as={Link} to="/">Order Now</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="3" as={Link} to="/menu">Menu</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="4" as={Link} to="/">About</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="5" as={Link} to="/">Contact</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Nav className="navbar-nav ms-auto mb-2 mb-lg-0" activeKey={active}>
                        <Nav.Link eventKey="6" as={Link} to="/">Employee Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar >
    );
};

export default NavbarRestaurant;