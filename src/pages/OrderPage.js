import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ItemsToOrder from "../components/ItemsToOrder";

const OrderPage = () => {
    const [personDetails, setPersonDetails] = useState({ name: '', phoneNumber: '', email: '', address: '' })
    const [additionalDetails, setAdditionalDetails] = useState('')
    const [selectedRadio, setSelected] = useState('Take-Away');
    const [showOrderDetails, setShowOrderDetails] = useState(false);

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
        setPersonDetails(
            {
                ...personDetails,
                address: event.target.value
            })
    }
    const onChangeAdditionalDetails = event => setAdditionalDetails(event.target.value)

    const onSubmit = (e) => {
        e.preventDefault()
        setShowOrderDetails(true)
    }
    return (
        <div className="row g-1">
            <div className="container col col-lg-6 col-sm-10 py-3 px-5" style={{ backgroundColor: "#ffffff90", }}>
                <div className="section-title">
                    <h4 style={{ color: "black" }}><u>Your Details</u></h4>
                </div>
                <Form onSubmit={onSubmit}>
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
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="col-md-6 form-group">
                            <FloatingLabel controlId="floatingInput" label="Name">
                                <FormControl type="text" name="name" className="form-control" placeholder="Name" required
                                    value={personDetails.name} onChange={onChangeName} />
                            </FloatingLabel>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center form-group mt-3">
                        <div className="col-md-6 form-group">
                            <FloatingLabel label="Phone Number">
                                <input type="phone" className="form-control" name="subject" placeholder="Phone Number" required
                                    value={personDetails.phoneNumber} onChange={onChangePhoneNumber} />
                            </FloatingLabel>
                        </div>
                    </div>
                    {
                        selectedRadio === 'Delivery' ?
                            <>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="Address">
                                            <input type="email" className="form-control" name="email" id="email" placeholder="Email"
                                                value={personDetails.address} onChange={onChangeAddress} required/>
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="Additional Details" >
                                            <textarea className="form-control" name="message" rows="4" placeholder="Additional Details"
                                                value={additionalDetails} onChange={onChangeAdditionalDetails} style={{ height: '10rem' }} />
                                        </FloatingLabel>
                                    </div>
                                </div>

                            </>
                            :
                            null
                    }
                    <div className="text-center mt-4">
                        <input type="submit" value="Continue"
                            className="btn btn-primary btn-user btn-block"
                        />
                    </div>
                </Form>
            </div>
            {
                showOrderDetails ?
                    <ItemsToOrder />
                    :
                    null
            }
        </div>

    );
};

export default OrderPage;