import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import DiscountsService from '../services/DiscountsService';
import MenuService from '../services/MenuService';
import { extractHttpError, getCurrentDate } from '../utility/Utils';
import Discounts from './Discounts';
import PopupMessage from './PopupMessage';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DiscountManagement = () => {
    const [showNewDiscount, setShowNewDiscount] = useState(false)
    const [newDiscount, setNewDiscount] = useState({ forMembersOnly: false, startDate: getCurrentDate(), endDate: getCurrentDate(), days: [], startHour: '', endHour: '', ifYouOrder: '', youGetDiscountFor: '', percent: '', categories: [], discountDescription: '' })
    const [categories, setCategories] = useState([])
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })

    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            getCategories()
        }
    })
    const getCategories = async () => {
        await MenuService.getCategories()
            .then(res => {
                setCategories(res.data)
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const onClickNewDiscount = e => {
        e.preventDefault()
        setShowNewDiscount(!showNewDiscount)
    }
    const onChangeNewDiscount = e => {
        let fieldName = e.target.getAttribute("name")
        let fieldValue = e.target.value === 'true' ? true : e.target.value === 'false' ? false : e.target.value
        let newDiscountChange = { ...newDiscount }
        newDiscountChange[fieldName] = fieldValue
        setNewDiscount({ ...newDiscountChange })
    }
    const onChangeNewDiscountArr = e => {
        let fieldName = e.target.getAttribute("name")
        let fieldChecked = e.target.checked
        let fieldValue = e.target.value
        let newDiscountChange = { ...newDiscount }
        if (fieldChecked === true) {
            newDiscountChange[fieldName].push(fieldValue)
        }
        else {
            newDiscountChange[fieldName] = newDiscountChange[fieldName].filter(element => element !== fieldValue)
        }
        console.log(newDiscountChange)
        setNewDiscount({ ...newDiscountChange })
    }
    const addNewDiscount = e => {
        e.preventDefault()
        DiscountsService.addNewDiscount(newDiscount)
    }

    return (
        <div className="container mx-auto text-center">
            <button className='btn btn-primary mx-auto mt-4' onClick={onClickNewDiscount}>Add New Discount</button>
            {
                showNewDiscount ?
                    <Form onSubmit={addNewDiscount}>
                        <div className="col-md-6 mx-auto mb-5 mt-3 py-3" style={{backgroundColor: '#c0c0c080'}}>
                            <div className="d-flex justify-content-center mb-3">
                                <Form.Check
                                    inline
                                    label="Only For Members"
                                    name="forMembersOnly"
                                    type='radio'
                                    id={`1`}
                                    value={true}
                                    checked={newDiscount.forMembersOnly === true}
                                    onChange={onChangeNewDiscount}
                                />
                                <Form.Check
                                    inline
                                    label="For All Customers"
                                    name="forMembersOnly"
                                    type='radio'
                                    id={`2`}
                                    value={false}
                                    checked={newDiscount.forMembersOnly === false}
                                    onChange={e => setNewDiscount({ ...newDiscount, forMembersOnly: e.target.value === false })}
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <FloatingLabel label="Start Date">
                                    <input type="date" style={{ textAlign: "left" }} className="form-control" name="startDate"
                                        value={newDiscount.startDate} onChange={onChangeNewDiscount} required min={getCurrentDate()}
                                    />
                                </FloatingLabel>
                            </div>
                            <div className="col-md-12 form-group mt-3 mt-md-0">
                                <FloatingLabel label="End Date">
                                    <input type="date" style={{ textAlign: "left" }} className="form-control" name="endDate"
                                        value={newDiscount.endDate} onChange={onChangeNewDiscount} required min={newDiscount.startDate}
                                    />
                                </FloatingLabel>
                            </div>
                            <h5 className="my-3"><u>On Days</u>:</h5>
                            <div className="col-md-12 form-group mt-3 mt-md-0 text-left">
                                {
                                    daysOfWeek.map((day, key) => <Form.Check inline key={key} label={day} name="days" type='checkbox' value={day} onChange={onChangeNewDiscountArr}
                                        checked={newDiscount.days.includes(day)} />)
                                }
                            </div>
                            <div className="col-md-12 form-group mt-3 mt-md-0 text-left">
                                <label for="startHour">Start Hour: &nbsp;</label>
                                <input type="time" id="startHour" name="startHour" value={newDiscount.startHour} onChange={onChangeNewDiscount}
                                    min="09:00" max="02:00" required />
                                <label for="endHour" className="ms-5">End Hour: &nbsp;</label>
                                <input type="time" id="endHour" name="endHour" value={newDiscount.endHour} onChange={onChangeNewDiscount}
                                    min="09:00" max="02:00" required />
                            </div>
                            <div className="col-md-12 form-group mt-3 mt-md-0">
                                <FloatingLabel label="If You Order">
                                    <input type="number" className="form-control" min={1} name="ifYouOrder" required placeholder="If You Order"
                                        value={newDiscount.ifYouOrder} onChange={onChangeNewDiscount} />
                                </FloatingLabel>
                            </div>
                            <div className="col-md-12 form-group mt-3 mt-md-0">
                                <FloatingLabel label="You Get Discount For">
                                    <input type="number" className="form-control" min={1} name="youGetDiscountFor" required placeholder="You Get Discount For"
                                        value={newDiscount.youGetDiscountFor} onChange={onChangeNewDiscount} />
                                </FloatingLabel>
                            </div>
                            <div className="col-md-12 form-group mt-3 mt-md-0">
                                <FloatingLabel label="Discount Percent">
                                    <input type="number" className="form-control" min={0} max={100} name="percent" required placeholder="Discount Percent"
                                        value={newDiscount.percent} onChange={onChangeNewDiscount} />
                                </FloatingLabel>
                            </div>
                            <h5 className="my-3"><u>On Categories</u>:</h5>
                            <div className="col-md-12 form-group mt-3 mt-md-0 text-left">
                                {
                                    categories.map((category, key) => <Form.Check inline key={key} label={category} name="categories" type='checkbox' value={category} onChange={onChangeNewDiscountArr}
                                        checked={newDiscount.categories.includes(category)} />)
                                }
                            </div>
                            <div className="col-md-12 form-group mt-3 mt-md-0">
                                <FloatingLabel label="Description" >
                                    <textarea className="form-control" name="description" rows="2" placeholder="discountDescription"
                                        value={newDiscount.discountDescription} onChange={onChangeNewDiscount} />
                                </FloatingLabel>
                            </div>
                            <input type="submit" className="btn btn-primary mx-auto " value="Save New Discount" />
                        </div>
                    </Form>
                    :
                    null
            }
            <Discounts withDelete />
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
                        status={popupMessage.title === 'Error' ? 'error' : 'info'}
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default DiscountManagement;