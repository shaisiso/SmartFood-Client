import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import MenuManagement from '../components/MenuManagement';

const ManagementPage = () => {
    return (
        // <Nav justify variant="tabs" defaultActiveKey="1">
        //     <Nav.Item>
        //         <Nav.Link eventKey="1" style={{ color: 'black', fontWeight:'bold' }} to="/menu">Restaurant Arrangement</Nav.Link>
        //     </Nav.Item>
        //     <Nav.Item>
        //         <Nav.Link eventKey="2" style={{ color: 'black', fontWeight:'bold'  }}>Menu Management</Nav.Link>
        //     </Nav.Item>
        //     <Nav.Item>
        //         <Nav.Link eventKey="3" style={{ color: 'black', fontWeight:'bold'  }}>Discount Management</Nav.Link>
        //     </Nav.Item>
        //     <Nav.Item>
        //         <Nav.Link eventKey="4" style={{ color: 'black', fontWeight:'bold'  }}>
        //             Employees Management
        //         </Nav.Link>
        //     </Nav.Item>
        // </Nav>
        <Tabs
        justify variant="tabs" 
            id="controlled-tab-example"
            defaultActiveKey="1"
           // activeKey={key}
           // onSelect={(k) => setKey(k)}
            className="mb-3 text-black"
        >
            <Tab eventKey="1" title="Restaurant Arrangement" tabClassName="text-black font-weight-bold">
            <div></div>
            </Tab>
            <Tab eventKey="2" title="Menu Management" tabClassName="text-black font-weight-bold">
                <MenuManagement />
            </Tab>
            <Tab eventKey="3" title="Discount Management" tabClassName="text-black font-weight-bold">
            <div></div>
            </Tab>
            <Tab eventKey="4" title="Employees Management" tabClassName="text-black font-weight-bold">
            <div></div>
            </Tab>
        </Tabs>
    );
};

export default ManagementPage;