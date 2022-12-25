import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import OrderService from '../services/OrderService';
import { extractHttpError } from '../utility/Utils';
import PopupMessage from './PopupMessage';
import ItemsToOrder from './ItemsToOrder'
import ItemInOrderService from '../services/ItemInOrderService';
const EditOrder = () => {
    const [order, setOrder] = useState({})
    const [chosenItemsToDisplay, setChosenItems] = useState({})

    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getOrder()
        }
    });
    const getOrder = () => {
        var regEx = new RegExp('/employee/order/edit/', "ig");
        let orderId = window.location.pathname.replace(regEx, '')
        OrderService.getOrderById(orderId)
            .then(res => {
                let chosenItems = ItemInOrderService.buildChosenItems(res.data.items)
                setOrder(res.data)
                setChosenItems(chosenItems)
            })
            .catch(err => {
                console.log(err)
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }


    const onClickSendOrder = async (chosenItemsToDisplay, orderComment) => {
        let updatedItemsInOrder = ItemInOrderService.getItemsInOrderFromChosenItems(chosenItemsToDisplay)
        let itemsToAdd = updatedItemsInOrder.filter(newItem => !newItem.id)
        let itemsIdToDelete = order.items.filter(oldItem => !updatedItemsInOrder.includes(oldItem))
            .map(filtered => filtered.id)
        let errorsMsg = []
        if (itemsToAdd.length > 0) {
            await OrderService.addItemsListToOrder(order.id, itemsToAdd)
                .then(res => {
                }).catch(err => {
                    console.log(err)
                    errorsMsg.push([...extractHttpError(err)])
                })
        }
        if (itemsIdToDelete.length > 0) {
            itemsIdToDelete.forEach(async itemId => {
                await OrderService.deleteItemById(itemId)
                    .catch(err => {
                        errorsMsg.push([...extractHttpError(err)])
                        return
                    })
            })
        }
        if (orderComment!== order.orderComment){
            OrderService.updateOrderComment(order.id, orderComment).catch(err => {
                errorsMsg.push([...extractHttpError(err)])
            })
        }
        if (errorsMsg.length > 0)
            setPopupMessage({ title: 'Error', messages: [...errorsMsg] })
        else
            setPopupMessage({ title: 'Update Succeed', messages: ['Order was updated'] })

        // OrderService.
    }
    return (
        <div>
            <ItemsToOrder chosenItems={chosenItemsToDisplay} sendOrderBtnText="Update Order" onClickSendOrder={onClickSendOrder} orderComment={order.orderComment} />
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
                            getOrder()
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            'info'
                        }
                        closeOnlyWithBtn
                        withOk={popupMessage.title !== 'Error'}
                        navigateTo="/employee/tasks"
                        okBtnText="OK"
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default EditOrder;