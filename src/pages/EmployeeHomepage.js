import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EmployeeTopBar from '../components/EmployeeTopBar';
import SideNavbar from '../components/SideNavbar';
import MenuEmployees from './MenuEmployees';
import WoodImg from '../assets/backgrounds/white_wood.jpg'
import NotFound404 from './NotFound404';
import ManagementPage from './ManagementPage';
import MenuManagement from '../components/MenuManagement';
import Tables from './Tables';
import OrderOfTable from '../components/OrderOfTable';

const EmployeeHomepage = (props) => {
    return (
        <div id="wrapper">
            <SideNavbar />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <EmployeeTopBar
                        firstName={props.firstName}
                        handleLogout={props.handleLogout}
                    />
                    <div className="container-fluid " style={{ backgroundImage: `url(${WoodImg})`, backgroundPosition: 'top center', minHeight: '93vh', backgroundRepeat: 'repeat' }}>
                        <Routes>
                            {/* <Route exact path="/" element={<DashBody />} /> */}
                            <Route path="/menu" element={<MenuEmployees />} />
                            <Route path="/management" element={<ManagementPage />} />
                            <Route path="/management/menu" element={<MenuManagement />} />
                            <Route path="/tables" element={<Tables />} />
                            <Route path="/tables/*" element={<OrderOfTable />} />
                            <Route path="/*" exact={true} element={<NotFound404 />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeHomepage;