import React from 'react';
import { Form } from 'react-bootstrap';
import { formatDateForBrowser, getDateOfLocalDateTimeSt, getTimeOfLocalDateTimeSt, hebrewStDateToBrowserDate } from '../utility/Utils';

const EditableRowShifts = ({ editFormData, handleEditFormChange, handleCancelClick, handleSaveClick }) => {
    const dateToDisplay = (shiftTime) => formatDateForBrowser(hebrewStDateToBrowserDate(getDateOfLocalDateTimeSt(shiftTime)))
    return (
        <tr style={{ backgroundColor: 'yellow' }}>
            <td className="align-middle">{editFormData.employeeID}</td>
            <td className="align-middle">{editFormData.name}</td>
            <td className="align-middle">
                <input type="date" style={{ textAlign: "left" }} className="form-control" name="startDate"
                    value={dateToDisplay(editFormData.shiftEntrance)}
                    onChange={handleEditFormChange}
                    required
                />
                <input type="time" style={{ textAlign: "left" }} className="form-control" name="startTime"
                    value={getTimeOfLocalDateTimeSt(editFormData.shiftEntrance)}
                    onChange={handleEditFormChange}
                    required
                />
            </td>
            <td className="align-middle">
                <input type="date" style={{ textAlign: "left" }} className="form-control" name="endDate"
                    value={editFormData.shiftExit ? dateToDisplay(editFormData.shiftExit) : ''}
                    onChange={handleEditFormChange}
                    required min={dateToDisplay(editFormData.shiftEntrance)}
                />
                <input type="time" style={{ textAlign: "left" }} className="form-control" name="endTime"
                    value={ editFormData.shiftExit ?  getTimeOfLocalDateTimeSt(editFormData.shiftExit) :''}
                    onChange={handleEditFormChange}
                    required
                />
            </td>
            <td className="align-middle">
                <td className="col-md-4 form-group ">
                    <Form.Check
                        inline
                        label="Not Approved"
                        name="NotApproved"
                        type='radio'
                        id={`1`}
                        value={editFormData.isApproved !== 'Approved'}
                        onChange={handleEditFormChange}
                        checked={editFormData.isApproved  !== 'Approved'}
                    />
                    <Form.Check
                        inline
                        label="Approved"
                        name="Approved"
                        type='radio'
                        id={`2`}
                        checked={editFormData.isApproved  === 'Approved'}
                        value={editFormData.isApproved  === 'Approved'}
                        onChange={handleEditFormChange}
                    />
                </td>
            </td>
            <td>
                <button type="submit" className="form-control btn btn-primary mt-1 mx-auto" onClick={handleSaveClick}>Save</button>
                <button type="button" className="form-control btn btn-danger mt-1 mx-auto" onClick={handleCancelClick}>
                    Cancel
                </button>
            </td>
        </tr>
    );
};

export default EditableRowShifts;