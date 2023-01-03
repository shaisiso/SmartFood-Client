import React from 'react';
import { Fragment } from 'react';
import ReadOnlyRow from './ReadOnlyRow';
import { enumForReading, extractHttpError } from '../utility/Utils';
import ShiftService from '../services/ShiftService';
import { useState } from 'react';
import { useEffect } from 'react';
import PopupMessage from './PopupMessage';


const ShitsConfirmation = props => {
    const [shifts, setShifts] = useState([]);
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })

    useEffect(() => {
        setShifts(props.shifts)
    }, [props.shifts, shifts]);

    const onClickApprove = (event, shift) => {
        event.preventDefault();
        shift.isApproved = true
        ShiftService.updateShift(shift)
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const onClickDecline = (event, shift) => {
        event.preventDefault();
        ShiftService.deleteShift(shift)
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
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