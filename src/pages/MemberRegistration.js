import React from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import PopupMessage from '../components/PopupMessage';
import RegistrationImg from '../assets/img/event-private.jpg'
import { extractHttpError, lastCharIsDigit } from '../utility/Utils';
import MemberService from '../services/MemberService';
import { useNavigate } from 'react-router-dom';

const MemberRegistration = () => {
    const [personDetails, setPersonDetails] = useState({ name: '', phoneNumber: '', email: '', password: '', address: { city: '', streetName: '', houseNumber: '', entrance: '', apartmentNumber: '' } })
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [] })
    const [showLoader, setShowLoader] = useState(false)
    const [repeatPassword, setRepeatPassword] = useState('');
    const navigate = useNavigate()
    const onChangePersonDetails = e => {
        let fieldName = e.target.name
        let fieldValue = e.target.value
        if (fieldName === 'phoneNumber' && (!lastCharIsDigit(fieldValue) || fieldValue.length > 10))
            return
        let details = { ...personDetails }
        details[fieldName] = fieldValue
        setPersonDetails({ ...details })
    }
    const onChangeAddress = e => {
        let fieldName = e.target.name
        let fieldValue = e.target.value
        if (fieldName === 'entrance' && fieldValue.length > 1)
            return
        let details = { ...personDetails }
        details.address[fieldName] = fieldValue
        setPersonDetails({ ...details })
    }
    const onChangeRepeatPassword = e => {
        setRepeatPassword(e.target.value)
    }
    const onSubmit = async e => {
        e.preventDefault();

        if (personDetails.password !== repeatPassword) {
            setPopupMessage({ title: 'Error', messages: ['Passwords are not match'] })
            return
        }
        setShowLoader(true)
        await MemberService.addMember(personDetails)
            .then(() => {
                setPopupMessage({ title: 'New Member', messages: [`Welcome ${personDetails.name}!`, 'You are now registered as our member'] })
            })
            .catch(err => setPopupMessage({ title: 'Error', messages: extractHttpError(err) }))
        setShowLoader(false)
    }
    return (
        <div className="container col-xxl-6 col-xl-8 col col-lg-10 col-sm-10 py-3 px-5 " style={{ backgroundColor: "#ffffffB0" }} >
            <div className="section-title hRestaurant">
                <h1 style={{ color: "black" }}><u>Members Registration</u></h1>
            </div>
            <div className="row d-flex align-items-center mb-3 mx-auto text-center" >
                <div className="col col-5 d-none d-lg-block me-4 ">
                    <img className="img-fluid" src={RegistrationImg} alt="Members Registration" />
                </div>
                <div className="col col-lg-6 col-md-8 col-sm-10 col-12 mx-auto ">
                    <div className="row ">
                        <Form onSubmit={onSubmit} className="user" >
                            <div >
                                <FloatingLabel label="Name" >
                                    <input type="text" className="form-control form-control-user" placeholder="Your Name" autoComplete= "name"
                                        value={personDetails.name} onChange={onChangePersonDetails} name="name" required
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Phone Number" >
                                    <input type="phone" className="form-control form-control-user" placeholder="Phone Number"
                                        value={personDetails.phoneNumber} onChange={onChangePersonDetails} name="phoneNumber" required
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Password" >
                                    <input type="password" className="form-control form-control-user" name="password" placeholder="Password"
                                        value={personDetails.password} onChange={onChangePersonDetails} required autoComplete ="new-password"
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Repeat Password" >
                                    <input type="password" className="form-control form-control-user" name="repeatPassword" placeholder="Repeat Password"
                                        value={repeatPassword} onChange={onChangeRepeatPassword} required autoComplete ="new-password"
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Email" >
                                    <input type="email" className="form-control form-control-user" placeholder="Your Email"
                                        value={personDetails.email} onChange={onChangePersonDetails} name="email" required
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="City" >
                                    <input type="text" className="form-control form-control-user" placeholder="City"
                                        value={personDetails.address.city} onChange={onChangeAddress} name="city" required
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Street Name" >
                                    <input type="text" className="form-control form-control-user" placeholder="Street Name"
                                        value={personDetails.address.streetName} onChange={onChangeAddress} name="streetName" required
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="House Number" >
                                    <input type="number" className="form-control form-control-user" placeholder="House Number" min={1}
                                        value={personDetails.address.houseNumber} onChange={onChangeAddress} name="houseNumber" required
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Entrance" >
                                    <input type="text" className="form-control form-control-user" placeholder="Entrance"
                                        value={personDetails.address.entrance} onChange={onChangeAddress} name="entrance"
                                    />
                                </FloatingLabel>
                            </div>
                            <div className=" mt-3 ">
                                <FloatingLabel label="Apartment Number" >
                                    <input type="number" className="form-control form-control-user" placeholder="Apartment Number" min={1}
                                        value={personDetails.address.apartmentNumber} onChange={onChangeAddress} name="apartmentNumber"
                                    />
                                </FloatingLabel>
                            </div>
                            <div className="row mt-3 mx-auto">
                                <input type="submit" className="btn btn-primary btn-user" value="Login" />
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
                            if (popupMessage.title.toLowerCase().includes('new'))
                                navigate('/login/member')
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            'success'
                        }
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default MemberRegistration;