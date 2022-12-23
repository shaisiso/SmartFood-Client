import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Accordion, Card, FloatingLabel, Form, FormControl, Table } from 'react-bootstrap';
import OrderService from '../services/OrderService';
import { addressToString, enumForClass, enumForReading, extractHttpError, lastCharIsDigit } from '../utility/Utils';
import CustomToggle from './CustomToggle';
import PopupMessage from './PopupMessage';

const ExternalOrders = props => {
    const [exteranlOrders, setExteranlOrders] = useState([])
    const [statuses, setStatuses] = useState([])
    const [showUpdates, setShowUpdates] = useState({ person: false, comments: false, payment: false })
    const [personUpdate, setPersonUpdate] = useState({})
    const [orderCommentUpdate, setOrderCommentUpdate] = useState('')
    const [paymentAmount, setPaymentAmout] = useState(0)
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            getStatuses()
        }
        console.log('ExternalOrders: ', exteranlOrders)
        setExteranlOrders(props.exteranlOrders)
    }, [props.exteranlOrders, exteranlOrders]);

    const getStatuses = () => {
        OrderService.getAllStatuses()
            .then(res => {
                setStatuses(res.data)
            }).catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
    }
    const onChangeStatus = (e, order) => {
        console.log(e.target.value)
        let o = { ...order, status: enumForClass(e.target.value) }
        OrderService.updateOrderStatus(o).catch(err => {
            var errMsg = extractHttpError(err)
            setPopupMessage({ title: 'Error', messages: errMsg })
        })
    }
    const onClickUpdatePerson = (e, order) => {
        e.preventDefault()
        if (!showUpdates.person)
            setPersonUpdate({ ...order.person })
        else {
            //send update to api
            let items = order.items
            items.forEach(i => delete i.order)
            let delivery = { id: order.id, person: { ...personUpdate }, deliveryGuy: order.deliveryGuy }
            OrderService.updateDelivery(delivery).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        }
        setShowUpdates({ ...showUpdates, person: !showUpdates.person })
    }
    const onClickCancelUpdatePerson = e => {
        e?.preventDefault()
        setPersonUpdate({})
        setShowUpdates({ ...showUpdates, person: false })
    }
    const onClickCancelUpdateComment = e => {
        e?.preventDefault()
        setOrderCommentUpdate('')
        setShowUpdates({ ...showUpdates, comments: false })
    }
    const onClickUpdateComment = (e, order) => {
        e.preventDefault()
        if (!showUpdates.comments)
            setOrderCommentUpdate(order.orderComment)
        else {
            //send update to api
            OrderService.updateOrderComment(order.id, orderCommentUpdate).then(res => {
                console.log(res)
            }).catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        }
        setShowUpdates({ ...showUpdates, comments: !showUpdates.comments })
    }
    const onChangeComment = e => {
        e.preventDefault()
        setOrderCommentUpdate(e.target.value)
    }
    const cancelUpdates = () => {
        onClickCancelUpdatePerson()
        onClickCancelUpdateComment()
        onClickCancelPayment()
    }
    const onClickCancelPayment =e=>{
        e?.preventDefault()
        setPaymentAmout(0)
        setShowUpdates({ ...showUpdates, payment: false })
    }
    const onChangePersonDetails = (e, order) => {
        let fieldName = e.target.getAttribute("name")
        let fieldValue = e.target.value
        let details = { ...personUpdate, address: { ...personUpdate.address } }
        if (fieldName.includes('address')) {
            let fields = fieldName.split('.')
            if (fieldName.includes('entrance') && fieldValue.length > 1)
                return
            details[fields[0]][fields[1]] = fieldValue
        } else {
            if (fieldName.includes('phoneNumber') && (fieldValue.length > 10 || !lastCharIsDigit(fieldValue)))
                return
            details[fieldName] = fieldValue
        }
        setPersonUpdate({ ...details })
    }
    const onClickPay = (e,order) => {
        e.preventDefault()
        setShowUpdates({ ...showUpdates, payment: !showUpdates.payment })
        if(showUpdates.payment){
            OrderService.payment(order.id,paymentAmount)
            .then(res=>{
                setPopupMessage({ title: 'Payment Successful', messages: [`The payment with amount of${paymentAmount}₪ has been confirmed`,`Remaining Price: ${res.data.totalPriceToPay- res.data.alreadyPaid}₪` ]})
            })
            .catch(err=>{
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        }
        else{
            setPaymentAmout(order.totalPriceToPay-order.alreadyPaid)
        }
    }
    const onChangePayment=(e) =>{
        e.preventDefault()
        setPaymentAmout(e.target.value)
    }

    return (
        <div>
            <Accordion>
                {
                    exteranlOrders ?
                        exteranlOrders.map((order, key) =>
                            <Card key={key}>
                                <Card.Header>
                                    <CustomToggle eventKey={key} name={`#${order.id}-${order.type}: ${enumForReading(order.status)} ${order.date} ${order.hour}`} onClickToggle={cancelUpdates} />
                                </Card.Header>
                                <Accordion.Collapse eventKey={key} >
                                    <Form>
                                        <Table bordered className="m-0" >
                                            <tbody >
                                                <tr>
                                                    <td className="align-middle ps-4 pe-3" ><h6>Date: </h6>{order.date}</td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle ps-4 pe-3" ><h6>Hour: </h6>{order.hour}</td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle ps-4 pe-3" ><h6>Stauts: </h6>
                                                        <Form.Select className="col col-xl-2 col-lg-3 col-sm-6 " aria-label="Change Status" onChange={e => onChangeStatus(e, order)} name="Status" value={enumForReading(order.status)}>
                                                            {
                                                                statuses.map((status, key) => (
                                                                    <option key={key} value={status} >{status}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle ps-4 pe-3" ><h6>Customer Details: </h6>{order.person.name} - {order.person.phoneNumber}, {addressToString(order.person.address)}
                                                        <button className="btn btn-primary btn-sm mx-2" onClick={e => onClickUpdatePerson(e, order)}>Update</button>
                                                        {
                                                            showUpdates.person ?

                                                                <span >
                                                                    <button className="btn btn-danger btn-sm mx-2" onClick={onClickCancelUpdatePerson}>Cancel</button>
                                                                    <FloatingLabel label="*Phone Number" >
                                                                        <input type="tel" className="col col-xl-2 col-lg-4 form-control" name="phoneNumber" placeholder="*Phone Number" required
                                                                            value={personUpdate.phoneNumber} onChange={e => onChangePersonDetails(e, order)} />
                                                                    </FloatingLabel>
                                                                    <FloatingLabel controlId="floatingInput" label="*Name">
                                                                        <FormControl type="text" name="name" className="col col-xl-2 col-lg-4 form-control" required placeholder="*Name"
                                                                            value={personUpdate.name} onChange={e => onChangePersonDetails(e, order)} />
                                                                    </FloatingLabel>

                                                                    <FloatingLabel label="*City">
                                                                        <input type="text" className="col col-xl-2 col-lg-4 form-control" placeholder="*City" name="address.city"
                                                                            value={personUpdate.address.city} onChange={e => onChangePersonDetails(e, order)} required />
                                                                    </FloatingLabel>
                                                                    <FloatingLabel label="*Street Name">
                                                                        <input type="text" className="col col-xl-2 col-lg-4 form-control" placeholder="*Street Name" name="address.streetName"
                                                                            value={personUpdate.address.streetName} onChange={e => onChangePersonDetails(e, order)} required />
                                                                    </FloatingLabel>
                                                                    <FloatingLabel label="*House Number">
                                                                        <input type="number" className="col col-xl-2 col-lg-4 form-control" placeholder="*House Number" name='address.houseNumber'
                                                                            value={personUpdate.address.houseNumber} onChange={e => onChangePersonDetails(e, order)} required />
                                                                    </FloatingLabel>
                                                                    <FloatingLabel label="Entrance">
                                                                        <input type="text" className="col col-xl-2 col-lg-4 form-control" name='address.entrance'
                                                                            value={personUpdate.address.entrance || ''} onChange={e => onChangePersonDetails(e, order)} />
                                                                    </FloatingLabel>
                                                                    <FloatingLabel label="Apartment Number">
                                                                        <input type="number" className="col col-xl-2 col-lg-4 form-control" name='address.apartmentNumber' min={0}
                                                                            value={personUpdate.address.apartmentNumber || ''} onChange={e => onChangePersonDetails(e, order)} />
                                                                    </FloatingLabel>
                                                                </span>
                                                                : null
                                                        }
                                                    </td>
                                                </tr>
                                                {
                                                    order.type === 'D' ?
                                                        <tr>
                                                            <td className="align-middle ps-4 pe-3" ><h6>Delivery Guy: </h6>{order.deliveryGuy ? order.deliveryGuy.name : ''}</td>
                                                        </tr>
                                                        :
                                                        null
                                                }
                                                <tr >
                                                    <div className="align-middle ps-4 pe-3">
                                                        <h6>Order items:</h6>

                                                        {
                                                            order.items.map((itemInOrder, itemKey) =>
                                                                <tr key={itemKey} className="align-middle ps-4 pe-3" >{itemInOrder.item.name} {itemInOrder.itemComment} - {itemInOrder.price}₪
                                                                </tr>
                                                            )
                                                        }
                                                    </div>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle ps-4 pe-3" ><h6>Comments: </h6>{order.orderComment}
                                                        {
                                                            showUpdates.comments ?
                                                                <span>
                                                                    <input type="tel" className="col col-xl-2 col-lg-4 form-control" name="comment" placeholder="Order Comment"
                                                                        value={orderCommentUpdate} onChange={onChangeComment} />
                                                                    <button className="btn btn-danger btn-sm mx-2" onClick={onClickCancelUpdateComment}>Cancel</button>
                                                                </span>
                                                                :
                                                                null
                                                        }
                                                        <button className="btn btn-primary btn-sm mx-2 my-1" onClick={e => onClickUpdateComment(e, order)}>Update</button>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <div className="align-middle ps-4 pe-3" ><h6>Bill: </h6>
                                                        <tr> Total price: {order.totalPriceToPay}₪</tr>
                                                        <tr> Paid: {order.alreadyPaid}₪</tr>
                                                        <tr>
                                                            {
                                                                showUpdates.payment ?
                                                                    <span>
                                                                        <input type="number" min={0} className=" form-control" name="comment" placeholder="Order Comment"
                                                                            value={paymentAmount} onChange={onChangePayment} />
                                                                        <button className="btn btn-danger mx-2" onClick={onClickCancelPayment}>Cancel</button>
                                                                    </span>
                                                                    :
                                                                    null
                                                            }
                                                            <button className="btn btn-primary  mx-2 my-1" onClick={e => onClickPay(e, order)}>Pay</button>
                                                        </tr>
                                                    </div>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Form>
                                </Accordion.Collapse>
                            </Card>
                        )
                        :
                        null
                }
            </Accordion>
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

export default ExternalOrders;