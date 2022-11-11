import React from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import { ReactComponent as UserSvg } from "../assets/icons/user-icon.svg";
import { ReactComponent as ProfileSvg } from "../assets/icons/profile-icon.svg";
import { ReactComponent as LogoutSvg } from "../assets/icons/logout-icon.svg";
import { Link } from "react-router-dom";

const EmployeeTopBar = (props) => {
    const onLogout = () => {
        console.log(`logout`)
        //TODO: implement logout
    }
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark topbar mb-4 static-top shadow">
        <ul className="navbar-nav ml-auto">
          <div className="topbar-divider d-none d-sm-block" />
          <div className="mr-20 text-white-600 small" >
            <Dropdown >
              <Dropdown.Toggle className='text-white' variant="transparent" >
               Shai  &nbsp; &nbsp;
                <UserSvg width="48" height="48" />
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ margin: 0 }}>
                <Dropdown.Item as={Link} to="#">
                  <ProfileSvg width="12" height="12" />
                  &nbsp; Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={onLogout}>
                  <LogoutSvg width="12" height="12" />
                  &nbsp; Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </ul>
      </nav>
    );
};

export default EmployeeTopBar;