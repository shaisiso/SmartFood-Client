import React from 'react';
import Nav from 'react-bootstrap/Nav';

const ManagementPage = () => {
    return (
        <Nav justify variant="tabs" defaultActiveKey="1">
            <Nav.Item>
                <Nav.Link eventKey="1">Restaurant Arrangement</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="2">Menu Management</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="3">Discount Management</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="4">
                    Employees Management
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default ManagementPage;