import React from 'react';
import { Fragment } from 'react';
import ReadOnlyRow from './ReadOnlyRow';
import { enumForReading, extractHttpError } from '../utility/Utils';
import ShiftService from '../services/ShiftService';
import { useState } from 'react';
import { useEffect } from 'react';
import PopupMessage from './PopupMessage';
import { ColorRing } from 'react-loader-spinner';


const ShitsConfirmation = props => {
    const [shifts, setShifts] = useState([]);
    const [propsShiftsPrev, setPropsShiftslPrev] = useState([]);
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)

    useEffect(() => {
        if (props.shifts !== propsShiftsPrev) {
            setShifts([...props.shifts])
            setPropsShiftslPrev(props.shifts)
        }
    }, [props.shifts, shifts, propsShiftsPrev]);

    const onClickApprove = async (event, shift) => {
        event.preventDefault();
        setShowLoader(true)
        shift.isApproved = true
        await ShiftService.updateShift(shift)
            .then(() => {
                let updatedShifts = shifts.filter(s => s.shiftID !== shift.shiftID)
                setShifts([...updatedShifts])
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const onClickDecline = async (event, shift) => {
        event.preventDefault();
        setShowLoader(true)
        await ShiftService.deleteShift(shift)
            .then(() => {
                let updatedShifts = shifts.filter(s => s.shiftID !== shift.shiftID)
                setShifts([...updatedShifts])
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    return (
        <div className="row text-center m-1">
            <h3><b><u>Shifts Confirmations:</u></b></h3>
            <table className="table table-striped table-bordered text-center" style={{ backgroundColor: 'white' }}>
                <thead>
                    <tr>
                        <th /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> Start Time </th>
                        <th /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> End Time </th>
                        <th /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> Employee </th>

                        <th  /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.map((s, key) => (
                        <Fragment key={key}>
                            <ReadOnlyRow
                                item={{
                                    shiftEntrance: s.shiftEntrance,
                                    shiftExit: s.shiftExit || '',
                                    employeeName: `${s.employee.name} - ${enumForReading(s.employee.role)}`,
                                    actions:
                                        <div>
                                            <button className="btn btn-success" onClick={e => onClickApprove(e, s)}>Approve</button>
                                            <button className="btn btn-danger" onClick={e => onClickDecline(e, s)}>Decline</button>
                                        </div>
                                }}
                                withId
                            //  rowColor={s.isApproved ? approvedColor : notApprovedColor}
                            />
                        </Fragment>
                    ))}
                </tbody>
            </table>
            <div className="text-center">
                <ColorRing
                    visible={showLoader}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
            </div>
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

export default ShitsConfirmation;