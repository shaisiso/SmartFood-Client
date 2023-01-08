import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import CancelledReport from '../components/CancelledReport';
import IncomeReport from '../components/IncomeReport';
import OrdersQuantityReport from '../components/OrdersQuantityReport';

const ReportsPage = () => {
    return (
        <Tabs
            justify variant="tabs"
            id="controlled-tab-example"
            defaultActiveKey="1"
            className="mb-3 text-black"
        >
            <Tab eventKey="1" title="Orders Income" tabClassName="text-black font-weight-bold">
                <IncomeReport />
            </Tab>
            <Tab eventKey="2" title="Orders Quantity" tabClassName="text-black font-weight-bold">
                <OrdersQuantityReport />
            </Tab>
            <Tab eventKey="3" title="Menu" tabClassName="text-black font-weight-bold">
                <CancelledReport />
            </Tab>
        </Tabs>
    );
};

export default ReportsPage;