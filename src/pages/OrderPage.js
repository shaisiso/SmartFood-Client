import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ItemsToOrder from "../components/ItemsToOrder";
import PopupMessage from "../components/PopupMessage";
import { API_URL, isValidName, isValidPhone } from '../utility/Utils'
import Axios from 'axios';

const OrderPage = () => {
    const [personDetails, setPersonDetails] = useState({ name: '', phoneNumber: '', email: '', address: { city: '', streetName: '', houseNumber: '', entrance: '', apartmentNumber: '' } })
    const [additionalDetails, setAdditionalDetails] = useState('')
    const [selectedRadio, setSelected] = useState('Take-Away');
    const [showMenu, setShowMenu] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [disableForm, setDisableForm] = useState(false);
    const [detailsButtonText, setButtonText] = useState('Continue');

    const onChangeRadio = event => {
        setSelected(event.target.value);
    };

    const onChangeName = event => {
        setPersonDetails(
            {
                ...personDetails,
                name: event.target.value
            })
    }
    const onChangePhoneNumber = event => {
        setPersonDetails(
            {
                ...personDetails,
                phoneNumber: event.target.value
            })
    }
    const onChangeAddress = event => {
        let newAddress = personDetails.address
        newAddress[event.target.name] = event.target.value
        setPersonDetails(
            {
                ...personDetails,
                address: newAddress
            })
    }
    const onChangeAdditionalDetails = event => setAdditionalDetails(event.target.value)

    const onFocusOutPhone = e=>{
       e.preventDefault()
       Axios.get(`${API_URL}/api/person/${personDetails.phoneNumber}`)
       .then(res => {
        setPersonDetails(res.data)
       })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (disableForm){ // need to enable form
            setDisableForm(false)
            setButtonText("Continue") 
        }else{ //validate details and disable form
            if (!fieldsAreValid()) {
                return
            }
            setShowMenu(true)
            setDisableForm(true)
            setButtonText("Change Details") 
        }

    }
    const fieldsAreValid = () => {
        var errors = []
        if (!isValidPhone(personDetails.phoneNumber))
            errors.push('Phone number must be 10 consecutive digits in format: 05xxxxxxxxx')

        if (!isValidName(personDetails.name))
            errors.push('Name must have at least 2 letters and contain only letters in english.')

        if (errors.length > 0) {
            setPopupMessage({ title: 'Error', messages: errors })
            return false
        }
        return true
    }

    return (
        <div className="row g-1">
            <div className="container col col-lg-6 col-sm-10 py-3 px-5" style={{ backgroundColor: "#ffffff90", }} >
                <div className="section-title">
                    <h4 style={{ color: "black" }}><u>Your Details</u></h4>
                </div>
                <Form onSubmit={onSubmit} >
                    <div className="d-flex justify-content-center mb-3">
                        <Form.Check
                            inline
                            label="Take-Away"
                            name="group1"
                            type='radio'
                            id={`1`}
                            value="Take-Away"
                            checked={selectedRadio === 'Take-Away'}
                            onChange={onChangeRadio}
                            disabled ={disableForm }
                        />
                        <Form.Check
                            inline
                            label="Delivery"
                            name="group1"
                            type='radio'
                            id={`2`}
                            value="Delivery"
                            checked={selectedRadio === 'Delivery'}
                            onChange={onChangeRadio}
                            disabled ={disableForm }
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="col-md-6 form-group">
                            <FloatingLabel label="*Phone Number" >
                                <input type="tel" className="form-control" name="subject" placeholder="*Phone Number" required disabled ={disableForm}
                                    value={personDetails.phoneNumber} onChange={onChangePhoneNumber} onBlur  ={onFocusOutPhone} />
                            </FloatingLabel>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center form-group mt-3">
                        <div className="col-md-6 form-group">
                            <FloatingLabel controlId="floatingInput" label="*Name">
                                <FormControl type="text" name="name" className="form-control"  required placeholder="*Name" disabled ={disableForm}
                                    value={personDetails.name} onChange={onChangeName} />
                            </FloatingLabel>
                        </div>
                    </div>
                    {
                        selectedRadio === 'Delivery' ?
                            <>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="*City">
                                            <input type="text" className="form-control" placeholder="*City" name="city" disabled ={disableForm}
                                                value={personDetails.address.city} onChange={onChangeAddress} required />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="*Street Name">
                                            <input type="text" className="form-control" placeholder="*Street Name" name = "streetName" disabled ={disableForm}
                                                value={personDetails.address.streetName} onChange={onChangeAddress} required />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="*House Number">
                                            <input type="text" className="form-control" placeholder="*House Number" name='houseNumber' disabled ={disableForm}
                                                value={personDetails.address.houseNumber} onChange={onChangeAddress} required />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="Entrance">
                                            <input type="text" className="form-control" name='entrance' disabled ={disableForm}
                                                value={personDetails.address.entrance} onChange={onChangeAddress} />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="Apartment Number">
                                            <input type="text" className="form-control" name='apartmentNumber' disabled ={disableForm}
                                                value={personDetails.address.apartmentNumber} onChange={onChangeAddress} />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="Additional Details" >
                                            <textarea className="form-control" name="message" rows="4"  disabled ={disableForm}
                                                value={additionalDetails} onChange={onChangeAdditionalDetails} style={{ height: '10rem' }} />
                                        </FloatingLabel>
                                    </div>
                                </div>

                            </>
                            :
                            null
                    }
                    <div className="text-center mt-4">
                        <input type="submit" value={detailsButtonText}
                            className={disableForm ? "btn btn-secondary btn-user btn-block" : "btn btn-primary btn-user btn-block"}
                        />
                    </div>
                </Form>
            </div>
            {
                showMenu ?
                    <ItemsToOrder />
                    :
                    null
            }
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
                            popupMessage.title === 'New Order' ?
                                'success'
                                :
                                'info'
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

export default OrderPage;