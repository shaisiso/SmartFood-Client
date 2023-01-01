import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import OrderService from '../services/OrderService';
import { cleanAll, extractHttpError, isValidFloatNumber } from '../utility/Utils';
import PopupMessage from './PopupMessage';

const Payment = (props) => {
    const [showLoader, setShowLoader] = useState(false)
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [] })

    const [order, setOrder] = useState({})
    const [paymentAmount, setPaymentAmount] = useState('')
    useEffect(() => {
        setOrder(props.order)
    }, [props.order])
    const onChangePaymentAmount = e => {
        if (isValidFloatNumber(e.target.value))
            setPaymentAmount(e.target.value)
    }
    const onSubmitPayment = async e => {
        e.preventDefault();
        setShowLoader(true)
        OrderService.payment(order.id, paymentAmount)
            .then(res => {
                setPopupMessage({ title: 'Payment Successful', messages: [`The payment with amount of ${paymentAmount}₪ has been confirmed`, `Remaining Price: ${res.data.totalPriceToPay - res.data.alreadyPaid}₪`] })
            }).catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    return (
        <div className="row g-1 mt-1 mx-auto text-center"  >
            <div className="col col-lg-6 col-12 mx-auto text-center h4 py-2" style={{ backgroundColor: "#ffffff90", minHeight: '9rem' }}>
                <h4 className=" mb-4"><u>Payment</u></h4>
                {
                    order ?
                        <Form onSubmit={onSubmitPayment}>
                            {
                                order.originalTotalPrice !== order.totalPriceToPay ?
                                    <div className="col mx-auto my-1">Original Price: {order.originalTotalPrice}₪</div>
                                    :
                                    null
                            }
                            <div className="col mx-auto my-3">Price to Pay: {order.totalPriceToPay}₪</div>
                            <div className="col mx-auto my-3">Already Paid: {order.alreadyPaid}₪</div>
                            <div className="col mx-auto my-3">Remaining: {order.totalPriceToPay - order.alreadyPaid}₪</div>
                            <div className="col mx-auto mt-3">
                                <table className='text-center mx-auto my-1'>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <FloatingLabel label="Amount" style={{ fontSize: '0.9rem' }}  >
                                                    <Form.Control size="sm" type="text" placeholder="Amount" required
                                                        value={paymentAmount} onChange={onChangePaymentAmount}
                                                        style={{ fontSize: '1rem', height: '3rem', width: '6rem' }} />
                                                </FloatingLabel>
                                            </td>
                                            <td>
                                                <input type="submit" className="btn btn-primary my-1" value="Pay" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Form>
                        :
                        null
                }
                <ColorRing
                    visible={showLoader}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
            </div>
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
                        withOk={!popupMessage.title.includes('Error')}
                        okBtnText='OK'
                        onClicOk={e=>{
                            e.preventDefault()
                            cleanAll()
                        }}
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }

        </div>
    );
};

export default Payment;