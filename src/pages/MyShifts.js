import React from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import ReadOnlyRow from '../components/ReadOnlyRow';
import TokenService from '../services/TokenService';
import ShiftService from '../services/ShiftService';
import { FloatingLabel } from 'react-bootstrap';
import { extractHttpError, formatDateForServer, getCurrentDate, getDateOfLocalDateTimeSt, getTimeOfLocalDateTimeSt } from '../utility/Utils';
import PopupMessage from '../components/PopupMessage';
import { ColorRing } from 'react-loader-spinner';

const notApprovedColor = '#F9FF9E'
const approvedColor = '#AAFF8A'

const MyShifts = () => {
    const [shifts, setShifts] = useState([])
    const [startDate, setStartDate] = useState(getCurrentDate())
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)

    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        }
    })
    const onChangeStartDate = (e) => {
        setStartDate(e.target.value)
    }
    const onChangeEndDate = (e) => {
        setEndDate(e.target.value)
    }
    const getShifts = async (e) => {
        e.preventDefault()
        setShowLoader(true)
        let employee = { phoneNumber: TokenService.getUser().phoneNumber }
        let startDateAPI = formatDateForServer(new Date(startDate))
        let endDateAPI = formatDateForServer(new Date(endDate))
        await ShiftService.getShiftByEmployeeAndDates(employee, startDateAPI, endDateAPI)
            .then(res => {
                setShifts(res.data)
                if (res.data.length === 0)
                    setPopupMessage({ title: 'Error', messages: ['There are no shifts in the requested range of dates'] })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    return (
        <form onSubmit={getShifts} className="container col col-lg-6 col-sm-10 py-3 px-5 text-center ">
            <h2><b><u>My Shifts</u></b></h2>
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
                            <input type="submit" className='btn btn-primary' value="Find Shifts" />
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
                shifts.length > 0 ?
                    <table className="table table-striped table-bordered text-center" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Date </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Start Time </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> End Time </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Approved by Shift Manager </th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.map((s, key) => (
                                <Fragment key={key}>
                                    <ReadOnlyRow
                                        item={{ date: getDateOfLocalDateTimeSt(s.shiftEntrance), startTime: getTimeOfLocalDateTimeSt(s.shiftEntrance), shiftExit: getTimeOfLocalDateTimeSt(s.shiftExit), isApproved: s.isApproved ? 'Approved' : 'Wait For approve' }}
                                        withId
                                        rowColor={s.isApproved ? approvedColor : notApprovedColor}
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

export default MyShifts;