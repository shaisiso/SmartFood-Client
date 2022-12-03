import Axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import EmployeeImg from '../assets/img/employeeLogin.png'
import PopupMessage from '../components/PopupMessage';
import { API_URL, extractHttpError } from '../utility/Utils';

const EmployeeLogin = props => {
    const [credentials, setCredentials] = useState({ phoneNumber: '', password: '' })
    const onChangePassword = (e) => setCredentials({ ...credentials, password: e.target.value })
    const onChangePhone = (e) => setCredentials({ ...credentials, phoneNumber: e.target.value })
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoader, setShowLoader] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault();
        setShowLoader(true)
        await Axios.post(`${API_URL}/api/login`, credentials)
            .then(res => {
                props.handleLogin(credentials.phoneNumber, res.data)
            })
            .catch(err => {
                console.log(err)
                setErrorMessage(extractHttpError(err))
            })
        setShowLoader(false)

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