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
        <div className="row ">

            <div className="col col-lg-6 col-sm-12 col-12  p-2" >
                <div className="container p-3 px-4" style={{ backgroundColor: "#ffffff90", minHeight: '29rem', minWidth: '100%' }}>
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
            <div className="col col-lg-6 col-sm-12 p-2" >
                <div className="container p-3 px-4" style={{ backgroundColor: "#ffffff90", minHeight: '29rem', minWidth: '100%' }}>
                    <h4 className="text-center mb-4"><u>My Order</u></h4>
                    <Table striped bordered hover className="m-0" >
                        <tbody >
                            <ul>
                                {
                                    chosenItems.map((item, key) =>
                                        <h4 key={key} className="row">

                                            <tr key={key} className="align-middle">
                                                <li >
                                                    <td className="col col-xl-8 col-lg-8 col-8 ">{item.name}</td>
                                                    <td className="col col-xl-2 col-lg-2 col-1 ">{item.price}₪</td>
                                                    <td className="col col-xl-2 col-lg-3 col-4">
                                                        <FloatingLabel label="Quantity" style={{ fontSize: '0.8rem'}} >
                                                            <Form.Control size="sm" type="number" 
                                                                min={1}
                                                                value={item.quantity} onChange={(e) => onChangeQuantity(e, item)} style={{ fontSize: '0.8rem', height:'3rem',width :'4rem'}}/>
                                                        </FloatingLabel>
                                                    </td>
                                                    <td className="col  col-xl-1 col-lg-1 col-1 ">
                                                        <button className='btn btn-danger btn-sm ms-2 ' style={{ borderRadius: '100%' }}
                                                            onClick={() => onClickDeleteItem(item)}>x</button>
                                                    </td>
                                                </li>
                                            </tr>
                                        </h4>
                                    )
                                }
                            </ul>
                        </tbody>
                    </Table>
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