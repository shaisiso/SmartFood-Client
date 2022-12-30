import React, { useState, useEffect, useRef } from 'react';
import { ColorRing } from 'react-loader-spinner';
import TableService from '../services/TableService';
import { extractHttpError } from '../utility/Utils';
import PopupMessage from '../components/PopupMessage';
import ItemsToOrder from '../components/ItemsToOrder'
import OrderService from '../services/OrderService';
import ItemInOrderService from '../services/ItemInOrderService';
import { FloatingLabel, FormControl } from 'react-bootstrap';
//import { Row } from 'react-bootstrap';
const OrderOfTable = () => {
    const [table, setTable] = useState({})
    const [actualDinersNum, setActualDiners] = useState(1)
    const [popupMessage, setPopupMessage] = useState({})
    const [showLoader, setShowLoader] = useState(true)
    const [order, setOrder] = useState({})
    const [sentForCancelQuantity, setSentForCancelQuantity] = useState(0)
    const mounted = useRef();
    useEffect(() => {
        const fetchData = async () => {
            let tableId = await getTable();
            getOrder(tableId)
            getSentForCancelQuantity(tableId)
        }
        if (!mounted.current) {
            mounted.current = true;
            fetchData()
        }
    });
    const getTable = async () => {
        setShowLoader(true)
        var regEx = new RegExp('/employee/tables/', "ig");
        let tableId = window.location.pathname.replace(regEx, '')
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
    const getOrder = (tableId) => {
        console.log('tableId', tableId)
        OrderService.getActiveOrderOfTable(tableId || table.tableId)
            .then(res => {
                setOrder(res.data)
            }).catch(err => {
                if (err.response.status !== 404)
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const getSentForCancelQuantity = async (tableId) => {
        await OrderService.getItemInOrderOfTableForCancel(tableId)
            .then(res => {
                console.log('res.data', res.data)
                setSentForCancelQuantity(res.data.length)
            }).catch(err =>
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            )
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
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })
        } else {
            // update order
            let updatedItemsInOrder = ItemInOrderService.getItemsInOrderFromChosenItems(chosenItemsToDisplay)
            let itemsToAdd = updatedItemsInOrder.filter(newItem => !newItem.id)
            console.log('updatedItemsInOrder', updatedItemsInOrder)
            console.log('itemsToAdd', itemsToAdd)
            if (itemsToAdd.length > 0) {
                await OrderService.addItemsListToOrder(order.id, itemsToAdd)
                    .then(res => {
                        setPopupMessage({ title: 'Order', messages: ['Order was sent to the kitchen'] })
                    })
                    .catch(err => {
                        setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                    })
            }
        }

    }
    const cleanAll = () => {
        window.location.reload(false); // false - cached version of the page, true - complete page refresh from the server
    }
    return (
        <div className="container ">
            <div className=" text-center">
                <h1 className="py-4 bold"><b><u>Table #{table.tableId}</u></b></h1>
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
                table.isBusy ? <ItemsToOrder chosenItems={ItemInOrderService.buildChosenItems(order.items)} onClickSendOrder={onClickSendOrder}
                    withAskForCancel sentForCancelQuantity={sentForCancelQuantity} /> : null
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
                            cleanAll()
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            'success'
                        }
                        withOk={popupMessage.title.includes('Order')}
                        okBtnText='OK'
                        navigateTo="/employee/tables"
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