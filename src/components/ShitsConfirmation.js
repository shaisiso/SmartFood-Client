import React from 'react';
import { Fragment } from 'react';
import ReadOnlyRow from './ReadOnlyRow';
import { enumForReading } from '../utility/Utils';
import ShiftService from '../services/ShiftService';
import { useState } from 'react';
import { useEffect } from 'react';


const ShitsConfirmation = props => {
    const [shifts, setShifts] = useState([]);
    useEffect(() => {

        setShifts(props.shifts)
    }, [props.shifts, shifts]);
    const onClickApprove = (event, shift) => {
        event.preventDefault();
        shift.isApproved = true
        ShiftService.updateShift(shift)
            .catch(err => {
                console.log(err)
            })
    }
    const onClickDecline =(event, shift) => {
        event.preventDefault();
        console.log(shift)
        ShiftService.deleteShift(shift)
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <table className="table table-striped table-bordered text-center" style={{ backgroundColor: 'white' }}>
            <thead>
                <tr>
                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Start Time </th>
                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> End Time </th>
                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Employee </th>

                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Action </th>
                </tr>
            </thead>
            <tbody>
                {shifts.map((s, key) => (
                    <Fragment key={key}>
                        <ReadOnlyRow
                            item={{
                                shiftEntrance: s.shiftEntrance, shiftExit: s.shiftExit, employeeName: `${s.employee.name} - ${enumForReading(s.employee.role)}`,
                                actions: <div>
                                    <button className="btn btn-success" onClick={e => onClickApprove(e, s)}>Approve</button> 
                                    <button className="btn btn-danger" onClick={e=>onClickDecline(e,s)}>Decline</button>
                                </div>
                            }}
                            withId
                        //  rowColor={s.isApproved ? approvedColor : notApprovedColor}
                        />
                    </Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default ShitsConfirmation;