import React from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeImg from '../assets/img/employeeLogin.png'
import MemberImg from '../assets/img/memberLogin.png'

import PopupMessage from '../components/PopupMessage';
import AuthService from '../services/AuthService';
import ShiftService from '../services/ShiftService';
import { extractHttpError } from '../utility/Utils';

const Login = props => {
    const [credentials, setCredentials] = useState({ phoneNumber: '', password: '' })
    const onChangePassword = (e) => setCredentials({ ...credentials, password: e.target.value })
    const onChangePhone = (e) => setCredentials({ ...credentials, phoneNumber: e.target.value })
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoader, setShowLoader] = useState(false)
    const [isStartShitChecked, setStartShift] = useState(false)
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setShowLoader(true)
        if (isEmployeeLogin())
            await employeeLogin()
        else
            await memberLogin()

        setShowLoader(false)
    }
    const employeeLogin = async () => {
        try {
            await AuthService.employeeLogin(credentials.phoneNumber, credentials.password)
                .then(async res => {
                    if (isStartShitChecked) {
                        await startShift()
                    }
                    props.handleEmployeeLogin()
                })
                .catch(err => {
                    setErrorMessage(extractHttpError(err)[0])
                })
        } catch {
            console.log('catch')
        }
    }
    const memberLogin = async () => {
        await AuthService.memberLogin(credentials.phoneNumber, credentials.password)
            .then(() => {
                props.handleMemberLogin()
                navigate('/')
            })
            .catch(err => setErrorMessage(extractHttpError(err)[0]))
    }
    const onChangeShiftCheck = e => {
        setStartShift(e.target.checked)
    }
    const startShift = async () => {
        let employee = { phoneNumber: credentials.phoneNumber }
        await ShiftService.startShift(employee)
            .catch(err => {
                throw err
            })
    }
    const isEmployeeLogin = () => props.type && props.type.toLowerCase().includes('employee')
    return (
        <div className="container col-xxl-6 col-xl-8 col col-lg-10 col-sm-10 py-3 px-5 " style={{ backgroundColor: "#ffffffB0" }} >
            <div className="section-title hRestaurant">
                <h1 style={{ color: "black" }}><u>{props.type || ''} Login</u></h1>
            </div>
            <div className="row d-flex align-items-center mb-3 mx-auto text-center" >
                <div className="col col-5 d-none d-lg-block me-4 ">
                    <img className="img-fluid" src={isEmployeeLogin() ? EmployeeImg : MemberImg} alt="Employees Login" />
                </div>
                <div className="col col-lg-6 col-md-8 col-sm-10 col-12 mx-auto ">
                    <div className="row ">
                        <Form onSubmit={onSubmit} className="user" >
                            <div >
                                <FloatingLabel label="Phone Number" >
                                    <input type="phone" className="form-control form-control-user" placeholder="Phone Number" onChange={onChangePhone} required  />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Password" >
                                    <input type="password" className="form-control form-control-user"  placeholder="Password" onChange={onChangePassword} required autoComplete="current-password"  />
                                </FloatingLabel>
                            </div>
                            {
                                isEmployeeLogin() ?
                                    <div className="row">
                                        <div className="  mt-3 float-left text-left">
                                            <h6 style={{ fontSize: '1.1rem' }}>
                                                <Form.Check
                                                    type='checkbox'
                                                    label='Start Shift'
                                                    onChange={onChangeShiftCheck}
                                                    value={isStartShitChecked}
                                                />
                                            </h6>
                                        </div>
                                    </div>
                                    : null
                            }

                            <div className="row mt-3 mx-auto">
                                <input type="submit" className="btn btn-primary btn-user" value="Login" />
                            </div>
                            {
                                !isEmployeeLogin() ?
                                    <div className="col mt-4 text-center">
                                        <Link className="large" to={"/sign-up"}>
                                            Become a new Member!
                                        </Link>
                                    </div> : null
                            }
                        </Form>
                    </div>
                </div>
                <ColorRing
                    visible={showLoader}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
            </div>
            {
                errorMessage ?
                    <PopupMessage
                        title="Error"
                        body={
                            <div className="text-black" style={{ fontSize: '1.2rem' }}>{errorMessage}</div>
                        }
                        onClose={() => {
                            setErrorMessage('')
                        }}
                        status='error'
                    >

                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default Login;