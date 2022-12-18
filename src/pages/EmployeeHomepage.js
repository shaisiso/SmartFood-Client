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
import OrderOfTable from '../components/OrderOfTable';
import TasksPage from './TasksPage';
import RoleService from '../services/RoleService';
import MyShifts from './MyShifts';
import { API_URL } from '../utility/Utils';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useState } from 'react';
import ShiftService from '../services/ShiftService';

const SOCKET_URL = `${API_URL}/api/ws`;
var stompClient = null;

const EmployeeHomepage = (props) => {
    const [tasks, setTasks] = useState({ exteranlOrders: [], shifts: [] });
    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getShiftsToConfirm()
        }
        if (RoleService.isManager(props.employee)) {
            connectWebSocekt()
        }
    });
    const connectWebSocekt = () => {
        let Sock = new SockJS(SOCKET_URL);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }
    const onConnected = () => {
        stompClient.subscribe('/topic/task', onMessageReceived);
        stompClient.subscribe('/topic/shift', onShiftReceived)
    }
    const onShiftReceived = payload => {
        // var payloadData = JSON.parse(payload.body);
        // console.log(payloadData)
        getShiftsToConfirm()
    }
    const getShiftsToConfirm = async () => {
        ShiftService.getShiftsToApprove()
            .then(res =>{
                setTasks({...tasks,shifts:res.data})
            }).catch(err=>{
                console.log(err)
            })
    }
    const onMessageReceived = payload => {
        var payloadData = JSON.parse(payload.body);
        let orders = tasks.exteranlOrders
        orders.push(payloadData);
        setTasks({ ...tasks, exteranlOrders: [...orders] });
    }

    const onError = (err) => {
        console.log(err);
    }
    const onUpatedShifts = (newShifts) => {
        getShiftsToConfirm()
    }
    return (
        <div id="wrapper">
            <SideNavbar employee={props.employee} tasks={tasks} />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <EmployeeTopBar
                        userDetails={props.userDetails}
                        handleLogout={props.handleLogout}
                        employee={props.employee}
                    />
                    <div className="container-fluid " style={{ backgroundImage: `url(${WoodImg})`, backgroundPosition: 'top center', minHeight: '93vh', backgroundRepeat: 'repeat' }}>
                        <Routes>
                            <Route exact path="/" element={<Navigate to="/employee/tables" />} />
                            <Route path="/menu" element={<MenuEmployees />} />
                            {/* Routes should be define only to specifc roles with permission */}
                            {
                                RoleService.isGeneralManager(props.employee) ?
                                    <Route path="/management" element={<ManagementPage />} />
                                    :
                                    null
                            }
                            {
                                RoleService.isGeneralManager(props.employee) ?
                                    <Route path="/management/menu" element={<MenuManagement />} />
                                    :
                                    null
                            }
                            <Route path="/my-shifts" element={<MyShifts />} />
                            <Route path="/tasks" element={<TasksPage tasks={tasks} onUpatedShifts={onUpatedShifts} />} />
                            <Route path="/tables" element={<Tables />} />
                            <Route path="/tables/*" element={<OrderOfTable />} />
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