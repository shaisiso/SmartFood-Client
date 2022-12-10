import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as FinancialSvg } from '../assets/icons/financial.svg'
import { ReactComponent as TasksSvg } from '../assets/icons/tasks.svg'
import { ReactComponent as MenuSvg } from '../assets/icons/menu.svg'
import { ReactComponent as TableSvg } from '../assets/icons/tables.svg'
import { ReactComponent as ManagementSvg } from '../assets/icons/management.svg'
import { ReactComponent as CutlerytSvg } from '../assets/icons/cutlery.svg'
import RoleService from '../services/RoleService';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { API_URL } from '../utility/Utils';

const SOCKET_URL = `${API_URL}/api/ws`;
var stompClient = null;

const SideNavbar = (props) => {
    const [tasks, setTasks] = useState([]);

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        }
        if (RoleService.isManager(props.employee)) {
            connectWebSocekt()
        }
    });
    const connectWebSocekt = () => {
        // console.log('connect')
        let Sock = new SockJS(SOCKET_URL);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }
    const onConnected = () => {
        stompClient.subscribe('/topic/task', onMessageReceived);
    }

    const onMessageReceived = payload => {
        var payloadData = JSON.parse(payload.body);
        tasks.push(payloadData);
        setTasks([...tasks]);
        console.log(tasks)
    }

    const onError = (err) => {
        console.log(err);
    }
    const onClickTasks = e => {
        e.preventDefault()
        setTasks([])
    }

    return (
        <ul className="navbar-nav bg-dark sidebar sidebar-dark accordion" id="accordionSidebar">
            <Link className=" d-flex align-items-center justify-content-center my-3" to={'/employee'} style={{ fontFamily: 'Pacifico', color: 'white', textDecoration: 'none', fontSize: '1.3rem' }}>
                <div className="mx-3" >Smart Food </div>
                <CutlerytSvg width="36" height="36" />

            </Link>

            <hr className="sidebar-divider my-0" />

            <hr className="sidebar-divider" />

            <div className="sidebar-heading text-white mt-3 mb-2">
                Operation:
            </div>
            {
                RoleService.isManager(props.employee) ?
                    <li className="nav-item">
                        <Link className="nav-link" to={'/employee/management'}>
                            <ManagementSvg width="24" height="24" />
                            <span className="mx-2">Management</span>
                        </Link>
                    </li>
                    :
                    null
            }
            <li className="nav-item">
                <Link className="nav-link" to={'#'}>
                    <FinancialSvg width="24" height="24" />
                    <span className="mx-2">Financial</span>
                </Link>
            </li>
            {
                RoleService.isManager(props.employee) ?
                    <li className="nav-item">
                        <Link className="nav-link" to={'#'} onClick={onClickTasks}>
                            <TasksSvg width="24" height="24" />
                            <span className="mx-2">Tasks</span>
                            {
                                tasks.length > 0 ? <span className="notification">{tasks.length}</span> : null
                            }
                        </Link>
                    </li>
                    :
                    null
            }

            <li className="nav-item">
                <Link className="nav-link" to={'/employee/menu'}>
                    <MenuSvg width="24" height="24" />
                    <span className="mx-2">Menu</span>
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to={'/employee/tables'}>
                    <TableSvg width="24" height="24" />
                    <span className="mx-2">Tables</span>
                </Link>
            </li>

        </ul>
    );
};

export default SideNavbar;