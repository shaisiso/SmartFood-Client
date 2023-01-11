import React, { useState, useEffect, useRef } from 'react';
import { ColorRing } from 'react-loader-spinner';
import TableService from '../services/TableService';
import { extractHttpError } from '../utility/Utils';
import PopupMessage from '../components/PopupMessage';
import ItemsToOrder from '../components/ItemsToOrder'
import OrderService from '../services/OrderService';
import ItemInOrderService from '../services/ItemInOrderService';
import { FloatingLabel, FormControl } from 'react-bootstrap';
import Payment from '../components/Payment';
import TableReservationService from '../services/TableReservationService';

const INTERVAL_MS = 60000;

const OrderOfTable = (props) => {
    const [table, setTable] = useState({})
    const [tableReservation, setTableReservation] = useState({})
    const [actualDinersNum, setActualDiners] = useState(1)
    const [popupMessage, setPopupMessage] = useState({})
    const [showLoader, setShowLoader] = useState(true)
    const [order, setOrder] = useState({})
    const [sentForCancel, setSentForCancel] = useState([])
    const mounted = useRef();
    useEffect(() => {
        const fetchData = async () => {
            let tableId = await getTable();
            await getReservationIfExists(tableId);
            if (await getOrder(tableId))
                getSentForCancelQuantity(tableId)
        }
        if (!mounted.current) {
            mounted.current = true;
            fetchData()
        }
        const reservationsInterval = setInterval(() => {
            getReservationIfExists(table.tableId)
            console.log('Check Reservation if exists');
        }, INTERVAL_MS);
        return () => clearInterval(reservationsInterval);
    });
    const getTable = async () => {
        setShowLoader(true)
        let tableId
        if (!props.tableId) {
            var regEx = new RegExp('/employee/tables/', "ig");
            tableId = window.location.pathname.replace(regEx, '')
        } else
            tableId = props.tableId
        await TableService.getTableByTableId(tableId)
            .then(res => {
                setTable(res.data)
            })
            .catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        setShowLoader(false)
        return tableId
    }
    const getReservationIfExists = async (tableId) => {
        setShowLoader(true)
        await TableReservationService.getCurrentReservations()
            .then(res => {
                let reservation = [...res.data].find(r => r.table.tableId === Number(tableId))
                console.log('reservation', reservation)
                setTableReservation(reservation)
            }).catch(err => {
                console.log(err)
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const getOrder = async (tableId) => {
        let existedOrder
        await OrderService.getActiveOrderOfTable(tableId || table.tableId)
            .then(res => {
                existedOrder = res.data
                setOrder(res.data)
            }).catch(err => {
                console.log(err)
                if (err.response.status !== 404)
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        return existedOrder
    }
    const getSentForCancelQuantity = async (tableId) => {
        await OrderService.getItemInOrderOfTableForCancel(tableId)
            .then(res => {
                setSentForCancel([...res.data])
            }).catch(err => {
                console.log(err)
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const onChangeDiners = e => {
        setActualDiners(e.target.value)
    }
    const onClickOpenTable = async (e, setToBusy) => {
        e.preventDefault();
        setShowLoader(true)
        await TableService.changeTableBusy(table.tableId, setToBusy)
            .then(res => {
                setTable(res.data)
                //setOrder({ ...order, table: res.data })
            }).catch(err => {
                console.log(err)
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const onClickSendOrder = async (chosenItemsToDisplay, orderComment) => {
        if (!order.id) {
            //add new order
            let itemsInOrder = ItemInOrderService.getItemsInOrderFromChosenItems(chosenItemsToDisplay)
            let orderOfTable = { items: [...itemsInOrder], orderComment: orderComment, table: { ...table }, numberOfDiners: actualDinersNum }
            await OrderService.addNewOrderOfTable(orderOfTable)
                .then(res => {
                    setPopupMessage({ title: 'New Order', messages: ['Order was sent to the kitchen'] })
                })
                .catch(err => {
                    console.log(err)
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })
        } else {
            // update order
            let errorsMsg = []
            let updatedItemsInOrder = ItemInOrderService.getItemsInOrderFromChosenItems(chosenItemsToDisplay)
            let itemsToAdd = updatedItemsInOrder.filter(newItem => !newItem.id)
            if (itemsToAdd.length > 0) {
                await OrderService.addItemsListToOrder(order.id, itemsToAdd)
                    .catch(err => {
                        console.log(err)
                        errorsMsg.push([...extractHttpError(err)])
                    })
            }
            if (orderComment !== order.orderComment) {
                OrderService.updateOrderComment(order.id, orderComment).catch(err => {
                    console.log(err)
                    errorsMsg.push([...extractHttpError(err)])
                })
            }
            if (errorsMsg.length > 0)
                setPopupMessage({ title: 'Error', messages: [...errorsMsg] })
            else
                setPopupMessage({ title: 'Update Succeed', messages: ['Order was updated'] })
        }

    }
    const cleanAll = () => {
        window.location.reload(false); // false - cached version of the page, true - complete page refresh from the server
    }
    return (
        <div className="container ">
            <div className=" text-center">
                <h1 className="py-3 bold"><b><u>Table #{table.tableId}</u></b></h1>
                {
                    tableReservation && tableReservation.person ?
                        <div className="row mb-3 h5 justify-content-center text-center" style={{ color: 'red' }}>
                            *This table is reserved for {tableReservation.person.name} at {tableReservation.hour}. Phone: {tableReservation.person.phoneNumber}
                        </div>
                        :
                        null
                }

                <div className="row d-flex justify-content-center form-group">
                    <div className="col col-xxl-2 col-md-3 form-group">
                        <FloatingLabel controlId="floatingInput" label="Number Of Diners">
                            <FormControl type="number" min={1} max={20} name="name" className="form-control" required placeholder="Number Of Diners"
                                value={actualDinersNum} onChange={onChangeDiners} />
                        </FloatingLabel>
                    </div>
                    <div className="col col-3 my-auto text-center ">
                        {
                            !table.isBusy ?
                                <button className='btn btn-success mb-3' onClick={(e) => onClickOpenTable(e, true)}>Open Table</button>
                                :
                                <button className='btn btn-danger mb-3' onClick={(e) => onClickOpenTable(e, false)}>Close Table</button>
                        }
                    </div>
                </div>


                <div className="row text-center">
                    <ColorRing
                        visible={showLoader}
                        ariaLabel="blocks-loading"
                        colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                    />
                </div>
            </div>

            {
                table.isBusy ? <ItemsToOrder chosenItems={ItemInOrderService.buildChosenItems(order.items)} onClickSendOrder={onClickSendOrder} orderComment={order.orderComment}
                    withAskForCancel sentForCancel={sentForCancel} /> : null
            }
            {
                table.isBusy && order && order.items ?
                    <Payment order={order} isCustomer={props.isCustomer} />
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
                            if (popupMessage.title === 'Error')
                                setPopupMessage({ title: '', messages: [''] })
                            else
                                cleanAll()
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            'success'
                        }
                        withOk={popupMessage.title.includes('Order')}
                        okBtnText='OK'
                        onClickOk={e=>{
                            e.preventDefault()
                            cleanAll()
                        }}
                       // navigateTo="/employee/tables"
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default OrderOfTable;