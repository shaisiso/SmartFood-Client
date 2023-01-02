import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { FloatingLabel } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import PopupMessage from '../components/PopupMessage';
import ReadOnlyRow from '../components/ReadOnlyRow';
import TableReservationService from '../services/TableReservationService';
import { extractHttpError, formatDateForServer, getCurrentDate } from '../utility/Utils';

const Reservations = () => {
    const [reservations, setReservations] = useState([])
    const [startDate, setStartDate] = useState(getCurrentDate())
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)

    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            getReservations()
        }
    })
    const onChangeStartDate = (e) => {
        setStartDate(e.target.value)
    }
    const onChangeEndDate = (e) => {
        setEndDate(e.target.value)
    }
    const getReservations = async (e) => {
        e?.preventDefault()
        setShowLoader(true)
        let startDateAPI = formatDateForServer(new Date(startDate))
        let endDateAPI = formatDateForServer(new Date(endDate))
        await TableReservationService.getTableReservationsByDates(startDateAPI, endDateAPI)
            .then(res => {
                setReservations(res.data)
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    return (
        <form onSubmit={getReservations} className="container col  py-4 px-5 text-center ">
            <h2><b><u>Table Reservations</u></b></h2>
            <table className="mx-auto my-4">
                <tbody>
                    <tr className="align middle text center">

                        <td className="col-md-4 form-group">
                            <FloatingLabel label="Start Date">
                                <input type="date" style={{ textAlign: "left" }} className="form-control"
                                    name="date" value={startDate} onChange={onChangeStartDate} required
                                />
                            </FloatingLabel>
                        </td>
                        <td className="col-md-4 form-group">
                            <FloatingLabel label="End Date">
                                <input type="date" style={{ textAlign: "left" }} className="form-control"
                                    name="date" value={endDate} onChange={onChangeEndDate} required min={startDate}
                                />
                            </FloatingLabel>
                        </td>
                        <td className="col-md-4 form-group">
                            <input type="submit" className='btn btn-primary' value="Find Reservations" />
                            <ColorRing
                                visible={showLoader}
                                ariaLabel="blocks-loading"
                                colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            {
                reservations.length > 0 ?
                    <table className="table table-striped table-bordered text-center" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Date </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Hour </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Name </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Phone Number </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Table Number </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Number of Diners </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Additional Details </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((r, key) => (
                                <Fragment key={key}>
                                    <ReadOnlyRow
                                        item={{ date: r.date, hour: r.hour, name: r.person.name, phone: r.person.phoneNumber, tableId: r.table.tableId, numberOfDiners: r.numberOfDiners, additionalDetails: r.additionalDetails }}
                                        withId
                                    />
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
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            'info'
                        }
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </form>
    );
};

export default Reservations;