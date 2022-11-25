import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as FinancialSvg } from '../assets/icons/financial.svg'
import { ReactComponent as TasksSvg } from '../assets/icons/tasks.svg'
import { ReactComponent as MenuSvg } from '../assets/icons/menu.svg'
import { ReactComponent as TableSvg } from '../assets/icons/tables.svg'
import { ReactComponent as ManagementSvg } from '../assets/icons/management.svg'
import { ReactComponent as CutlerytSvg } from '../assets/icons/cutlery.svg'
const SideNavbar = () => {
    return (
        <ul className="navbar-nav bg-dark sidebar sidebar-dark accordion" id="accordionSidebar">
            <Link className=" d-flex align-items-center justify-content-center my-3" to={'/employee'} style={{ fontFamily: 'Pacifico',color:'white',textDecoration: 'none', fontSize:'1.3rem'}}>
                <div className="mx-3" >Smart Food </div>
                <CutlerytSvg width="36" height="36" /> 

            </Link>

            <hr className="sidebar-divider my-0" />

            {/* <li className="nav-item active">
                <Link className="nav-link" to={'/'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#E5E4E2" className="bi bi-speedometer" viewBox="0 0 16 16">
                        <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z" />
                        <path fillRule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z" />
                    </svg>
                    <span className="mx-2">
                        Dashboard
                    </span>
                </Link>
            </li> */}

            <hr className="sidebar-divider" />

            <div className="sidebar-heading text-white mt-3 mb-2">
                Operation:
            </div>

            <li className="nav-item">
                <Link className="nav-link" to={'/employee/management'}>
                    <ManagementSvg width="24" height="24" />
                    <span className="mx-2">Management</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" to={'#'}>
                    <FinancialSvg width="24" height="24" />
                    <span className="mx-2">Financial</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" to={'#'}>
                    <TasksSvg width="24" height="24" />
                    <span className="mx-2">Tasks</span>
                </Link>
            </li>
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
        // <div>
        //     <ul className="navbar navbar-nav bg-dark sidebar sidebar-dark accordion" id="accordionSidebar" >

        //         {/* <!-- Sidebar - Brand -->
        //         <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
        //             <div className="sidebar-brand-icon rotate-n-15">
        //                 <i className="fas fa-laugh-wink"></i>
        //             </div>
        //             <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
        //         </a> */}

        //         {/* <!-- Divider -->
        //         <hr className="sidebar-divider my-0" /> */}

        //         {/* <!-- Nav Item - Dashboard -->
        //         <li className="nav-item active">
        //             <a className="nav-link" href="#">
        //                 <i className="fas fa-fw fa-tachometer-alt"></i>
        //                 <span>Dashboard</span></a>
        //         </li> */}

        //         {/* <!-- Divider -->
        //         <hr className="sidebar-divider" /> */}

        //         {/* <!-- Heading --> */}
        //         <div className="sidebar-heading "  >
        //             Management Section
        //         </div>

        //         {/* <!-- Nav Item - Utilities Collapse Menu --> */}
        //         <li className="nav-item" >
        //             <a className="nav-link collapsed" href="#" >
        //                 <i className="fas fa-fw fa-wrench"></i>
        //                 <span>Management</span>
        //             </a>
        //         </li>

        //         {/* <!-- Nav Item - Pages Collapse Menu --> */}
        //         <li className="nav-item">
        //             <a className="nav-link collapsed" href="#" >
        //                 <i className="fas fa-fw fa-cog"></i>
        //                 <span>Financial</span>
        //             </a>
        //         </li>

        //         {/* <!-- Divider --> */}
        //         {/* <hr className="sidebar-divider" /> */}

        //         {/* <!-- Heading --> */}
        //         <div className="sidebar-heading">
        //             Shift Management Section
        //         </div>

        //         {/* <!-- Nav Item - Pages Collapse Menu --> */}
        //         <li className="nav-item">
        //             <a className="nav-link " href="#" >
        //                 <i className="fas fa-fw fa-folder"></i>
        //                 <span>Tasks</span>
        //             </a>
        //         </li>
        //         {/* <!-- Divider --> */}
        //         {/* <hr className="sidebar-divider d-none d-md-block" /> */}
        //         {/* <!-- Heading --> */}
        //         <div className="sidebar-heading">
        //             Restaurant Section
        //         </div>
        //         {/* <!-- Nav Item - Charts --> */}
        //         <li className="nav-item">
        //             <a className="nav-link" href="#">
        //                 <i className="fas fa-fw fa-chart-area"></i>
        //                 <span>Menu</span></a>
        //         </li>

        //         {/* <!-- Nav Item - Tables --> */}
        //         <li className="nav-item">
        //             <a className="nav-link" href="#">
        //                 <i className="fas fa-fw fa-table"></i>
        //                 <span>Tables</span></a>
        //         </li>

        //         {/* <!-- Divider --> */}
        //         <hr className="sidebar-divider d-none d-md-block" />
        //         <hr className="sidebar-divider d-none d-md-block" />
        //         <hr className="sidebar-divider d-none d-md-block" />
        //         <hr className="sidebar-divider d-none d-md-block" />
        //         <hr className="sidebar-divider d-none d-md-block" />
        //         <hr className="sidebar-divider d-none d-md-block" />
        //         {/* <!-- Sidebar Toggler (Sidebar) -->
        //                         <div className="text-center d-none d-md-inline">
        //                             <button className="rounded-circle border-0" id="sidebarToggle"></button>
        //                         </div> */}
        //     </ul>
        // </div>
    );
};

export default SideNavbar;