import React from 'react';
import { useState } from 'react';
import { Fragment } from 'react';
import { FloatingLabel } from 'react-bootstrap';
import DiscountsService from '../services/DiscountsService';
import { enumForReading, extractHttpError, formatDateForServer, getCurrentDate } from '../utility/Utils';
import PopupMessage from './PopupMessage';
import ReadOnlyRow from './ReadOnlyRow';

const Discounts = (props) => {
    const [discounts, setDiscounts] = useState([])
    const [startDate, setStartDate] = useState(getCurrentDate())
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })

    const onChangeStartDate = (e) => {
        setStartDate(e.target.value)
    }
    const onChangeEndDate = (e) => {
        setEndDate(e.target.value)
    }
    const getDiscounts = async (e) => {
        e?.preventDefault()
        let startDateAPI = formatDateForServer(new Date(startDate))
        let endDateAPI = formatDateForServer(new Date(endDate))
        await DiscountsService.getDiscountsByDates(startDateAPI, endDateAPI)
            .then(res => {
                setDiscounts(res.data)
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const getDiscountToDisplay = (discount) => {
        let daysStr = ''
        let categoriesStr = ''
        discount.categories.map(c => enumForReading(c))
            .forEach(c => categoriesStr += `${c}, `);
        discount.days.map(d => enumForReading(d))
            .forEach(day => daysStr += `${day}, `);
        let d = { ...discount, categories: categoriesStr.slice(0, -2), days: daysStr.slice(0, -2), percent: `${discount.percent}%` }
        //delete d.discountId
        return d
    }
    const handleDeleteClick = (e, discount) => {
        e.preventDefault()
        DiscountsService.deleteDiscount(discount)
            .then(res => {
                getDiscounts()
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    return (
        <form onSubmit={getDiscounts} className ="py-4" >
            <table className="mx-auto py-4">
                <tbody >
                    <tr className="align middle text-center ">
                        <td className="col-md-4 form-group pb-4">
                            <FloatingLabel label="Start Date">
                                <input type="date" style={{ textAlign: "left" }} className="form-control"
                                    name="date" value={startDate} onChange={onChangeStartDate} required
                                />
                            </FloatingLabel>
                        </td>
                        <td className="col-md-4 form-group pb-4">
                            <FloatingLabel label="End Date">
                                <input type="date" style={{ textAlign: "left" }} className="form-control"
                                    name="date" value={endDate} onChange={onChangeEndDate} required min={startDate}
                                />
                            </FloatingLabel>
                        </td>
                        <td className="col-md-4 form-group pb-4">
                            <input type="submit" className='btn btn-primary' value="Show Discounts" />
                        </td>
                    </tr>
                </tbody>
            </table>
            {
                discounts.length > 0 ?
                    <table className="table table-striped table-bordered text-center" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/>Only Members</th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Start Date </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> End Date </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/>On Days </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/>Start Hour </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/>End Hour </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/>If You Order </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/>You Get Discount For</th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/>Discount Percent </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/>Categories </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Description </th>
                                {
                                    props.withDelete ?
                                        <th> Actions </th>
                                        : null
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.map((d, key) => (
                                <Fragment key={key}>
                                    <ReadOnlyRow item={getDiscountToDisplay(d)} handleDeleteClick={props.withDelete ? handleDeleteClick : null} />
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
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
                            setPopupMessage({ title: '', messages: [''] })
                        }}
                        status={popupMessage.title === 'Error' ? 'error' : 'info'}
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </form>
    );
};

export default Discounts;