import React from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import { ReactComponent as UserSvg } from "../assets/icons/user-icon.svg";
import { ReactComponent as ProfileSvg } from "../assets/icons/profile-icon.svg";
import { ReactComponent as LogoutSvg } from "../assets/icons/logout-icon.svg";
import { ReactComponent as ExitSvg } from "../assets/icons/exit-shift.svg";
import { Link } from "react-router-dom";
import AuthService from '../services/AuthService';
import { useState } from 'react';
import { useRef } from 'react';
import ShiftService from '../services/ShiftService';
import { useEffect } from 'react';
import { extractHttpError, formatDateForServer } from '../utility/Utils';
import TokenService from '../services/TokenService';
import PopupMessage from './PopupMessage';

const iconSize = 24

const EmployeeTopBar = (props) => {
  const [onShift, setOnShift] = useState(false)
  const [shift, setShift] = useState({ shiftEntrance: '', shiftExit: '', employee: {} })
  const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      updateIfOnShift()
    }
  });
  const updateIfOnShift = () => {
    let date = formatDateForServer(new Date())
    let employee = { phoneNumber: TokenService.getUser().phoneNumber }
    ShiftService.getShiftByEmployeeAndDates(employee, date, date)
      .then(res => {
        console.log(res)
        if (res.data && res.data.length > 0) {
          let currentShift = res.data.find(s => !s.shiftExit) || { shiftEntrance: '', shiftExit: '', employee: {} }
          setShift(currentShift)
          console.log(currentShift)
          setOnShift(currentShift.shiftExit !=='')
        }

      }).catch(err => {
        setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
      })
  }
  const onExitShift = async () => {
    console.log(shift)
    await ShiftService.exitShift(shift)
      .then(res => {
        setShift({})
        setOnShift(false)
      })
      .catch(err => {
        setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
      })
  }
  const onLogout = () => {
    AuthService.logout()
    props.handleLogout()
  }
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark topbar  static-top shadow">
      <ul className="navbar-nav ml-auto">
        {
          onShift ?
            <div className="my-auto" style={{ color: 'yellow' }}> You started shift at: {shift.shiftEntrance}</div>
            :
            null
        }
        <div className="topbar-divider d-none d-sm-block" />
        <div className="mr-20 text-white-600 small" >
          <Dropdown >
            <Dropdown.Toggle className='text-white' variant="transparent" >
              {props.employee.name} &nbsp; &nbsp;
              <UserSvg width="48" height="48" />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ margin: 0 }}>
              <Dropdown.Item as={Link} to="#">
                <ProfileSvg width={iconSize} height={iconSize} />
                &nbsp; Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={onExitShift} disabled={!onShift}>
                <ExitSvg width={iconSize} height={iconSize} />
                &nbsp; Exit Shift
              </Dropdown.Item>
              <Dropdown.Item onClick={onLogout}>
                <LogoutSvg width={iconSize} height={iconSize} />
                &nbsp; Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </ul>
      {
        popupMessage.title ?
          <PopupMessage
            title={popupMessage.title}
            body={
              <ul>
                {
                  popupMessage.messages.map((message, key) => (
                    <li key={key} className="mt-2" style={{ fontSize: '1.2rem' }}>
                      {message}
                    </li>
                  ))
                }
              </ul>
            }
            onClose={() => {
              setPopupMessage({ title: '', messages: [''] })
            }}
            status={popupMessage.title === 'Error' ?
              'error'
              :
              'info'
            }
            closeOnlyWithBtn
          >
          </PopupMessage>
          :
          null
      }
    </nav>
  );
};

export default EmployeeTopBar;