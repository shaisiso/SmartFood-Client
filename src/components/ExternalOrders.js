import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Accordion, Card, FloatingLabel, Form, FormControl, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import OrderService from '../services/OrderService';
import ShiftService from '../services/ShiftService';
import { addressToString, enumForClass, enumForReading, extractHttpError, format2Decimals, lastCharIsDigit } from '../utility/Utils';
import CustomToggle from './CustomToggle';
import PopupMessage from './PopupMessage';
import { ColorRing } from 'react-loader-spinner';

const ExternalOrders = props => {
    const [exteranlOrders, setExteranlOrders] = useState([])
    const [propsOrderPrev, setPropOrdersPrev] = useState([])
    const [statuses, setStatuses] = useState([])
    const [showUpdates, setShowUpdates] = useState({ person: false, comments: false, payment: false})
    const [personUpdate, setPersonUpdate] = useState({})
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState({ status: false, person: false , deliveryGuy: false })
    const [activeDeliveryGuys, setActiveDeliveryGuys] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            getStatuses()
        }
        getActiveGeliveryGuys()

        if (props.exteranlOrders !== propsOrderPrev) {
            setExteranlOrders([...props.exteranlOrders])
            setPropOrdersPrev(props.exteranlOrders)
        }
    }, [props.exteranlOrders, exteranlOrders, propsOrderPrev]);

    const getStatuses = () => {
        OrderService.getAllStatuses()
            .then(res => {
                setStatuses(res.data)
            }).catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const getActiveGeliveryGuys = async () => {
        await ShiftService.getDeliveryGuyInShift()
            .then(res => {
                let deliveryGuys = [{ id: -1, name: '' }]
                deliveryGuys.push(...res.data)
                setActiveDeliveryGuys(deliveryGuys)
            }).catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const onChangeStatus = (e, order) => {
        let status = e.target.value
        if (status.includes('Closed')) {
            setOrderToUpdate({ ...order })
            setPopupMessage({ title: 'Closing Order', messages: ['Are you sure you want to close this order ?'] })
        }
        else {
            updateOrderStatus(order, status)
        }
    }
    const updateOrderStatus = async (order, status) => {
        setShowLoader({ ...showLoader, status: true })
        let o = { ...order, status: enumForClass(status) }
        await OrderService.updateOrderStatus(o)
            .then(res => {
                let orderIndex = exteranlOrders.findIndex(o => o.id === order.id)
                let updatedOrders = [...exteranlOrders]
                updatedOrders[orderIndex] = { ...order, status: res.data.status }
                setExteranlOrders([...updatedOrders])
            })
            .catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        setShowLoader({ ...showLoader, status: false })
    }
    const onChangeDeliveryGuy = async (e, order) => {
        setShowLoader({ ...showLoader, deliveryGuy: true })

        let id = Number(e.target.value)
        let deliveryGuy
        if (id === -1)
            deliveryGuy = null
        else
            deliveryGuy = activeDeliveryGuys.find(dg => dg.id === id)
        let delivery = { id: order.id, person: order.person, deliveryGuy: deliveryGuy }
        await OrderService.updateDelivery(delivery)
            .then(res => {
                let orderIndex = exteranlOrders.findIndex(o => o.id === order.id)
                let updatedOrders = [...exteranlOrders]
                updatedOrders[orderIndex] = { ...order, deliveryGuy: { ...res.data.deliveryGuy } }
                setExteranlOrders([...updatedOrders])
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader({ ...showLoader, deliveryGuy: false })

    }
    const onClickUpdatePerson = (e, order) => {
        e.preventDefault()
        if (!showUpdates.person) {
            let address = order.person.address ? order.person.address : { city: '', streetName: '', houseNumber: '', entrance: '', apartmentNumber: '' }
            setPersonUpdate({ ...order.person, address: address })
        }
        else {
            //send update to api
            updatePerson(order)
        }
        setShowUpdates({ ...showUpdates, person: !showUpdates.person })
    }
    const updatePerson = async (order) => {
        setShowLoader({ ...showLoader, person: true })
        let responseOrder
        let items = order.items
        items.forEach(i => delete i.order)
        if (order.type === 'TA') {
            let takeAway = { id: order.id, person: { ...personUpdate, addres: { ...order.person.address } } }
            if (takeAway.person.address && (!takeAway.person.address.city || (takeAway.person.address.city && takeAway.person.address.city === '')))
                delete takeAway.person.address
            console.log(takeAway)
            if (personUpdate.phoneNumber !== order.person.phoneNumber) //new person
                takeAway.person = { phoneNumber: personUpdate.phoneNumber, name: personUpdate.name }
            await OrderService.updatePerson(order.id, takeAway.person)
                .then(res => { responseOrder = { ...res.data } })
                .catch(err => {
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })
        } else {
            let delivery = { id: order.id, person: { ...personUpdate }, deliveryGuy: order.deliveryGuy }
            if (personUpdate.phoneNumber !== order.person.phoneNumber) //new person
                delete delivery.person.id
            await OrderService.updatePerson(delivery.id, delivery.person)
                .then(res => { responseOrder = { ...res.data } })
                .catch(err => {
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })
        }
        let orderIndex = exteranlOrders.findIndex(o => o.id === order.id)
        let updatedOrders = [...exteranlOrders]
        updatedOrders[orderIndex] = { ...order, person: { ...responseOrder.person } }
        setExteranlOrders([...updatedOrders])
        setShowLoader({ ...showLoader, person: false })

    }
    const onClickCancelUpdatePerson = e => {
        e?.preventDefault()
        setShowUpdates({ ...showUpdates, person: false })
        setPersonUpdate({})
    }

    const cancelUpdates = () => {
        //setPaymentAmout(0)
        setPersonUpdate({})
        setShowUpdates({ person: false, payment: false })
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

    const onClickCancelOrder = (e, order) => {
        e.preventDefault()
        OrderService.deleteOrder(order).catch(err => {
            setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
        })
    }
    const onSelectedIndexChanged = (index)=>{
        setSelectedIndex(index)
    }
    const getRemainingAmount = (order) => Math.max(format2Decimals(order.totalPriceToPay - order.alreadyPaid), 0)
    return (
        <div>
            <Accordion>
                {
                    exteranlOrders ?
                        exteranlOrders.map((order, key) =>
                            <div className="row" key={key}>
                                <div className="col col-md-10 col-12 pe-0">
                                    <Card>
                                        <Card.Header>
                                            <CustomToggle eventKey={key} index={key} selectedIndex={selectedIndex} onSelectedIndexChanged={onSelectedIndexChanged}
                                                name={
                                                    <span>
                                                        <span style={{ color: order.type === 'D' ? '#0060ff' : '#e0a000' }}>{`#${order.id}-${order.type}`}</span>
                                                        <span>{order.type === 'D' ? ` - ${addressToString(order.person.address)}` : ''} : {`${enumForReading(order.status)} ${order.date} ${order.hour}`}  </span>
                                                    </span>
                                                }
                                                onClickToggle={cancelUpdates}
                                            />
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
                                                                <ColorRing
                                                                    visible={showLoader.status}
                                                                    ariaLabel="blocks-loading"
                                                                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle ps-4 pe-3" ><h6>Customer Details: </h6>{order.person.name} - {order.person.phoneNumber}, {addressToString(order.person.address)}
                                                                <button className="btn btn-primary btn-sm mx-2" onClick={e => onClickUpdatePerson(e, order)}>Update</button>
                                                                {
                                                                    showUpdates.person ?

                                                                        <span >
                                                                            <button className="btn btn-danger btn-sm mx-2" onClick={onClickCancelUpdatePerson}>Cancel</button>
                                                                            <FloatingLabel label="*Phone Number" className='mt-1'>
                                                                                <input type="tel" className="col col-xl-2 col-lg-4 form-control" name="phoneNumber" placeholder="*Phone Number" required
                                                                                    value={personUpdate.phoneNumber} onChange={e => onChangePersonDetails(e, order)} />
                                                                            </FloatingLabel>
                                                                            <FloatingLabel controlId="floatingInput" label="*Name">
                                                                                <FormControl type="text" name="name" className="col col-xl-2 col-lg-4 form-control" required placeholder="*Name"
                                                                                    value={personUpdate.name} onChange={e => onChangePersonDetails(e, order)} />
                                                                            </FloatingLabel>
                                                                            {
                                                                                order.type.includes('D') ?
                                                                                    <>
                                                                                        <FloatingLabel label="*City">
                                                                                            <input type="text" className="col col-xl-2 col-lg-4 form-control" placeholder="*City" name="address.city"
                                                                                                value={personUpdate.address.city || ''} onChange={e => onChangePersonDetails(e, order)} required />
                                                                                        </FloatingLabel>
                                                                                        <FloatingLabel label="*Street Name">
                                                                                            <input type="text" className="col col-xl-2 col-lg-4 form-control" placeholder="*Street Name" name="address.streetName"
                                                                                                value={personUpdate.address.streetName || ''} onChange={e => onChangePersonDetails(e, order)} required />
                                                                                        </FloatingLabel>
                                                                                        <FloatingLabel label="*House Number">
                                                                                            <input type="number" className="col col-xl-2 col-lg-4 form-control" placeholder="*House Number" name='address.houseNumber' min={0}
                                                                                                value={personUpdate.address.houseNumber || ''} onChange={e => onChangePersonDetails(e, order)} required />
                                                                                        </FloatingLabel>
                                                                                        <FloatingLabel label="Entrance">
                                                                                            <input type="text" className="col col-xl-2 col-lg-4 form-control" name='address.entrance'
                                                                                                value={personUpdate.address.entrance || ''} onChange={e => onChangePersonDetails(e, order)} />
                                                                                        </FloatingLabel>
                                                                                        <FloatingLabel label="Apartment Number">
                                                                                            <input type="number" className="col col-xl-2 col-lg-4 form-control" name='address.apartmentNumber' min={0}
                                                                                                value={personUpdate.address.apartmentNumber || ''} onChange={e => onChangePersonDetails(e, order)} />
                                                                                        </FloatingLabel>
                                                                                    </>
                                                                                    : null
                                                                            }
                                                                        </span>
                                                                        : null
                                                                }
                                                                <ColorRing
                                                                    visible={showLoader.person}
                                                                    ariaLabel="blocks-loading"
                                                                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                                                                />
                                                            </td>
                                                        </tr>
                                                        {
                                                            order.type === 'D' ?
                                                                <tr>
                                                                    <td className="align-middle ps-4 pe-3" ><h6>Delivery Guy: </h6>
                                                                        <Form.Select className="col col-xl-2 col-lg-3 col-sm-6 " aria-label="Change Delivery Guy" onChange={e => onChangeDeliveryGuy(e, order)} value={order.deliveryGuy ? order.deliveryGuy.id : -1} >
                                                                            {
                                                                                activeDeliveryGuys.map((deliveryGuy, key) => (
                                                                                    <option key={key} value={deliveryGuy.id} >{deliveryGuy.name}</option>
                                                                                ))
                                                                            }
                                                                        </Form.Select>
                                                                        <ColorRing
                                                                            visible={showLoader.deliveryGuy}
                                                                            ariaLabel="blocks-loading"
                                                                            colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                :
                                                                null
                                                        }
                                                        <tr >
                                                            <td className="align-middle ps-4 pe-3">
                                                                <h6>Items:</h6>
                                                                {
                                                                    order.items.map((itemInOrder, itemKey) =>
                                                                        <tr key={itemKey} className="align-middle ps-4 pe-3" >{itemInOrder.item.name} {itemInOrder.itemComment} - {format2Decimals(itemInOrder.price)}₪
                                                                        </tr>
                                                                    )
                                                                }
                                                                <Link to={`/employee/order/edit/${order.id}`}>
                                                                    <button className="btn btn-primary btn-sm my-auto" >Edit Items or Payment</button>
                                                                </Link>
                                                            </td>


                                                        </tr>
                                                        <tr>
                                                            <td className="align-middle ps-4 pe-3" ><h6>Comments: </h6>{order.orderComment}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <div className="align-middle ps-4 pe-3" ><h6>Bill: </h6>
                                                                <tr> Total price: {format2Decimals(order.totalPriceToPay)}₪</tr>
                                                                <tr> Paid: {format2Decimals(order.alreadyPaid)}₪</tr>
                                                                <tr> Remaining Amount: {getRemainingAmount(order)}₪</tr>
                                                                {/* <tr>
                                                                    {
                                                                        showUpdates.payment ?
                                                                            <span>
                                                                                <input type="number" min={0} max={getRemainingAmount(order)} className=" form-control" name="comment" placeholder="Order Comment"
                                                                                    value={paymentAmount} onChange={onChangePayment} />
                                                                                <button className="btn btn-danger mx-2" onClick={onClickCancelPayment}>Cancel</button>
                                                                            </span>
                                                                            :
                                                                            null
                                                                    }
                                                                    <button className="btn btn-primary  mx-2 my-1" onClick={e => onClickPay(e, order)} disabled={getRemainingAmount(order) === 0}>Pay</button>
                                                                </tr> */}
                                                            </div>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Form>
                                        </Accordion.Collapse>
                                    </Card>
                                </div>
                                <div className="col col-md-2 col-12 align middle my-auto ">
                                    <button className="btn btn-danger  mx-auto " onClick={e => onClickCancelOrder(e, order)}>Cancel Order</button>

                                </div>
                            </div>

                        )
                        :
                        null
                }
            </Accordion >
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
                            popupMessage.title.toLowerCase().includes('closing') ? 'info' : 'success'
                        }
                        closeOnlyWithBtn
                        withOk={popupMessage.title.toLowerCase().includes('closing')}
                        okBtnText={popupMessage.title.toLowerCase().includes('closing') ? 'Yes' : null}
                        cancelBtnText={popupMessage.title.toLowerCase().includes('closing') ? 'No' : null}
                        onClickOk={e => {
                            e.preventDefault()
                            updateOrderStatus(orderToUpdate, 'Closed')
                            setPopupMessage({ title: '', messages: [''] })
                        }}
                        onClickCancel={e => {
                            e.preventDefault()
                            setOrderToUpdate(null)
                            setPopupMessage({ title: '', messages: [''] })
                        }}

                    >
                    </PopupMessage>
                    :
                    null
            }
        </div >
    );
};

export default ExternalOrders;