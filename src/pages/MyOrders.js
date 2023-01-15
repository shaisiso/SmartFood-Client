import React, { Fragment } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import SockJS from 'sockjs-client';
import PopupMessage from '../components/PopupMessage';
import ReadOnlyRow from '../components/ReadOnlyRow';
import OrderService from '../services/OrderService';
import TokenService from '../services/TokenService';
import { API_URL, enumForReading } from '../utility/Utils';
import { over } from 'stompjs';

const SOCKET_URL = `${API_URL}/api/ws`;
var stompClient = null;

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [ordersToShow, setOrdersToShow] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [showOldOrders, setShowOldOrders] = useState(JSON.parse(window.localStorage.getItem("showOldOrders") || 'true'));
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [] })

    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            getUserOrders()
        }
        if (TokenService.getMember())
            connectWebSocekt()
    })
    const connectWebSocekt = () => {
        let Sock = new SockJS(SOCKET_URL);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }
    const onConnected = () => {
        stompClient.subscribe(`/topic/external-orders/${TokenService.getMember().id}`, onStatusUpdate);
    }
    
    const onError = (err) => {
        console.log(err);
    }
    const onStatusUpdate = payload=>{
        getUserOrders()
    }
    const getUserOrders = async () => {
        setShowLoader(true)
        if (! TokenService.getMember() )
            return
        let id = TokenService.getMember().id 
        let o = await OrderService.getExternalOrdersOfMember(id)
        setOrders(o)
        filterOrders(o, showOldOrders)
        setShowLoader(false)
    }
    const onChangeShowOldOrders = e => {
        let fieldValue = e.target.checked
        setShowOldOrders(fieldValue)
        window.localStorage.setItem("showOldOrders", fieldValue)
        filterOrders(orders, fieldValue)
    }
    const filterOrders = (allOrders, showClosed) => {
        if (showClosed)
            setOrdersToShow(allOrders)
        else {
            let currentOrders = allOrders.filter(o => o.status !== 'CLOSED')
            setOrdersToShow([...currentOrders])
        }
    }
    const onClickItems = (e, order) => {
        e.preventDefault()
        setPopupMessage({ title: `Order #${order.id}`, messages: order.items.map(i => `${i.item.name} - ${i.price}₪`) })

    }
    return (
        <div className="container text-center py-4" style={{ background: '#ffffffc0' }}>
            <h2><b><u>My Orders</u></b></h2>
            <div className="text-center">
                <ColorRing
                    visible={showLoader}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
                <div className="d-flex justify-content-center pt-5 h5">
                    <Form.Check
                        inline
                        label="Show Closed Orders"
                        name="forMembersOnly"
                        type='checkbox'
                        id={`1`}
                        value={true}
                        checked={showOldOrders === true}
                        onChange={onChangeShowOldOrders}
                    />
                </div>
            </div>
            {
                ordersToShow.length > 0 ?
                    <table className="table table-striped table-bordered text-center my-4" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr>
                                <th > Order ID </th>
                                <th > Type </th>
                                <th > Date </th>
                                <th > Hour </th>
                                <th > Cost </th>
                                <th > Status </th>
                                <th > Items </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersToShow.map((o, key) => (
                                <Fragment key={key}>
                                    <ReadOnlyRow
                                        item={{
                                            id: o.id, type: o.type, date: o.date, hour: o.hour, price: o.totalPriceToPay, status: enumForReading(o.status)
                                            , items: <button className='btn btn-primary' onClick={e => onClickItems(e, o)}>Show Items</button>
                                        }}
                                        withId
                                        rowColor={o.status === 'CLOSED' ? '#80808090' : o.type === 'D' ? '#00ffff40' : '#e0a00040'}
                                    />
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
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

export default MyOrders;