import React from 'react';
//import { Route, Routes } from 'react-router-dom';
import EmployeeTopBar from '../components/EmployeeTopBar';
import SideNavbar from '../components/SideNavbar';

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
                    <div className="container-fluid mt-0 mb-4">
                        {/* <Routes>
                            <Route exact path="/" element={<DashBody />} />
                            <Route path="/pc" element={<BuyPc />} />
                            <Route path="/phone" element={<BuyPhone />} />
                            <Route path="/about" element={<About />} />
                            <Route
                                path="/profile"
                                element={<Profile emailAdress={this.props.emailAdress} />}
                            />
                            <Route path="/*" exact={true} element={<NotFound404 />} />
                        </Routes> */}
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
        </div>
    );
};

export default EmployeeHomepage;