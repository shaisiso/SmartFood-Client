import React from 'react';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import EmployeesManagement from '../components/EmployeesManagement';
import MenuManagement from '../components/MenuManagement';

const ManagementPage = () => {
    // const mounted = useRef();
    // useEffect(() => {
    //     if (!mounted.current) {
    //         console.log(tokensDetails)
    //         mounted.current = true;
    //     }
    // });

    return (
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
                <EmployeesManagement />
            </Tab>
        </Tabs>
    );
};

export default ManagementPage;