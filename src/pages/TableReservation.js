import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import { formatDate } from "../utility/Utils";
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

const hoursList = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const getCurrentDate = () => {
    return formatDate(new Date())
}
const getMaxDate = () => {
    let date = new Date();
    date.setFullYear(date.getFullYear()+1)
    return formatDate(date)
}

const TableReservation =()=> {
    const [chosenDate, setChosenDate] = useState(getCurrentDate());
    const onChangeDate=(event)=>{
        setChosenDate(event.target.value)
    }
    const onSubmit = () => {
        console.log(`${getCurrentDate()}`)

    }
    return (
        <div className="container col col-lg-6 col-sm-10 py-3 px-5" style={{ backgroundColor: "#ffffff60", }}>
            <div className="section-title">
                <h1 style={{ color: "black" }}>Table Reservation</h1>
            </div>
            <form onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-md-6 form-group">
                        <input type="text" name="name" className="form-control" placeholder="*First Name" required />
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                        <input type="text" name="name" className="form-control" placeholder="*Last Name" required />
                    </div>
                </div>
                <div className="row form-group mt-3">
                    <div className="col-md-6 form-group">
                        <input type="phone" className="form-control" name="subject" placeholder="*Phone Number" required />
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                        <input type="email" className="form-control" name="email" id="email" placeholder=" Email"/>
                    </div>
                </div>
                <div className="form-group mt-3">
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <input type="date" style={{ textAlign: "left" }} className="form-control" 
                            name="date" value={chosenDate} onChange={onChangeDate} required 
                            min={getCurrentDate()} max={getMaxDate()} />
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
                    <textarea className="form-control" name="message" rows="4" placeholder="Additional details" required></textarea>
                </div>
                <div className="text-center mt-4">
                    <input type="submit" value="Send Reservation Request"
                        className="btn btn-primary btn-user btn-block"
                    />
                </div>
            </form>
        </div>

    );
};

export default TableReservation;