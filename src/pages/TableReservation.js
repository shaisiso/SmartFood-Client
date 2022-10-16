import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import { formatDateForBrowser, formatDateForServer } from "../utility/Utils";
import Axios from 'axios';
import { API_URL } from '../utility/Utils';
import PopupMessage from '../components/PopupMessage';
import { ColorRing } from 'react-loader-spinner'

const hoursList = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const getCurrentDate = () => {
    return formatDateForBrowser(new Date())
}
const getMaxDate = () => {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1)
    return formatDateForBrowser(date)
}

const TableReservation = () => {
    const [personDetails, setPersonDetails] = useState({ name: '', phoneNumber: '', email: '' })
    const [chosenDate, setChosenDate] = useState(getCurrentDate());
    const [chosenHour, setChosenHour] = useState(`${hoursList[hoursList.length - 1]}:00`)
    const [numberOfDiners, setNumberOfDiners] = useState(1)
    const [additionalDetails, setAdditionalDetails] = useState('')
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)

    const onChangeDate = (event) => {
        setChosenDate(event.target.value)
    }
    const onChangeName = event => {
        setPersonDetails(
            {
                ...personDetails,
                name: event.target.value
            })
    }
    const onChangePhoneNumber = event => {
        setPersonDetails(
            {
                ...personDetails,
                phoneNumber: event.target.value
            })
    }
    const onChangeEmail = event => {
        setPersonDetails(
            {
                ...personDetails,
                email: event.target.value
            })
    }
    const onChangeHour = event => setChosenHour(`${event.target.value}:00`)
    const onChangeNumberOfDiners = event => setNumberOfDiners(event.target.value)
    const onChangeAdditionalDetails = event => setAdditionalDetails(event.target.value)
    const onSubmit = async (e) => {
        e.preventDefault();
        setShowLoader(true)
        var reservation = {
            person: personDetails,
            date: formatDateForServer(new Date(chosenDate)),
            hour: chosenHour,
            numberOfDiners: numberOfDiners
        }
        await Axios.post(`${API_URL}/api/reservation`, reservation)
            .then((data) => {
                setPopupMessage({ title: 'New Reservation', messages: ['Your reservation was saved and SMS will be sent for you.'] })
                cleanForm()
            }).catch(err => {
                console.log(err)
                var errMsg;
                if (err.response.data) {
                    console.log(Object.values(err.response.data));
                    errMsg = Object.values(err.response.data);
                }
                else {
                    errMsg = [err.message]
                }

                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        setShowLoader(false)
    }
    const cleanForm = () => {
        setPersonDetails({ name: '', phoneNumber: '', email: '' })
        setChosenDate(getCurrentDate())
        setChosenHour(`${hoursList[hoursList.length - 1]}:00`)
        setNumberOfDiners(1)
        setAdditionalDetails('')
    }
    return (
        <div className="container col col-lg-6 col-sm-10 py-3 px-5" style={{ backgroundColor: "#ffffff90", }}>
            <div className="section-title">
                <h1 className="hRestaurant" style={{ color: "black" }}>Table Reservation</h1>
            </div>
            <form onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-md-6 form-group">
                        <input type="text" name="name" className="form-control" placeholder="*Name" required
                            value={personDetails.name} onChange={onChangeName} />
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                        <input type="phone" className="form-control" name="subject" placeholder="*Phone Number" required
                            value={personDetails.phoneNumber} onChange={onChangePhoneNumber} />
                    </div>

                </div>
                <div className="row form-group mt-3">
                    <div className="col-md-6 form-group">
                        <input type="email" className="form-control" name="email" id="email" placeholder=" Email"
                            value={personDetails.email} onChange={onChangeEmail} />
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                        <input type="number" className="form-control" placeholder="numberOfDiners" min={1} max={15}
                            value={numberOfDiners} onChange={onChangeNumberOfDiners} />
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
                            <Form.Select aria-label="Default select example" onChange={onChangeHour} defaultValue={hoursList[hoursList.length - 1]}> 
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
                    <textarea className="form-control" name="message" rows="4" placeholder="Additional details"
                        value={additionalDetails} onChange={onChangeAdditionalDetails} />
                </div>

                <div className="text-center mt-4">
                    <input type="submit" value="Send Reservation Request"
                        className="btn btn-primary btn-user btn-block"
                    />
                    <div className="row">
                        <ColorRing
                            visible={showLoader}
                            ariaLabel="blocks-loading"
                            colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                        />
                    </div>

                </div>
                <h6 className="text-center mt-4">*For reservations with more than 15 diners please call us</h6>
            </form>
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
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            popupMessage.title === 'New Reservation' ?
                                'success'
                                :
                                'info'
                        }
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>

    );
};
export default TableReservation;