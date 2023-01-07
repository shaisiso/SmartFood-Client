import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import { formatDateForBrowser, formatDateForServer, formatDateWithSlash, isValidPhone, isValidName, isDateInFuture, extractHttpError, getCurrentDate, isValidDateForReservation } from "../utility/Utils";
import Axios from 'axios';
import { API_URL, cleanAll } from '../utility/Utils';
import PopupMessage from '../components/PopupMessage';
import { ColorRing } from 'react-loader-spinner'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FormControl } from "react-bootstrap";
import TableReservationService from "../services/TableReservationService";
import WaitingListService from "../services/WaitingListService";

const hoursList = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];
const getMaxDate = () => {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1)
    return formatDateForBrowser(date)
}


const TableReservation = () => {
    const [personDetails, setPersonDetails] = useState({ name: '', phoneNumber: '', email: '' })
    const [chosenDate, setChosenDate] = useState(getCurrentDate());
    const [chosenHour, setChosenHour] = useState(`${hoursList[hoursList.length - 1]}`)
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
    const onChangeHour = event => setChosenHour(`${event.target.value}`)
    const onChangeNumberOfDiners = event => setNumberOfDiners(event.target.value)
    const onChangeAdditionalDetails = event => setAdditionalDetails(event.target.value)

    const onFocusOutPhone = () => {
        Axios.get(`${API_URL}/api/person/${personDetails.phoneNumber}`)
            .then(res => {
                setPersonDetails(res.data)
            })
    }

    const onSubmit = async (e) => {
        e?.preventDefault();
        setShowLoader(true)
        if (!fieldsAreValid()) {
            setShowLoader(false)
            return
        }

        var date = new Date(chosenDate)
        var reservation = {
            person: personDetails,
            date: formatDateForServer(date),
            hour: chosenHour,
            numberOfDiners: numberOfDiners,
            additionalDetails: additionalDetails
        }
        await TableReservationService.addTableReservation(reservation)
            .then((res) => {
                let messages = ['Your reservation was saved and SMS will be sent for you',
                    `Phone Number: ${personDetails.phoneNumber}`, `At: ${formatDateWithSlash(date)} - ${chosenHour}`,
                    `Diners: ${numberOfDiners}`]
                if (additionalDetails)
                    messages.push(`Additional Details: ${additionalDetails}`)
                setPopupMessage({ title: 'New Reservation', messages: messages })
            }).catch(err => {
                var errMsg = extractHttpError(err);
                if (err.response.status === 409) {// Conflict -> waiting list
                    setPopupMessage({ title: 'Reservation Not Available', messages: [...errMsg, "Do you want to enter the waiting list?", "You can also check for other availble hours."] })
                } else {
                    setPopupMessage({ title: 'Error', messages: errMsg })
                }
            })
        setShowLoader(false)
    }
    const fieldsAreValid = () => {
        var errors = []
        if (!isValidPhone(personDetails.phoneNumber))
            errors.push('Phone number must be 10 consecutive digits in format: 05xxxxxxxxx')

        if (!isValidName(personDetails.name))
            errors.push('Name must have at least 2 letters and contain only letters in english.')

        if (!isDateInFuture(new Date(chosenDate), chosenHour))
            errors.push('Date and hour should be in future.')

        if (errors.length > 0) {
            setPopupMessage({ title: 'Error', messages: errors })
            return false
        }
        return true
    }
    const addToWaitingList = async () => {
        setShowLoader(true)
        var date = new Date(chosenDate)
        var waitingListRequest = {
            person: personDetails,
            date: formatDateForServer(date),
            hour: chosenHour,
            numberOfDiners: numberOfDiners
        }
        await WaitingListService.add(waitingListRequest)
            .then(res => {
                let messages = ['You were added to the waiting list and we will notify you if your reservation can be saved.',
                    `Phone Number: ${personDetails.phoneNumber}`, `At: ${formatDateWithSlash(date)} - ${chosenHour}`,
                    `Diners: ${numberOfDiners}`]
                setPopupMessage({ title: 'Waiting List', messages: messages })
            }).catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const getAvailableHours = async () => {
        setShowLoader(true)
        let dateForAPI = formatDateForServer(new Date(chosenDate))
        TableReservationService.getAvailableHoursByDateAndDiners(dateForAPI, numberOfDiners)
            .then(res => {
                console.log(res)
                let availableHours = [...res.data]
                setChosenHour(availableHours[0])
                setPopupMessage({
                    title: 'Available Hours', messages: ['Your reservation request can be save for the following hours:',
                        <FloatingLabel label="Choose Hour">
                            <Form.Select aria-label="Select hour" onChange={onChangeHour} defaultValue={availableHours[0]}>
                                {
                                    availableHours.map((item, key) => (
                                        <option key={key} value={item} disabled={!isValidDateForReservation(new Date(chosenDate), item)}>{item}</option>
                                    ))
                                }
                            </Form.Select>
                        </FloatingLabel>
                    ]
                })
            })
            .catch(err => {
                console.log(err)
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const cleanForm = () => {
        // setPersonDetails({ name: '', phoneNumber: '', email: '' })
        // setChosenDate(getCurrentDate())
        // setChosenHour(`${hoursList[hoursList.length - 1]}`)
        // setNumberOfDiners(1)
        // setAdditionalDetails('')
        cleanAll()
    }
    return (
        <div className="container col col-lg-6 col-sm-10 py-3 px-5" style={{ backgroundColor: "#ffffff90", }}>
            <div className="section-title">
                <h1 className="hRestaurant" style={{ color: "black" }}>Table Reservation</h1>
            </div>
            <form onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-md-6 form-group">
                        <FloatingLabel label="*Phone Number">
                            <input type="phone" className="form-control" name="subject" placeholder="*Phone Number" required
                                value={personDetails.phoneNumber} onChange={onChangePhoneNumber} onBlur={onFocusOutPhone} />
                        </FloatingLabel>
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                        <FloatingLabel controlId="floatingInput" label="*Name">
                            <FormControl type="text" name="name" className="form-control" placeholder="*Name" required
                                value={personDetails.name} onChange={onChangeName} />
                        </FloatingLabel>
                    </div>

                </div>
                <div className="row form-group mt-3">
                    <div className="col-md-6 form-group">
                        <FloatingLabel label="Email">
                            <input type="email" className="form-control" name="email" id="email"
                                value={personDetails.email} onChange={onChangeEmail} />
                        </FloatingLabel>
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                        <FloatingLabel controlId="floatingDiners" label="Number of Diners">
                            <input type="number" className="form-control" min={1} max={15}
                                value={numberOfDiners} onChange={onChangeNumberOfDiners} />
                        </FloatingLabel>
                    </div>
                </div>
                <div className="form-group mt-3">
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <FloatingLabel label="Choose Date">
                                <input type="date" style={{ textAlign: "left" }} className="form-control"
                                    name="date" value={chosenDate} onChange={onChangeDate} required
                                    min={getCurrentDate()} max={getMaxDate()} />
                            </FloatingLabel>
                        </div>
                        <div className="col-md-6 form-group mt-3 mt-md-0">
                            <FloatingLabel label="Choose Hour">
                                <Form.Select aria-label="Select hour" onChange={onChangeHour} defaultValue={hoursList[hoursList.length - 1]}>
                                    {
                                        hoursList.map((item, key) => (
                                            <option key={key} value={item} disabled={!isValidDateForReservation(new Date(chosenDate), item)}>{item}</option>
                                        ))
                                    }
                                </Form.Select>
                            </FloatingLabel>
                        </div>
                    </div>
                </div>
                <div className="form-group mt-3">
                    <FloatingLabel label="Additional Details" >
                        <textarea className="form-control" name="message" rows="4"
                            value={additionalDetails} onChange={onChangeAdditionalDetails} style={{ height: '10rem' }} />
                    </FloatingLabel>
                </div>

                <div className="d-flex justify-content-center form-group mt-5">
                    <div className="col-md-6 form-group">
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
                        onClose={
                            popupMessage.title.includes('New') ?
                            e => {
                             //   e.preventDefault()
                                cleanForm()
                            }
                            :
                            e => {
                              //  e.preventDefault()
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
                        withOk={popupMessage.title.includes('Available')}
                        okBtnText={popupMessage.title.includes('Available Hours') ? "Send Reservation Request" : "Enter Waiting List"}
                        onClickOk={
                            popupMessage.title.includes('Available Hours') ?
                                e => { //send table reservation
                                    e.preventDefault()
                                    onSubmit()
                                }
                                : //add to waiting lists
                                e => {
                                    e.preventDefault()
                                    addToWaitingList()
                                }}
                        cancelBtnText={popupMessage.title.includes('Not Available') ? "Other Available Hours" : null}
                        onClickCancel={e => {
                            e.preventDefault()
                            getAvailableHours()
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
export default TableReservation;