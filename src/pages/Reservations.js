import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import EditableRowReservation from '../components/EditableReservation';
import PopupMessage from '../components/PopupMessage';
import ReadOnlyRow from '../components/ReadOnlyRow';
import TableReservationService from '../services/TableReservationService';
import { allCharsAreDigits, extractHttpError, formatDateForServer, getCurrentDate, hebrewStDateToBrowserDate, isDateInFuture } from '../utility/Utils';

const INTERVAL_MS = 60_000; // one minute

const Reservations = (props) => {
    const [reservations, setReservations] = useState([])
    const [showOldReservations, setShowOldReservations] = useState(JSON.parse(window.localStorage.getItem("showOldReservations") || 'true'));
    const [reservationsToShow, setReservationsToShow] = useState([]);
    const [startDate, setStartDate] = useState(getCurrentDate())
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)
    const [editReservationId, setEditReservationId] = useState(null);
    const [editFormData, setEditFormData] = useState(null);
    const [reservationToDelete, setReservationToDelete] = useState(null)

    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            getReservations()
        }
        const reservationsInterval = setInterval(() => {
            getReservations()
        }, INTERVAL_MS);
        return () => clearInterval(reservationsInterval);
    })
    const onChangeShowOldReservations = e => {
        let fieldValue = e.target.checked
        setShowOldReservations(fieldValue)
        window.localStorage.setItem("showOldReservations", fieldValue)
        filterReservations(reservations, fieldValue)
    }
    const filterReservations = (allReservations, showOld) => {
        if (showOld)
            setReservationsToShow(allReservations)
        else {
            allReservations = [...allReservations].filter(r => isDateInFuture(r.date, r.hour))
            setReservationsToShow([...allReservations])
        }
    }
    const onChangeStartDate = (e) => {
        setStartDate(e.target.value)
    }
    const onChangeEndDate = (e) => {
        setEndDate(e.target.value)
    }
    const getReservations = async (e) => {
        e?.preventDefault()
        if (props.userReservations) {
            setReservations(props.userReservations)
            filterReservations(props.userReservations, showOldReservations)
        }
        else {
            setShowLoader(true)
            let startDateAPI = formatDateForServer(new Date(startDate))
            let endDateAPI = formatDateForServer(new Date(endDate))
            await TableReservationService.getTableReservationsByDates(startDateAPI, endDateAPI)
                .then(res => {
                    setReservations(res.data)
                    filterReservations(res.data, showOldReservations)
                })
                .catch(err => {
                    setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                })
            setShowLoader(false)
        }

    }
    const handleEditClick = (event, resrevation) => {
        setEditReservationId(resrevation.reservationId);
        setEditFormData({ ...resrevation, date: hebrewStDateToBrowserDate(resrevation.date) });
    };

    const handleCancelClick = () => {
        setEditReservationId(null);
    };
    const handleDeleteClick = (e, resrevation) => {
        e.preventDefault();
        setReservationToDelete(resrevation)
        setPopupMessage({
            title: 'Delete Request',
            messages: ['Are you sure you want to delete this table reservation ?']
        })
    };
    const deleteReservation = async () => {
        setShowLoader(true)
        await TableReservationService.delete(reservationToDelete)
            .then(res => {
                if (props.onChangeReservations)
                    props.onChangeReservations()
                else
                    getReservations()
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");

        const fieldValue = event.target.value;
        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);
    };
    const updateTableClick = async event => {
        event.preventDefault()
        if (!allCharsAreDigits(editFormData.numberOfDiners)) {
            setPopupMessage({ title: 'Error', messages: ['Enter valid number of diners'] })
            return
        }
        setShowLoader(true)
        let r = reservations.find(r => r.reservationId === editFormData.reservationId)
        let reservationToSave = {
            reservationId: editFormData.reservationId,
            date: formatDateForServer(editFormData.date),
            hour: editFormData.hour,
            numberOfDiners: editFormData.numberOfDiners,
            additionalDetails: editFormData.additionalDetails,
            person: { ...r.person }
        }
        await TableReservationService.updateTableReservation(reservationToSave)
            .then(() => {
                setPopupMessage({ title: 'Reservation Update', messages: ['The table reservation details were updated'] })
            })
            .catch(err => setPopupMessage({ title: 'Error', messages: extractHttpError(err) }))
        setShowLoader(false)
    }
    return (
        <form onSubmit={getReservations} className="container col  py-4 px-5 text-center ">
            <h2><b><u>Table Reservations</u></b></h2>
            {
                !props.userReservations ?
                    <table className="mx-auto mt-4">
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
                    : null
            }
            <div className="d-flex justify-content-center pt-5 h5">
                <Form.Check
                    inline
                    label="Show Old Reservations"
                    name="forMembersOnly"
                    type='checkbox'
                    id={`1`}
                    value={true}
                    checked={showOldReservations === true}
                    onChange={onChangeShowOldReservations}
                />
            </div>
            {
                reservationsToShow.length > 0 ?
                    <table className="table table-striped table-bordered text-center my-4" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Date </th>
                                <th style={{ cursor: 'pointer', minWidth: '8rem ' }} /*onClick={sortByName}*/> Hour </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Name </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Phone Number </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Email </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Number of Diners </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Table Number </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Additional Details </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservationsToShow.map((r, key) => (
                                <Fragment key={key}>
                                    {
                                        editReservationId === r.reservationId ?
                                            <EditableRowReservation
                                                editFormData={editFormData}
                                                handleEditFormChange={handleEditFormChange}
                                                handleCancelClick={handleCancelClick}
                                                handleSaveClick={updateTableClick}
                                            />
                                            :
                                            <ReadOnlyRow
                                                item={{ reservationId: r.reservationId, date: r.date, hour: r.hour, name: r.person.name, phoneNumber: r.person.phoneNumber, email: r.person.email, numberOfDiners: r.numberOfDiners, tableId: r.table.tableId, additionalDetails: r.additionalDetails }}
                                                // withId
                                                handleEditClick={handleEditClick}
                                                handleDeleteClick={handleDeleteClick}
                                                disabledActions={!isDateInFuture(r.date, r.hour)}
                                                rowColor={isDateInFuture(r.date, r.hour) ? 'white' : '#80808090'}
                                            />
                                    }
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
                            if (popupMessage.title.toLowerCase().includes('update')) {
                                if (props.onChangeReservations)
                                    props.onChangeReservations()
                                else
                                    getReservations()
                                setEditReservationId(null)
                            }
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            popupMessage.title.toLowerCase().includes('update') ?
                                'success'
                                :
                                'info'
                        }
                        closeOnlyWithBtn
                        withOk={popupMessage.title.toLowerCase().includes('delete')}
                        okBtnText={popupMessage.title.toLowerCase().includes('delete') ? "Yes" : ''}
                        cancelBtnText={popupMessage.title.toLowerCase().includes('delete') ? "No" : ''}

                        onClickOk={popupMessage.title.toLowerCase().includes('delete') ?
                            e => {
                                e.preventDefault();
                                deleteReservation()
                                setPopupMessage({ title: '', messages: [''] })
                            }
                            : null
                        }
                        onClickCancel={
                            popupMessage.title.toLowerCase().includes('delete') ?
                                e => {
                                    e.preventDefault();
                                    setReservationToDelete(null)
                                    setPopupMessage({ title: '', messages: [''] })
                                }
                                : null
                        }
                    >
                    </PopupMessage>
                    :
                    null
            }
        </form>
    );
};

export default Reservations;