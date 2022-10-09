import React, { useState } from "react";
import PropTypes from 'prop-types';
import Dropdown from "react-bootstrap/Dropdown";
import Form from 'react-bootstrap/Form';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const hoursList = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const getCurrentDate = () => {
    let date = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    console.log(`${da}-${mo}-${ye}`);
    return `${ye}-${mo}-${da}`
}


const TableReservation = props => {
    const [startDate, setStartDate] = useState(new Date());
    const [showDate, setDateClick] = useState(false);
    const [chosenDate, setChosenDate] = useState(getCurrentDate());

    const onSubmit = () => {
        console.log(`${getCurrentDate()}`)
       // console.log(new Date().toLocaleDateString("en-US"))
        //console.log(`${new Date().toLocaleDateString()}`)
    }

    return (
        <div className="container col col-lg-6 col-sm-10">
            <form role="form" onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-md-6 form-group">
                        <input type="text" name="name" className="form-control" placeholder="First Name" required />
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                        <input type="text" name="name" className="form-control" placeholder="Last Name" required />
                    </div>
                </div>
                <div className="form-group mt-3">
                    <input type="phone" className="form-control" name="subject" placeholder="Phone Number" required />
                </div>
                <div className="form-group mt-3">
                    <input type="email" className="form-control" name="email" id="email" placeholder=" Email" required />
                </div>
                <div className="form-group mt-3">
                    {/* {
                        showDate ?
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                minDate={new Date()}
                                //  maxDate={addMonths(new Date(), 5)}
                                showDisabledMonthNavigation
                                inline
                            />
                            :
                            <input type="date" className="form-control" name="date" placeholder="date" required onClick={() => setDateClick(true)} />
                    } */}
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <input type="date" style={{ textAlign: "left" }} className="form-control" name="date" value={chosenDate} onChange={setChosenDate} required />
                        </div>
                        <div className="col-md-6 form-group mt-3 mt-md-0">
                        <Form.Select aria-label="Default select example" >
                                <option disabled>Choose Hour</option>
                                {
                                    hoursList.map((item, key) => (
                                        <option key={key} value={item}>{item}:00</option>
                                    ))
                                }

                            </Form.Select>
                        </div>

                    </div>
                </div>


                <div className="form-group mt-3">
                    <textarea className="form-control" name="message" rows="5" placeholder="Additional details" required></textarea>
                </div>
                <div className="text-center my-3">
                    <input type="submit" value="Send Reservation Request"
                        className="btn btn-primary btn-user btn-block"
                    />
                </div>
            </form>
        </div>

    );
};

TableReservation.propTypes = {

};

export default TableReservation;