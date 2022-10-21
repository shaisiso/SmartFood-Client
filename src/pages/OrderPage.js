import { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../utility/Utils';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { ColorRing } from 'react-loader-spinner'
import Table from 'react-bootstrap/Table';
import PopupMessage from '../components/PopupMessage';
import { categoryForReading } from '../utility/Utils';
import { FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

function CustomToggle({ children, eventKey, name }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <h5 onClick={decoratedOnClick} style={{ cursor: 'pointer' }}>
            <span className="mx-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: '50%' }}
                >
                    {children}
                </button>
            </span>
            <span className="mx-2"  >
                {name}
            </span>
        </h5>

    );
}

const OrderPage = () => {
    const [menu, setMenu] = useState([])
    const [categories, setCategories] = useState([])
    const [showLoader, setShowLoader] = useState(true)
    const [chosenItems, setChosenItems] = useState([])
    const [errorMessage, setErrorMessage] = useState('');
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
                setErrorMessage(errMsg)
            })
        setShowLoader(false)

    }
    const clickOnItem = menuItem => {
        var oldChosen = chosenItems
        menuItem.quantity = 1
        const newState = chosenItems.map(obj => {
            if (obj.itemId === menuItem.itemId) {
                return { ...obj, quantity: (obj.quantity + 1), price: obj.price + menuItem.price };
            }
            return obj;
        });
        var oldItemIndex = oldChosen.findIndex(i => i.itemId === menuItem.itemId)
        if (oldItemIndex === -1) {
            newState.push(menuItem)
        }
        setChosenItems(newState)

    }
    const onChangeQuantity = (event, item) => {
        let newQuantity = Number(event.target.value)
        let itemPrice = menu[categoryForReading(item.category)]
            .find(i => i.itemId === item.itemId)
            .price
        const newState = chosenItems.map(obj => {
            if (obj.itemId === item.itemId) {
                return { ...obj, quantity: newQuantity, price: newQuantity * itemPrice };
            }
            return obj;
        });
        setChosenItems(newState)
    }
    const onClickDeleteItem = (itemToDelete) => {
        setChosenItems(chosenItems.filter(item => item !== itemToDelete))
    }
    return (
        <div className="row g-1">

            <div className="col col-lg-6 col-sm-12 col-12  me-1" style={{ backgroundColor: "#ffffff90", minHeight: '29rem' }}>
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
                                                            <td>{item.price}₪</td>
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
            <div className="col col-lg-5 col-sm-12 " style={{ backgroundColor: "#ffffff90", }} >
                <div className="container p-3 px-4" >
                    <h4 className="text-center mb-4"><u>My Order</u></h4>
                    <Table className="m-0" >
                        <tbody >
                            {
                                chosenItems.map((item, key) =>

                                    <tr key={key} className="row align-middle h4">

                                        <td className="col col-xl-7 col-lg-6 col-6 p-2">{item.name}</td>
                                        <td className="col col-xl-2 col-lg-2 col-2 p-2">{item.price}₪</td>
                                        <td className="col col-xl-2 col-lg-3 col-3 p-0">
                                            <FloatingLabel label="Quantity" style={{ fontSize: '0.8rem' }} >
                                                <Form.Control size="sm" type="number"
                                                    min={1}
                                                    value={item.quantity} onChange={(e) => onChangeQuantity(e, item)} style={{ fontSize: '0.8rem', height: '3rem', width: '4rem' }} />
                                            </FloatingLabel>
                                        </td>
                                        <td className="col  col-xl-1 col-lg-1 col-1 ">
                                            <button className='btn btn-danger btn-sm  ms-0' style={{ borderRadius: '100%' }}
                                                onClick={() => onClickDeleteItem(item)}>x</button>
                                        </td>
                                    </tr>
                                )
                            }
                            {
                                chosenItems.length > 0 ?
                                    <tr className="row align-middle h4 " style={{ height: '3rem', background: '#ffff0050' }}>
                                        <td className="col col-xl-7 col-lg-6 col-6 p-2">Total Price:</td>
                                        <td className="col col-xl-2 col-lg-2 col-2 p-2">
                                            {chosenItems.reduce((total, item) => total + item.price, 0)}
                                        </td>
                                        <td className="col col-xl-2 col-lg-3 col-3 p-0" />
                                        <td className="col  col-xl-1 col-lg-1 col-1 " />
                                    </tr>
                                    :
                                    null
                            }

                        </tbody>
                    </Table>
                    {
                        chosenItems.length > 0 ?
                            <div className="text-center mt-3">
                                <button className="btn btn-primary btn-user btn-block justify-content-center text-center">Continue</button>
                            </div>
                            :
                            null
                    }


                </div>
            </div>
            {
                errorMessage ?
                    <PopupMessage
                        title="Error"
                        body={
                            <div className="text-black" style={{ fontSize: '1.2rem' }}>{errorMessage}</div>
                        }
                        onClose={() => {
                            setErrorMessage('')
                        }}
                        status='error'
                    >

                    </PopupMessage>
                    :
                    null
            }
        </div >

    );
}
export default OrderPage;