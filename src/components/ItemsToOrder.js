import { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API_URL, extractHttpError } from '../utility/Utils';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { ColorRing } from 'react-loader-spinner'
import Table from 'react-bootstrap/Table';
import PopupMessage from './PopupMessage';
import { enumForReading } from '../utility/Utils';
import { FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import CustomToggle from './CustomToggle';
import OrderService from '../services/OrderService';
import ItemInOrderService from '../services/ItemInOrderService';
import RoleService from '../services/RoleService';
import TokenService from '../services/TokenService';

const ItemsToOrder = (props) => {
    const [menu, setMenu] = useState([])
    const [categories, setCategories] = useState([])
    const [showLoader, setShowLoader] = useState(true)
    const [chosenItemsToDisplay, setChosenItems] = useState([])
    const [chosenInitFlag, setChosenInitFlag] = useState(true)
    const [orderComment, setOrderComment] = useState('')
    const [popupMessage, setPopupMessage] = useState({ header: '', body: { topText: '', items: [''], bottomText: '' } })
    const [loaded, setLoaded] = useState(true)
    const [cancelItemQuantity, setCancelItemQuantity] = useState(1)
    const [cancelReason, setCancelReason] = useState('')
    const [itemToCancel, setItemToCancel] = useState({})

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getMenuData();
        }
        if (chosenInitFlag && props.chosenItems && props.chosenItems.length > 0) {
            setChosenItems([...props.chosenItems])
            setOrderComment(props.orderComment)
            setChosenInitFlag(false)
        }
    }, [props.chosenItems, chosenItemsToDisplay, chosenInitFlag, props.orderComment]);
    const getMenuData = async () => {
        await Axios.get(`${API_URL}/api/menu/categorized`)
            .then(res => {
                setMenu(res.data)
                setCategories(Object.keys(res.data))
            }).catch(err => {
                setPopupMessage({ header: `Error`, body: { items: extractHttpError(err) } })
            })
        setShowLoader(false)
    }

    const clickOnItem = item => {
        var oldChosen = chosenItemsToDisplay
        let menuItem = menu[enumForReading(item.category)].find(i => i.itemId === item.itemId)


        let itemInOrder = { item: { ...menuItem }, itemComment: '', price: menuItem.price }
        let chosenItem = { ...menuItem, quantity: 1, itemsInOrder: [itemInOrder] }
        const newState = chosenItemsToDisplay.map(obj => {
            if (obj.itemId === chosenItem.itemId) {
                return { ...obj, quantity: (obj.quantity + 1), price: obj.price + chosenItem.price, itemsInOrder: [...obj.itemsInOrder, ...chosenItem.itemsInOrder] };
            }
            return obj;
        });
        var oldItemIndex = oldChosen.findIndex(i => i.itemId === chosenItem.itemId)
        if (oldItemIndex === -1) {
            newState.push(chosenItem)
        }
        setChosenItems(newState)

    }
    const onChangeQuantity = (event, item) => {
        let newQuantity = Number(event.target.value)
        if (newQuantity < getMinQuantity(item))
            return
        let itemPrice = menu[enumForReading(item.category)]
            .find(i => i.itemId === item.itemId).price
        let itemsInOrder = [...item.itemsInOrder]
        if (newQuantity < item.quantity)
            itemPrice = -1 * itemsInOrder.splice(itemsInOrder.length - 1, 1)[0].price
        else
            itemsInOrder.push({ item: { ...itemsInOrder[0].item }, price: itemsInOrder[0].price, itemComment: '' })
        const newState = chosenItemsToDisplay.map(obj => {
            if (obj.itemId === item.itemId) {
                return { ...obj, quantity: newQuantity, price: obj.price + itemPrice, itemsInOrder: [...itemsInOrder] };
            }
            return obj;
        });
        setChosenItems([...newState])
    }
    const getMinQuantity = (item) => {
        if (!isOldItem(item))
            return 1
        return props.chosenItems.find(i => i.itemId === item.itemId).quantity
    }
    const onClickDeleteItem = (itemToDelete) => {
        setChosenItems(chosenItemsToDisplay.filter(item => item !== itemToDelete))
    }
    const onChangeCancelQuantity = e => setCancelItemQuantity(Number(e.target.value))

    const onChangeCanceReason = e => setCancelReason(e.target.value)

    const onClickCancelItem = async (e, item) => {
        e.preventDefault()
        if (RoleService.isManager(TokenService.getEmployee())) {
            // Delete item
            setItemToCancel(item)
            setPopupMessage(
                {
                    header: 'Delete item',
                    body: {
                        topText: `Choose how many ${item.name} you want to delete: `,
                        items: [
                            <FloatingLabel label="Quantity"  >
                                <Form.Control size="sm" type="number" className='col col-xl-6 '
                                    min={1} max={getMinQuantity(item) - quantityOfItemInOrder(item)} required defaultValue={1}
                                    onChange={onChangeCancelQuantity} />
                            </FloatingLabel>,
                            <FloatingLabel label="Reason" >
                                <Form.Control size="sm" type="text" className='col col-xl-6 '
                                    onChange={onChangeCanceReason} placeholder="Reason" />
                            </FloatingLabel>
                        ],
                        bottomText: 'Be aware, you are going to delete these items permanently!'
                    }
                })

        } else { //no manager -> send request to cancel
            if (item.quantity === 1)
                cancelItem(item)
            else {
                setItemToCancel(item)
                setPopupMessage(
                    {
                        header: 'Request for cancel item',
                        body: {
                            topText: `Choose how many ${item.name} you want to cancel:`,
                            items: [
                                <FloatingLabel label="Quantity"  >
                                    <Form.Control size="sm" type="number" className='col col-xl-6 '
                                        min={1} max={getMinQuantity(item) - quantityOfItemInOrder(item)} required defaultValue={1}
                                        onChange={onChangeCancelQuantity} />
                                </FloatingLabel>,
                                <FloatingLabel label="Reason" >
                                    <Form.Control size="sm" type="text" className='col col-xl-6 '
                                        onChange={onChangeCanceReason} placeholder="Reason" />
                                </FloatingLabel>
                            ],
                            bottomText: 'This request will be sent for the shift manager that will decide whether to approve it or not.'
                        }
                    })
            }
        }


    }
    const cancelItem = async (item) => {
        setLoaded(false)
        let itemsInOrder = ItemInOrderService.getItemsInOrderFromChosenItems([item])
        let startIndex = itemsInOrder.length - cancelItemQuantity - quantityOfItemInOrder(item)
        let endIndex = itemsInOrder.length - quantityOfItemInOrder(item)
        for (let i = startIndex; i < endIndex; i++) {
            let itemInOrder = itemsInOrder[i]
            let cancelRequest = { itemInOrder: { ...itemInOrder }, reason: cancelReason }
            await OrderService.addRequestForCancelItem(cancelRequest)
                .then(res => {
                    setPopupMessage(
                        {
                            header: 'Cancel item',
                            body: { items: [`Request for cancel ${cancelItemQuantity} ${item.name} was sent to the shift manager for approving.`] }
                        })
                })
                .catch(err => {
                    setPopupMessage({ header: `Error`, body: { items: extractHttpError(err) } })
                })
        }
        setCancelReason('')
        setCancelItemQuantity(1)
        setLoaded(true)
    }
    const cancelAndDeleteItem = async item=>{
        setLoaded(false)
        let itemsInOrder = ItemInOrderService.getItemsInOrderFromChosenItems([item])
        let startIndex = itemsInOrder.length - cancelItemQuantity - quantityOfItemInOrder(item)
        let endIndex = itemsInOrder.length - quantityOfItemInOrder(item)
        for (let i = startIndex; i < endIndex; i++) {
            let itemInOrder = itemsInOrder[i]
            let cancelRequest = { itemInOrder: { ...itemInOrder }, reason: cancelReason }
            await OrderService.addCancelItemRequestAndDeleteItem(cancelRequest)
                .then(res => {
                    setPopupMessage(
                        {
                            header: 'Cancel item',
                            body: { items: [`${cancelItemQuantity} ${item.name} deleted from the order.`] }
                        })
                })
                .catch(err => {
                    setPopupMessage({ header: `Error`, body: { items: extractHttpError(err) } })
                })
        }
        setCancelReason('')
        setCancelItemQuantity(1)
        setLoaded(true)
    }
    const onClickSendOrder = async (e) => {
        e.preventDefault();
        setLoaded(false)
        await props.onClickSendOrder(chosenItemsToDisplay, orderComment)
        setLoaded(true)
    }

    const onChangeItemComment = (e, itemInOrder, ioKey) => {
        e.preventDefault();
        let chosenItems = chosenItemsToDisplay
        let itemIndex = chosenItemsToDisplay.findIndex(ch => ch.itemId === itemInOrder.item.itemId)
        chosenItems[itemIndex].itemsInOrder[ioKey].itemComment = e.target.value
        setChosenItems([...chosenItems])
    }
    const onChangeOrderComment = e => {
        setOrderComment(e.target.value)
    }
    const isOldItem = item => {
        let isOld = false
        item.itemsInOrder.forEach(itemInOrder => {
            if (itemInOrder.id) {
                isOld = true
                return
            }
        })
        return isOld
    }
    const quantityOfItemInOrder = item => {
        if (!item || !props.sentForCancel || props.sentForCancel.length === 0)
            return 0
        let cItems = ItemInOrderService.buildChosenItems(props.sentForCancel)
        let sameItem = cItems.find(ci => ci.itemId === item.itemId)
        if (!sameItem)
            return 0
        return sameItem.quantity// cItems.find(ci=> ci.itemId ===item.itemId).quantity
    }
    const cleanAll = () => {
        window.location.reload(false); // false - cached version of the page, true - complete page refresh from the server
    }
    return (
        <div className="row g-1">
            <div className="col col-lg-5 col-sm-12 col-12  me-1" style={{ backgroundColor: "#ffffff90", minHeight: '29rem' }}>
                <div className="container p-3" >
                    <h4 className="text-center mb-4"><u>Choose Items</u></h4>
                    <div className="container text-center">
                        <ColorRing
                            visible={showLoader}
                            ariaLabel="blocks-loading"
                            colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                        />
                    </div>
                    <Accordion>
                        {
                            categories.map((category, key) =>
                                <Card key={key}>
                                    <Card.Header>
                                        <CustomToggle eventKey={key} name={category} />
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={key} >
                                        <Table striped bordered hover className="m-0" >
                                            <tbody >
                                                {
                                                    menu[category].map((item, itemKey) =>

                                                        <tr key={itemKey} style={{ cursor: 'pointer' }} onClick={() => clickOnItem(item)}>
                                                            <td className="align-middle ps-4 pe-3" ><h6>{item.name}</h6> </td>
                                                            <td>{item.description}</td>
                                                            <td className="align-middle">{item.price}₪</td>
                                                        </tr>

                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </Accordion.Collapse>
                                </Card>
                            )
                        }
                    </Accordion>
                </div>
            </div>
            
            <div className="col col-lg-6 col-sm-12 px-4" style={{ backgroundColor: "#ffffffB0", }} >
                <div className="container p-3 " >
                    <h4 className="text-center mb-4"><u>My Order</u></h4>
                    <Table className="m-0 "  >
                        <tbody >
                            {
                                chosenItemsToDisplay.map((item, key) =>
                                    <tr key={key} className="row align-middle h4">
                                        <div className="row mb-0 pb-0">
                                            <td className="col col-xl-7 col-sm-6 col-12 px-2">{item.name}
                                            </td>

                                            <td className="col col-md-2 col-3 px-2 mb-0 pb-0">{item.price}₪</td>
                                            <td className="col col-md-2 col-3 p-1 mb-0 pb-0">
                                                <FloatingLabel label="Quantity" style={{ fontSize: '0.8rem' }} >
                                                    <Form.Control size="sm" type="number"
                                                        min={getMinQuantity(item)}
                                                        value={item.quantity} onChange={(e) => onChangeQuantity(e, item)} style={{ fontSize: '0.8rem', height: '3rem', width: '4rem' }} />
                                                </FloatingLabel>
                                            </td>
                                            <td className="col col-1  mb-0 pb-0">
                                                {
                                                    props.withAskForCancel && isOldItem(item) ?
                                                        <button className='btn  btn-danger btn-sm  mx-auto' onClick={(e) => onClickCancelItem(e, item)} disabled={quantityOfItemInOrder(item) === item.quantity}>Cancel</button>
                                                        :
                                                        <button className='btn btn-outline-danger btn-sm  ms-0' style={{ borderRadius: '100%' }}
                                                            onClick={() => onClickDeleteItem(item)}>x</button>
                                                }

                                            </td>
                                        </div>
                                        <div className="row col h6 my-0 py-0 mx-1">Comments:</div>
                                        {
                                            item.itemsInOrder.map((itemInOrder, ioKey) =>
                                                <div className="row my-0 py-0" key={ioKey}>
                                                    <div className=" col col-xxl-4 col-xl-6 col-8">
                                                        <input className="form-control  mt-1" type="text" value={itemInOrder.itemComment} onChange={e => onChangeItemComment(e, itemInOrder, ioKey)} placeholder={`Comment item ${ioKey + 1}`} />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </tr>
                                )
                            }
                            {
                                chosenItemsToDisplay.length > 0 ?
                                    <>
                                        <tr className="row align-middle h4 " style={{ height: '3rem', background: '#ffff0050' }}>
                                            <td className="col col-xl-7 col-lg-6 col-6 p-2">Total Price:</td>
                                            <td className="col col-xl-2 col-lg-2 col-2 p-2">
                                                {chosenItemsToDisplay.reduce((total, item) => total + item.price, 0)}₪
                                            </td>
                                            <td className="col col-xl-2 col-lg-3 col-3 p-0" />
                                            <td className="col  col-xl-1 col-lg-1 col-1 " />
                                        </tr>
                                        <tr className="row align-middle h6 " >
                                            <td className="col col-xl-5 col-lg-6 col-6 mt-1 ">
                                                Additional requests:
                                            </td>
                                            <td className="col">
                                                <input className="form-control " type="text" value={orderComment} onChange={onChangeOrderComment} placeholder={`Additional requests`} />
                                            </td>
                                        </tr>

                                    </>
                                    :
                                    null
                            }

                        </tbody>
                    </Table>
                    {
                        chosenItemsToDisplay.length > 0 ?
                            <div className="d-flex justify-content-center form-group mt-4">
                                <div className="col-md-6 form-group">
                                    <button className="btn btn-primary btn-user btn-block justify-content-center text-center"
                                        onClick={onClickSendOrder}>{props.sendOrderBtnText || 'Send Order'}</button>
                                </div>
                            </div>
                            :
                            null
                    }
                    <div className="text-center ">
                        <ColorRing
                            visible={!loaded}
                            ariaLabel="blocks-loading"
                            colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                        />
                    </div>

                </div>
            </div>
            {
                popupMessage.header ?
                    <PopupMessage
                        title={popupMessage.header}
                        body={
                            <div style={{ fontSize: '1.2rem' }}>
                                <div >{popupMessage.body.topText}</div>
                                <ul>
                                    {
                                        popupMessage.body.items.map((message, key) => (
                                            <li key={key} className="mt-2" >
                                                {message}
                                            </li>
                                        ))
                                    }
                                </ul>
                                <h5>{popupMessage.body.bottomText}</h5>
                            </div>

                        }
                        onClose={() => {
                            if (popupMessage.header !== 'Error' && !popupMessage.header.includes('Request'))
                                cleanAll()
                            else
                                setPopupMessage({ header: '', body: { topText: '', items: [''], bottomText: '' } })

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
                        navigateTo="/"
                        okBtnText={popupMessage.header.includes('Request') ? "Send Request" : popupMessage.header.includes('Delete') ? "Delete Items" : "Go to Tables"}
                        onClicOk=
                        {
                            popupMessage.header.includes('Request') ?
                                e => {
                                    e.preventDefault()
                                    cancelItem(itemToCancel)
                                }
                                :
                                popupMessage.header.includes('Delete') ?
                                    e => {
                                        e.preventDefault()
                                        cancelAndDeleteItem(itemToCancel)
                                    }
                                    :
                                    null
                        }
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div >

    );
}
export default ItemsToOrder;