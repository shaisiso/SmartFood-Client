import React, { useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import EmployeeTopBar from '../components/EmployeeTopBar';
import SideNavbar from '../components/SideNavbar';
import MenuEmployees from './MenuEmployees';
import WoodImg from '../assets/backgrounds/white_wood.jpg'
import NotFound404 from './NotFound404';
import ManagementPage from './ManagementPage';
import MenuManagement from '../components/MenuManagement';
import Tables from './Tables';
import OrderOfTable from './OrderOfTable';
import TasksPage from './TasksPage';
import RoleService from '../services/RoleService';
import MyShifts from './MyShifts';
import { API_URL } from '../utility/Utils';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useState } from 'react';
import ShiftService from '../services/ShiftService';
import OrderService from '../services/OrderService';
import MyProfile from './MyProfile';
import EditOrder from '../components/EditOrder';
import TokenService from '../services/TokenService';
import Reservations from './Reservations';

const SOCKET_URL = `${API_URL}/api/ws`;
var stompClient = null;

const EmployeeHomepage = (props) => {
    const [tasks, setTasks] = useState({ exteranlOrders: [], shifts: [], cancelRequests: [] });
    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getAllTasks()
        }
        if (RoleService.isManager(TokenService.getEmployee())) {
            connectWebSocekt()
        }
    });
    const connectWebSocekt = () => {
        let Sock = new SockJS(SOCKET_URL);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }
    const onConnected = () => {
        stompClient.subscribe('/topic/external-orders', onExternalOrderReceived);
        stompClient.subscribe('/topic/shift', onShiftReceived)
        stompClient.subscribe('/topic/cancel-item-requests', onCancelRequestReceived)
    }
    const onShiftReceived = payload => {
        getAllTasks()
    }
    const onCancelRequestReceived = payload => {
        getAllTasks()
    }
    const getAllTasks = async () => {
        let shifts = []
        await ShiftService.getShiftsToApprove()
            .then(res => {
                shifts = res.data
            }).catch(err => {
                console.log(err)
            })
        let orders = await OrderService.getActiveExternalOrders()
        let cancelRequests = await OrderService.getAllCancelRequests()
        setTasks({ shifts: shifts, exteranlOrders: orders, cancelRequests: cancelRequests })

    }
    const onExternalOrderReceived = payload => {
        getAllTasks()
    }

    const onError = (err) => {
        console.log(err);
    }

    return (
        <div id="wrapper">
            <SideNavbar employee={TokenService.getEmployee()} tasks={tasks} />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <EmployeeTopBar
                        userDetails={props.userDetails}
                        handleLogout={props.handleLogout}
                        employee={TokenService.getEmployee()}
                    />
                    <div className="container-fluid " style={{ backgroundImage: `url(${WoodImg})`, backgroundPosition: 'top center', minHeight: '93vh', backgroundRepeat: 'repeat' }}>
                        <Routes>
                            <Route exact path="/" element={<Navigate to="/employee/tables" />} />
                            <Route path="/menu" element={<MenuEmployees />} />
                            {/* Routes should be define only to specifc roles with permission */}
                            {
                                RoleService.isGeneralManager(TokenService.getEmployee()) ?
                                    <Route path="/management" element={<ManagementPage />} />
                                    :
                                    null
                            }
                            {
                                RoleService.isGeneralManager(TokenService.getEmployee()) ?
                                    <Route path="/management/menu" element={<MenuManagement />} />
                                    :
                                    null
                            }
                            {
                                RoleService.isManager(TokenService.getEmployee()) ?
                                    <Route path={`/order/edit/*`} element={<EditOrder />} />
                                    :
                                    null
                            }
                            {
                                RoleService.isManager(TokenService.getEmployee()) ?
                                    <Route path="/tasks" element={<TasksPage tasks={tasks} />} />
                                    :
                                    null
                            }
                            <Route path="/reservations" element={<Reservations />} />
                            <Route path="/my-shifts" element={<MyShifts />} />
                            <Route path="/tables" element={<Tables />} />
                            <Route path="/tables/*" element={<OrderOfTable />} />
                            <Route path="/profile" element={<MyProfile />} />
                            <Route path="/*" exact={true} element={<NotFound404 />} />
                        </Routes>
                        {/* <div>
                            {
                                publicChats.map((msg, index) =>
                                    <div key={index}>
                                        {msg.message}
                                    </div>
                                )
                            }
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeHomepage;