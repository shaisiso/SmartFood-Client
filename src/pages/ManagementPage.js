import React from 'react';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DiscountManagement from '../components/DiscountManagement';
import EmployeesManagement from '../components/EmployeesManagement';
import MenuManagement from '../components/MenuManagement';
import RestaurantArrangement from '../components/RestaurantArrangement';
import ShiftsManagement from '../components/ShiftsManagement';

const ManagementPage = () => {

    return (
        <Tabs
            justify variant="tabs"
            id="controlled-tab-example"
            defaultActiveKey="1"
            className="mb-3 text-black"
        >
            <Tab eventKey="1" title="Discount Management" tabClassName="text-black font-weight-bold">
                <DiscountManagement />
            </Tab>
            <Tab eventKey="2" title="Employees Management" tabClassName="text-black font-weight-bold">
                <EmployeesManagement />
            </Tab>
            <Tab eventKey="3" title="Menu Management" tabClassName="text-black font-weight-bold">
                <MenuManagement />
            </Tab>
            <Tab eventKey="4" title="Shifts Management" tabClassName="text-black font-weight-bold">
                <ShiftsManagement/>
            </Tab>
            <Tab eventKey="5" title="Restaurant Arrangement" tabClassName="text-black font-weight-bold">
                <RestaurantArrangement/>
            </Tab>
        </Tabs>
    );
};

export default ManagementPage;