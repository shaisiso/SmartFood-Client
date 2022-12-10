import React, { useEffect, useRef } from 'react';
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
// import { API_URL } from '../utility/Utils';
// import { over } from 'stompjs';
// import SockJS from 'sockjs-client';

// const SOCKET_URL = `${API_URL}/api/ws`;
// var stompClient = null;

const EmployeeHomepage = (props) => {
    // const [publicChats, setPublicChats] = useState([]);

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        }
        let em = props.employee
        if (em.role === 'MANAGER') {
         //   connect()
        }
    });

    // const connect = () => {
    //     console.log('connect')
    //     let Sock = new SockJS(SOCKET_URL);
    //     stompClient = over(Sock);
    //     stompClient.connect({}, onConnected, onError);
    // }

    // const onConnected = () => {
    //     console.log('Connected')
    //     stompClient.subscribe('/topic/chat', onMessageReceived);
    // }

    // const onMessageReceived = (payload) => {
    //     console.log(publicChats)
    //     console.log('receive')
    //     var payloadData = JSON.parse(payload.body);
    //     publicChats.push(payloadData);
    //     setPublicChats([...publicChats]);
    //     console.log(publicChats)
    // }

    // const onError = (err) => {
    //     console.log('err')
    //     console.log(err);

    // }

    return (
        <div id="wrapper">
            <SideNavbar employee={props.employee}/>
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <EmployeeTopBar
                        userDetails={props.userDetails}
                        handleLogout={props.handleLogout}
                        employee={props.employee}
                    />
                    <div className="container-fluid " style={{ backgroundImage: `url(${WoodImg})`, backgroundPosition: 'top center', minHeight: '93vh', backgroundRepeat: 'repeat' }}>
                        <Routes>
                            <Route exact path="/" element={<ManagementPage tokensDetails={props.userDetails}/>} />
                            <Route path="/menu" element={<MenuEmployees />} />
                            <Route path="/management" element={<ManagementPage tokensDetails={props.userDetails}/>} />
                            <Route path="/management/menu" element={<MenuManagement tokensDetails={props.userDetails}/>} />
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