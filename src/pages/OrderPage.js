import React, { useEffect, useRef, useState } from "react";
import { FormControl } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import ItemsToOrder from "../components/ItemsToOrder";
import PopupMessage from "../components/PopupMessage";
import { API_URL, extractHttpError, isValidName, isValidPhone, lastCharIsDigit, toText } from '../utility/Utils'
import Axios from 'axios';
import OrderService from "../services/OrderService";
import ItemInOrderService from "../services/ItemInOrderService";
import DiscountsService from "../services/DiscountsService";
import Payment from '../components/Payment';
import TokenService from "../services/TokenService";

const OrderPage = () => {
    const [personDetails, setPersonDetails] = useState({ name: '', phoneNumber: '', email: '', address: { city: '', streetName: '', houseNumber: '', entrance: '', apartmentNumber: '' } })
    const [additionalDetails, setAdditionalDetails] = useState('')
    const [selectedRadio, setSelected] = useState('Take-Away');
    const [showMenu, setShowMenu] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ header: '', body: { topText: '', items: [''], bottomText: '' } })
    const [disableForm, setDisableForm] = useState(false);
    const [detailsButtonText, setButtonText] = useState('Continue');
    const [savedOrder, setSavedOrder] = useState()
    const onChangeRadio = event => {
        setSelected(event.target.value);
    };
    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            let member = TokenService.getMember()
            if (member)
                setPersonDetails({ ...member })
        }
    }, [])
    const onChangeName = event => {
        setPersonDetails(
            {
                ...personDetails,
                name: event.target.value
            })
    }
    const onChangePhoneNumber = event => {
        if (event.target.value.length > 10 || !lastCharIsDigit(event.target.value))
            return
        setPersonDetails(
            {
                ...personDetails,
                phoneNumber: event.target.value
            })
    }
    const onChangeEmail = event => {
        setPersonDetails({ ...personDetails, email: event.target.value })
    }
    const onChangeAddress = event => {
        let fieldName = event.target.name
        let fieldValue = event.target.value
        if (fieldName.includes('entrance') && fieldValue.length > 1)
            return
        if ((fieldName.includes('apartmentNumber') || fieldName.includes('houseNumber')) && (fieldValue.length > 6 || !lastCharIsDigit(fieldValue)))
            return
        let newAddress = personDetails.address
        newAddress[fieldName] = fieldValue
        setPersonDetails(
            {
                ...personDetails,
                address: newAddress
            })
    }
    const onChangeAdditionalDetails = event => setAdditionalDetails(event.target.value)

    const onFocusOutPhone = () => {
        Axios.get(`${API_URL}/api/person/${personDetails.phoneNumber}`)
            .then(res => {
                let address = res.data.address ? res.data.address : { city: '', streetName: '', houseNumber: '', entrance: '', apartmentNumber: '' }
                setPersonDetails({ ...res.data, address: address })
            }).catch(err => {
                setPersonDetails({ ...personDetails, name: '', email: '', address: { city: '', streetName: '', houseNumber: '', entrance: '', apartmentNumber: '' } })
            })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (disableForm) { // need to enable form
            setDisableForm(false)
            setButtonText("Continue")
        } else { //validate details and disable form
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
            setPopupMessage({ header: `Error`, body: { items: errors } })
            return false
        }
        return true
    }
    const onClickSendOrder = async (chosenItemsToDisplay, orderComment,) => {
        let itemsInOrder = ItemInOrderService.getItemsInOrderFromChosenItems(chosenItemsToDisplay)
        let order = { items: [...itemsInOrder], orderComment: orderComment, person: { ...personDetails } }
        if (selectedRadio.includes("D")) {
            await OrderService.addNewDelivery(order)
                .then(res => {
                    setSavedOrder(res.data)
                    setOrderinPopup(chosenItemsToDisplay, res)
                }).catch(err => {
                    console.log(err)
                    setPopupMessage({ header: `Error`, body: { items: extractHttpError(err) } })
                })
        }
        else { // Take Away
            let takeAway = { ...order }
            if (takeAway.person.address && !takeAway.person.address.city)
                delete takeAway.person.address
            await OrderService.addNewTakeAway(takeAway)
                .then(res => {
                    setSavedOrder(res.data)
                    setOrderinPopup(chosenItemsToDisplay, res)
                }).catch(err => {
                    console.log(err)
                    setPopupMessage({ header: `Error`, body: { items: extractHttpError(err) } })
                })
        }
    }
    const setOrderinPopup = async (chosenItemsToDisplay, httpResponse) => {
        console.log('chosenItemsToDisplay', chosenItemsToDisplay)
        let personString = `${personDetails.name} - ${personDetails.phoneNumber}`
        personString += selectedRadio.includes("D") ? `, ${personDetails.address.city} ${personDetails.address.streetName} ${personDetails.address.houseNumber} ${toText(personDetails.address.entrance)} ${toText(personDetails.address.apartmentNumber)}` : ""
        let itemString = []
        chosenItemsToDisplay.forEach(i => itemString.push(`${i.quantity} ${i.name} - ${i.price}₪`))
        console.log(httpResponse)
        let price = `Total Price: ${httpResponse.data.totalPriceToPay}₪`//${chosenItemsToDisplay.reduce((total, item) => total + item.price, 0)}₪ `
        let discounts = (await DiscountsService.getAllDiscountsAppliedToOrder(httpResponse.data)).map(d => `-${d.discountDescription}`)
        setPopupMessage(
            {
                header: `Order Details: ${selectedRadio}`,
                body: { topText: personString, items: [...itemString, ...discounts], bottomText: `${price}. We will send SMS message when it is ready.` }
            }
        )
    }
    const cleanAll = () => {
        window.location.reload(false); // false - cached version of the page, true - complete page refresh from the server
    }
    return (
        <div className="row g-1">
            <div className="container col col-lg-6 col-sm-10 py-3 px-5" style={{ backgroundColor: "#ffffff90", }} >
                <div className="section-title hRestaurant">
                    <h1 style={{ color: "black" }}><u>Your Details</u></h1>
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
                            disabled={disableForm}
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
                            disabled={disableForm}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="col-md-6 form-group">
                            <FloatingLabel label="*Phone Number" >
                                <input type="tel" className="form-control" name="subject" placeholder="*Phone Number" required disabled={disableForm}
                                    value={personDetails.phoneNumber} onChange={onChangePhoneNumber} onBlur={onFocusOutPhone} />
                            </FloatingLabel>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center form-group mt-3">
                        <div className="col-md-6 form-group">
                            <FloatingLabel controlId="floatingInput" label="*Name">
                                <FormControl type="text" name="name" className="form-control" required placeholder="*Name" disabled={disableForm}
                                    value={personDetails.name} onChange={onChangeName} />
                            </FloatingLabel>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center form-group mt-3">
                        <div className="col-md-6 form-group">
                            <FloatingLabel controlId="floatingInput" label="Email">
                                <FormControl type="email" name="email" className="form-control" placeholder="Email" disabled={disableForm}
                                    value={personDetails.email} onChange={onChangeEmail} />
                            </FloatingLabel>
                        </div>
                    </div>
                    {
                        selectedRadio === 'Delivery' ?
                            <>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="*City">
                                            <input type="text" className="form-control" placeholder="*City" name="city" disabled={disableForm}
                                                value={personDetails.address.city} onChange={onChangeAddress} required />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="*Street Name">
                                            <input type="text" className="form-control" placeholder="*Street Name" name="streetName" disabled={disableForm}
                                                value={personDetails.address.streetName} onChange={onChangeAddress} required />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="*House Number">
                                            <input type="text" className="form-control" placeholder="*House Number" name='houseNumber' disabled={disableForm}
                                                value={personDetails.address.houseNumber} onChange={onChangeAddress} required />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="Entrance">
                                            <input type="text" className="form-control" name='entrance' disabled={disableForm}
                                                value={personDetails.address.entrance || ''} onChange={onChangeAddress} />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="Apartment Number">
                                            <input type="text" className="form-control" name='apartmentNumber' disabled={disableForm}
                                                value={personDetails.address.apartmentNumber || ''} onChange={onChangeAddress} />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center form-group mt-3">
                                    <div className="col-md-6 form-group">
                                        <FloatingLabel label="Additional Details" >
                                            <textarea className="form-control" name="message" rows="4" disabled={disableForm}
                                                value={additionalDetails} onChange={onChangeAdditionalDetails} style={{ height: '10rem' }} />
                                        </FloatingLabel>
                                    </div>
                                </div>

                            </>
                            :
                            null
                    }
                    <div className="d-flex justify-content-center form-group mt-3">
                        <div className="col-md-6 form-group">
                            <input type="submit" value={detailsButtonText} disabled={savedOrder}
                                className={disableForm ? "btn btn-secondary btn-user btn-block" : "btn btn-primary btn-user btn-block"}
                            />
                        </div>
                    </div>
                </Form>
            </div>
            {
                showMenu && !savedOrder ?
                    <ItemsToOrder orderUserDetails={{ type: selectedRadio, personDetails: { ...personDetails } }} onClickSendOrder={onClickSendOrder} />
                    :
                    savedOrder ? <Payment order={savedOrder} isCustomer /> : null
            }
            {
                popupMessage.header ?
                    <PopupMessage
                        title={popupMessage.header}
                        body={
                            <div style={{ fontSize: '1.2rem' }}>
                                <div >{popupMessage.body.topText || ''}</div>
                                <ul>
                                    {
                                        popupMessage.body.items.map((message, key) => (
                                            <li key={key} className="mt-2" >
                                                {message}
                                            </li>
                                        ))
                                    }
                                </ul>
                                <h5>{popupMessage.body.bottomText || ''}</h5>
                            </div>

                        }
                        onClose={() => {
                            if (popupMessage.header !== 'Error')
                                cleanAll()
                            else {
                                setPopupMessage({ header: '', body: { topText: '', items: [''], bottomText: '' } })
                            }
                        }}
                        status={popupMessage.header === 'Error' ?
                            'error'
                            :
                            popupMessage.header.includes('Order Details') ?
                                'success'
                                :
                                'info'
                        }
                        closeOnlyWithBtn
                        withOk={popupMessage.header !== 'Error'}
                        okBtnText="Payment"
                        onClickOk={e => {
                            e.preventDefault()
                            setPopupMessage({ header: '', body: { topText: '', items: [''], bottomText: '' } })
                            // setSavedOrder(true)
                        }}
                        cancelBtnText="Homepage"
                        navigateTo="/"
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>

    );
};

export default OrderPage;