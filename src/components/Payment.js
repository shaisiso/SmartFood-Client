import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import DiscountsService from '../services/DiscountsService';
import OrderService from '../services/OrderService';
import { cleanAll, extractHttpError, format2Decimals, isValidFloatNumber, lastCharIsDigit } from '../utility/Utils';
import PopupMessage from './PopupMessage';

const Payment = (props) => {
    const [showLoader, setShowLoader] = useState(false)
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [] })
    const [relevantDiscounts, setRelevantDiscounts] = useState([])
    const [membersDiscounts, setMembersDiscounts] = useState([])
    const [order, setOrder] = useState({})
    const [paymentAmount, setPaymentAmount] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [showMemberDiscount, setShowMemberDiscount] = useState(true)
    let mounted = useRef()
    useEffect(() => {
        const getMembersDiscounts = async () => {
            let discounts = []
            await DiscountsService.getRelevantMemberDiscountsForCurrentOrder(props.order)
                .then(result => {
                    discounts = [...result.data]
                    // setMembersDiscounts(result.data)
                })
                .catch(err => {
                    console.log(err)
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })
            return discounts
        }
        const getRelevantDiscounts = async () => {
            let discounts = []
            await DiscountsService.getRelevantDiscountsForCurrentOrder(props.order)
                .then(result => {
                    discounts = [...result.data]
                })
                .catch(err => {
                    console.log(err)
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })
            return discounts
        }
        const fetchData = async () => {
            let members = await getMembersDiscounts()
            let regular = await getRelevantDiscounts()
            if (order.person && order.person.phoneNumber) { // delivery or TA
                setPhoneNumber(order.phoneNumber)
                applyDiscount(regular, members)
                setShowMemberDiscount(false)
            }
            else {
                setRelevantDiscounts([...regular])
                setMembersDiscounts([...members])
            }
        }
        const applyDiscount = async (regular, members) => {
            await OrderService.applyMemberDiscount(props.order, props.order.person.phoneNumber)
                .then(res => {
                    setOrder(res.data)
                    setRelevantDiscounts([...regular, ...members])
                })
                .catch(err => {
                    if (err.response.status !== 404)
                        setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })

        }
        if (!mounted.current) {
            setOrder(props.order)
            if (order && order.id) {
                mounted.current = true
                fetchData()
            }
        }
    }, [props.order, order, membersDiscounts, relevantDiscounts])

    const onChangePaymentAmount = e => {
        if (isValidFloatNumber(e.target.value))
            setPaymentAmount(e.target.value)
    }
    const onChangePhoneNumber = e => {
        let value = e.target.value
        if (!lastCharIsDigit(value) || value.length > 10)
            return
        setPhoneNumber(value)
    }

    const onSubmitPayment = async e => {
        e.preventDefault();
        setShowLoader(true)
        await OrderService.payment(order.id, paymentAmount)
            .then(res => {
                setPopupMessage({ title: 'Payment Successful', messages: [`The payment with amount of ${paymentAmount}₪ has been confirmed`, `Remaining Price: ${format2Decimals(res.data.totalPriceToPay - res.data.alreadyPaid)}₪`] })
            }).catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const onClickApplyDiscount = async e => {
        e?.preventDefault()
        setShowLoader(true)
        if (order && phoneNumber) {
            await OrderService.applyMemberDiscount(order, phoneNumber)
                .then(res => {
                    console.log(res.data)
                    setOrder({ ...res.data })
                    setRelevantDiscounts([...relevantDiscounts, ...membersDiscounts])
                    setShowMemberDiscount(false)
                })
                .catch(err => {
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })
        }

        setShowLoader(false)
    }

    return (
        <div className="row g-1 mt-1 mx-auto text-center"  >
            <div className="col col-lg-6 col-12 mx-auto text-center h4 py-2" style={{ backgroundColor: "#ffffff90", minHeight: '9rem' }}>
                {
                    showMemberDiscount && membersDiscounts && membersDiscounts.length > 0 ?
                        <div className="col h5 mb-4">
                            Members Discounts:
                            {
                                membersDiscounts.map((discount, key) =>
                                    <div className="col mx-auto my-2 h6" key={key}>- {discount.discountDescription}</div>
                                )
                            }
                            <table className='text-center mx-auto my-1'> <tbody> <tr>
                                <td>
                                    <FloatingLabel label="Phone Number" style={{ fontSize: '1rem' }}  >
                                        <Form.Control size="sm" type="text" placeholder="Phone Number" required
                                            value={phoneNumber} onChange={onChangePhoneNumber}
                                            style={{ fontSize: '1rem', height: '3.2rem', width: '10rem' }} />
                                    </FloatingLabel>
                                </td>
                                <td>
                                    <button onClick={onClickApplyDiscount} className="btn btn-primary bt my-1"  >Apply Discount</button>
                                </td>
                            </tr></tbody> </table>
                        </div>
                        : null
                }
                <h4 className=" mb-3"><u>Payment</u></h4>
                {
                    order ?
                        <Form onSubmit={onSubmitPayment}>
                            {
                                order.originalTotalPrice !== order.totalPriceToPay ?
                                    <div className="col mx-auto my-1">Original Price: {format2Decimals(order.originalTotalPrice)}₪</div>
                                    :
                                    null
                            }
                            {
                                relevantDiscounts ?
                                    <div className="col mx-auto h5">
                                        {
                                            relevantDiscounts.map((discount, key) =>
                                                <div className="col mx-auto my-2 h6" key={key}>- {discount.discountDescription}</div>
                                            )

                                        }
                                    </div>

                                    : null
                            }
                            <div className="col mx-auto my-3">Price to Pay: {format2Decimals(order.totalPriceToPay)}₪</div>
                            <div className="col mx-auto my-3">Already Paid: {format2Decimals(order.alreadyPaid)}₪</div>
                            <div className="col mx-auto  py-1" style={{ background: '#ffff0080' }}>Remaining: {format2Decimals(order.totalPriceToPay - order.alreadyPaid)}₪</div>
                            <div className="col mx-auto mt-3">
                                <table className='text-center mx-auto my-1'>
                                    <tbody> <tr><td>
                                        <FloatingLabel label="Amount" style={{ fontSize: '0.9rem' }}  >
                                            <Form.Control size="sm" type="text" placeholder="Amount" required
                                                value={paymentAmount} onChange={onChangePaymentAmount}
                                                style={{ fontSize: '1rem', height: '3rem', width: '6rem' }} />
                                        </FloatingLabel>
                                    </td>
                                        <td>
                                            <input type="submit" className="btn btn-primary my-1" value="Pay" />
                                        </td>
                                    </tr></tbody> </table>
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
                        onClicOk={e => {
                            // e.preventDefault()
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