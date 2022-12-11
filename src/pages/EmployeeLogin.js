import React from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import EmployeeImg from '../assets/img/employeeLogin.png'
import PopupMessage from '../components/PopupMessage';
import AuthService from '../services/AuthService';
import ShiftService from '../services/ShiftService';
import { extractHttpError } from '../utility/Utils';

const EmployeeLogin = props => {
    const [credentials, setCredentials] = useState({ phoneNumber: '', password: '' })
    const onChangePassword = (e) => setCredentials({ ...credentials, password: e.target.value })
    const onChangePhone = (e) => setCredentials({ ...credentials, phoneNumber: e.target.value })
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoader, setShowLoader] = useState(false)
    const [isStartShitChecked, setStartShift] = useState(false)
    const onSubmit = async (e) => {
        e.preventDefault();
        setShowLoader(true)
        try{
            await AuthService.login(credentials.phoneNumber, credentials.password)
            .then(async res => {
                if (isStartShitChecked) {
                   await startShift()
                }
                props.handleLogin(credentials.phoneNumber, res.data)
            })
            .catch(err => {
                setErrorMessage(extractHttpError(err)[0])
            })
        }catch{
            console.log('catch')
        }

        setShowLoader(false)
    }
    const onChangeShiftCheck = e => {
        setStartShift(e.target.checked)
    }
    const startShift = async () => {
        let employee = { phoneNumber: credentials.phoneNumber }
        await ShiftService.startShift(employee)
            .catch(err=>{
                throw err
            })
    }
    return (
        <div className="container col-xxl-6 col-xl-8 col col-lg-10 col-sm-10 py-3 px-5 " style={{ backgroundColor: "#ffffff90" }} >
            <div className="section-title">
                <h4 style={{ color: "black" }}><u>Employees Login</u></h4>
            </div>
            <div className="row d-flex align-items-center mb-3 mx-auto text-center" >
                <div className="col col-5 d-none d-lg-block me-4 ">
                    <img className="img-fluid" src={EmployeeImg} alt="Employees Login" />
                </div>
                <div className="col col-lg-6 col-md-8 col-sm-10 col-12 mx-auto ">
                    <div className="row ">
                        <Form onSubmit={onSubmit}  >
                            <div >
                                <FloatingLabel label="Phone Number" >
                                    <input type="tel" className="form-control" placeholder="Phone Number" onChange={onChangePhone} required
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Password" >
                                    <input type="tel" className="form-control" name="subject" placeholder="Password" onChange={onChangePassword} required
                                    />
                                </FloatingLabel>
                            </div>
                            <div className="  mt-3 float-left">
                                <h6 style={{ fontSize: '1.1rem' }}>
                                    <Form.Check
                                        type='checkbox'
                                        label='Start Shift'
                                        onChange={onChangeShiftCheck}
                                        value={isStartShitChecked}
                                    />
                                </h6>
                            </div>                            <br /><br />

                            {/* <div className="form-check  mt-3 float-left">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label className="form-check-label" for="flexCheckDefault" >
                                    <h6 style={{ fontSize: '1.2rem' }}>Start Shift</h6>
                                </label>
                            </div> 
                            <br /><br /> */}
                            <div className="row mt-3 mx-auto">
                                <input type="submit" className="btn btn-primary" value="Login" />
                            </div>


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

export default EmployeeLogin;