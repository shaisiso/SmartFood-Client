import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import ShiftService from '../services/ShiftService';
import { compareDatesHour, extractHttpError, formatDateForServer, getCurrentDate, getDateOfLocalDateTimeSt, getTimeOfLocalDateTimeSt } from '../utility/Utils';
import EditableRowShifts from './EditableRowShifts';
import PopupMessage from './PopupMessage';
import ReadOnlyRow from './ReadOnlyRow';
const notApprovedColor = '#F9FF9E'
const approvedColor = '#AAFF8A'
const ShiftsManagement = () => {
    const [employeeId, setEmployeeId] = useState(null);
    const [isByEmployee, setIsByEmployee] = useState(false);
    const [shifts, setShifts] = useState([])
    const [startDate, setStartDate] = useState(getCurrentDate())
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)
    const [editShiftId, setEditShiftId] = useState(null);
    const [editFormData, setEditFormData] = useState({ id: '', name: '', shiftEntrance: '', shiftExit: '', isApproved: false });
    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        }
    })
    const onChangeEmployeeId = e => {
        console.log(e.target.value)
        setEmployeeId(e.target.value)
    }
    const onChangeByEmployee = e => {
        let fieldValue = e.target.value === 'true' ? true : e.target.value === 'false' ? false : e.target.value
        setIsByEmployee(fieldValue)
    }
    const onChangeStartDate = (e) => {
        setStartDate(e.target.value)
    }
    const onChangeEndDate = (e) => {
        setEndDate(e.target.value)
    }
    const getShifts = async (e) => {
        e?.preventDefault()
        setShowLoader(true)
        let startDateAPI = formatDateForServer(new Date(startDate))
        let endDateAPI = formatDateForServer(new Date(endDate))
        if (isByEmployee)
            await getShiftByEmployeeAndDates(startDateAPI, endDateAPI)
        else
            await getShiftByDate(startDateAPI, endDateAPI)
        setShowLoader(false)
    }
    const getShiftByDate = async (startDateAPI, endDateAPI) => {
        await ShiftService.getShiftByDates(startDateAPI, endDateAPI)
            .then(res => {
                setShifts(res.data)
                if (res.data.length === 0)
                    setPopupMessage({ title: 'Error', messages: ['There are no shifts in the requested range of dates'] })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const getShiftByEmployeeAndDates = async (startDateAPI, endDateAPI) => {
        console.log(employeeId)
        await ShiftService.getShiftByEmployeeIdAndDates(employeeId, startDateAPI, endDateAPI)
            .then(res => {
                setShifts(res.data)
                if (res.data.length === 0)
                    setPopupMessage({ title: 'Error', messages: ['There are no shifts in the requested range of dates'] })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const handleEditClick = (event, shift) => {
        setEditShiftId(shift.shiftID);
        setEditFormData({ ...shift });
    };

    const handleEditFormChange = (event) => {
        let fieldName = event.target.getAttribute("name");
        let fieldValue = event.target.value;
        if (fieldName === 'startDate') {
            let date = formatDateForServer(event.target.value)
            fieldValue = `${date} ${getTimeOfLocalDateTimeSt(editFormData.shiftEntrance)}`
            fieldName = 'shiftEntrance'
        }
        else if (fieldName === 'startTime') {
            fieldValue = `${getDateOfLocalDateTimeSt(editFormData.shiftEntrance)} ${event.target.value}`
            fieldName = 'shiftEntrance'
        }
        else if (fieldName === 'endDate') {
            let date = formatDateForServer(event.target.value)
            console.log(date)
            fieldValue = `${date} ${getTimeOfLocalDateTimeSt(editFormData.shiftExit)}`
            fieldName = 'shiftExit'
        }
        else if (fieldName === 'endTime') {
            fieldValue = `${getDateOfLocalDateTimeSt(editFormData.shiftExit)} ${event.target.value}`
            fieldName = 'shiftExit'
        }
        else if (fieldName === 'Approved') {
            fieldName = 'isApproved'
            fieldValue = 'Approved'
        }
        else if (fieldName === 'NotApproved') {
            fieldName = 'isApproved'
            fieldValue = 'Not Approved'
        }
        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;
        setEditFormData({ ...newFormData });
    };
    const updateShiftClick = async event => {
        setShowLoader(true)
        if (!allFieldsValid())
            return
        let originalShift = shifts.find(s => s.shiftID === editFormData.shiftID)
        let updatedShift = { ...originalShift, shiftEntrance: editFormData.shiftEntrance, shiftExit: editFormData.shiftExit, isApproved: editFormData.isApproved === 'Approved' }
        await ShiftService.updateShift(updatedShift)
            .then(res => {
                getShifts()
                setEditShiftId(null);
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)

    }
    const allFieldsValid = () => {
        if (!editFormData.shiftExit) {
            setPopupMessage({ title: 'Error', messages: ['Please enter shift end time'] })
            return false
        }
        let [startDate, startHour] = [getDateOfLocalDateTimeSt(editFormData.shiftEntrance), getTimeOfLocalDateTimeSt(editFormData.shiftEntrance)]
        let [endDate, endHour] = [getDateOfLocalDateTimeSt(editFormData.shiftExit), getTimeOfLocalDateTimeSt(editFormData.shiftExit)]
        if (compareDatesHour(startDate, startHour, endDate, endHour) > 0) {
            setPopupMessage({ title: 'Error', messages: ['End shift must be after start shift'] })
            return false
        }
        return true
    }
    const handleCancelClick = () => {
        setEditShiftId(null);
    };
    return (
        <form onSubmit={getShifts} className="container  py-3 px-5 text-center ">
            <h2><b><u>My Shifts</u></b></h2>
            <table className="mx-auto my-4">
                <tbody>
                    <tr className="align middle text center">
                        <td className="col-md-4 form-group ">
                            <Form.Check
                                inline
                                label="All"
                                name="All"
                                type='radio'
                                id={`1`}
                                value={false}
                                checked={isByEmployee === false}
                                onChange={onChangeByEmployee} />
                            <Form.Check
                                inline
                                label="By Employee"
                                name="Employee"
                                type='radio'
                                id={`2`}
                                value={true}
                                checked={isByEmployee === true}
                                onChange={onChangeByEmployee} />
                        </td>
                        <td className="col-md-4 form-group ">
                            <FloatingLabel label="Employee Id">
                                <input type="number" style={{ textAlign: "left" }} className="form-control" min={1} disabled={!isByEmployee} required
                                    name="phoneNumber" value={employeeId || ''} onChange={onChangeEmployeeId}
                                />
                            </FloatingLabel>
                        </td>

                    </tr>
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
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Employee Id </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Employee Name </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Start  </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> End  </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Approved by Shift Manager </th>
                                <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Actions </th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.map((s, key) => (
                                <Fragment key={key}>
                                    {
                                        editShiftId === s.shiftID ?
                                            <EditableRowShifts
                                                editFormData={editFormData}
                                                handleEditFormChange={handleEditFormChange}
                                                handleCancelClick={handleCancelClick}
                                                handleSaveClick={updateShiftClick}
                                            />
                                            :
                                            <ReadOnlyRow
                                                item={{
                                                    shiftID: s.shiftID, employeeID: s.employee.id, name: s.employee.name,
                                                    shiftEntrance: s.shiftEntrance,
                                                    shiftExit: s.shiftExit, isApproved: s.isApproved ? 'Approved' : 'Not Approved'
                                                }}
                                                rowColor={s.isApproved ? approvedColor : notApprovedColor}
                                                handleEditClick={handleEditClick}
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

export default ShiftsManagement;