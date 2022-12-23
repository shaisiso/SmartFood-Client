import { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API_URL, extractHttpError, toText } from '../utility/Utils';
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



const ItemsToOrder = (props) => {
    const [menu, setMenu] = useState([])
    const [categories, setCategories] = useState([])
    const [showLoader, setShowLoader] = useState(true)
    const [chosenItemsToDisplay, setChosenItems] = useState([])
    const [orderComment, setOrderComment] = useState('')
    const [popupMessage, setPopupMessage] = useState({ header: '', body: { topText: '', items: [''], bottomText: '' } })


    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getMenuData();
        }
    });
    const getMenuData = async () => {
        await Axios.get(`${API_URL}/api/menu/categorized`)
            .then(res => {
                setMenu(res.data)
                setCategories(Object.keys(res.data))
            }).catch(err => {
                var errMsg;
                console.log(err)
                if (err.response.data) {
                    errMsg = err.response.data.message;
                }
                else {
                    errMsg = err.message
                }
                console.log(errMsg)
                setPopupMessage({ header: 'Error', messages: [errMsg] })
            })
        setShowLoader(false)
    }

    const clickOnItem = item => {
        var oldChosen = chosenItemsToDisplay
        let menuItem = {}
        Object.values(menu).forEach(c => {
            c.forEach(mi => {
                if (mi.itemId === item.itemId)
                    menuItem = { ...mi }
            })
        })

        let itemInOrder = { item: { ...menuItem }, itemComment: '' }
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
        let itemPrice = menu[enumForReading(item.category)]
            .find(i => i.itemId === item.itemId).price
        let itemsInOrder = item.itemsInOrder
        if (newQuantity < item.quantity)
            itemsInOrder.splice(itemsInOrder[itemsInOrder.length - 1], 1)
        else
            itemsInOrder.push({ ...itemsInOrder[0], itemComment: '' })
        console.log('itemsInOrder', itemsInOrder)
        const newState = chosenItemsToDisplay.map(obj => {
            if (obj.itemId === item.itemId) {
                return { ...obj, quantity: newQuantity, price: newQuantity * itemPrice, itemsInOrder: itemsInOrder };
            }
            return obj;
        });
        setChosenItems(newState)
    }
    const onClickDeleteItem = (itemToDelete) => {
        setChosenItems(chosenItemsToDisplay.filter(item => item !== itemToDelete))
    }
    const onClickSendOrder = (e) => {
        e.preventDefault();
        // TODO: Send order to server. (Add payment)
        let itemsInOrder = []
        chosenItemsToDisplay.forEach(item => {
            itemsInOrder.push(...item.itemsInOrder)
        })
        let order = { items: [...itemsInOrder], orderComment: orderComment, person: props.orderUserDetails.personDetails }
        console.log(order)
        if (props.orderUserDetails.type.includes("Delivery")) {
            OrderService.addNewDelivery(order)
                .then(res => {
                    setOrderinPopup()
                }).catch(err => {
                    setPopupMessage({ header: `Error`, body: { items: extractHttpError(err) } })
                })
        }
        else {
            OrderService.addNewTakeAway(order)
                .then(res => {
                    setOrderinPopup()
                }).catch(err => {
                    setPopupMessage({ header: `Error`, body: { items: extractHttpError(err) } })
                })
        }
    }
    const setOrderinPopup = () => {
        let person = props.orderUserDetails.personDetails
        let personString = `${person.name} - ${person.phoneNumber}`
        personString += props.orderUserDetails.type === 'Delivery' ? `, ${person.address.city} ${person.address.streetName} ${person.address.houseNumber} ${toText(person.address.entrance)} ${toText(person.address.apartmentNumber)}` : ""
        let itemString = []
        chosenItemsToDisplay.forEach(i => itemString.push(`${i.quantity} ${i.name} - ${i.price}₪`))
        let price = `Total Price: ${chosenItemsToDisplay.reduce((total, item) => total + item.price, 0)}₪ `
        setPopupMessage(
            {
                header: `Order Details: ${props.orderUserDetails.type}`,
                body: { topText: personString, items: [...itemString], bottomText: `${price}. We will send SMS message when it is ready.` }
            }
        )
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
                                        <CustomToggle eventKey={key} name={category}>+</CustomToggle>
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
            <div className="col col-lg-6 col-sm-12 " style={{ backgroundColor: "#ffffffB0", }} >
                <div className="container p-3 px-4" >
                    <h4 className="text-center mb-4"><u>My Order</u></h4>
                    <Table className="m-0 "  >
                        <tbody >
                            {
                                chosenItemsToDisplay.map((item, key) =>
                                    <tr key={key} className="row align-middle h4">
                                        <div className="row mb-0 pb-0">
                                            <td className="col col-xl-7 col-lg-6 col-6 px-2">{item.name}
                                            </td>

                                            <td className="col col-2 px-2 mb-0 pb-0">{item.price}₪</td>
                                            <td className="col col-2 p-1 mb-0 pb-0">
                                                <FloatingLabel label="Quantity" style={{ fontSize: '0.8rem' }} >
                                                    <Form.Control size="sm" type="number"
                                                        min={1}
                                                        value={item.quantity} onChange={(e) => onChangeQuantity(e, item)} style={{ fontSize: '0.8rem', height: '3rem', width: '4rem' }} />
                                                </FloatingLabel>
                                            </td>
                                            <td className="col col-1 mb-0 pb-0">
                                                <button className='btn btn-danger btn-sm  ms-0' style={{ borderRadius: '100%' }}
                                                    onClick={() => onClickDeleteItem(item)}>x</button>

                                            </td>
                                        </div>
                                        <div className="row col h6 my-0 py-0 mx-1">Comments:</div>
                                        {
                                            item.itemsInOrder.map((itemInOrder, ioKey) =>
                                                <div className="row my-0 py-0" key={ioKey}>
                                                    <div className=" col col-xl-4 col-8">
                                                        <input className="form-control mt-1" type="text" value={itemInOrder.itemComment} onChange={e => onChangeItemComment(e, itemInOrder, ioKey)} placeholder={`Comment item ${ioKey + 1}`} />
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
                                                {chosenItemsToDisplay.reduce((total, item) => total + item.price, 0)}
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
                                        onClick={onClickSendOrder}>Send Order</button>
                                </div>
                            </div>
                            :
                            null
                    }


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
                            cleanAll()
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
                        okBtnText="Go To Homepage"
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div >

    );
}
export default ItemsToOrder;