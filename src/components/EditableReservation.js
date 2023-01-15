import React from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { getCurrentDate, getMaxDateForReservation, isValidDateForReservation, reservationHoursList } from '../utility/Utils';

const EditableRowReservation = ({ editFormData, handleEditFormChange, handleCancelClick, handleSaveClick }) => {
    return (
        <tr style={{ backgroundColor: 'yellow' }}>
            <td className="align-middle">
                <FloatingLabel label="Choose Date">
                    <input type="date" style={{ textAlign: "left" }} className="form-control"
                        name="date" value={editFormData.date} onChange={handleEditFormChange} required
                        min={getCurrentDate()} max={getMaxDateForReservation()} />
                </FloatingLabel>
            </td>
            <td className="align-middle">
                <FloatingLabel label="Hour">
                    <Form.Select aria-label="Select hour" onChange={handleEditFormChange} name="hour" defaultValue={editFormData.hour}>
                        {
                            reservationHoursList.map((hour, key) => (
                                <option key={key} value={hour} disabled={!isValidDateForReservation(new Date(editFormData.date), hour)}>{hour}</option>
                            ))
                        }
                    </Form.Select>
                </FloatingLabel>
            </td>
            <td className="align-middle">
                {editFormData.name}
            </td>
            <td className="align-middle">
                {editFormData.phoneNumber}
            </td>
            <td className="align-middle">
                {editFormData.email}
            </td>
            <td className="align-middle">
                <input type="number" className="form-control" min={1} max={15} name="numberOfDiners" placeholder='# Diners'
                    value={editFormData.numberOfDiners} onChange={handleEditFormChange} />
            </td>
            <td className="align-middle">
                {editFormData.tableId}
            </td>
            <td className="align-middle">
                <textarea className="form-control" rows="4" name="additionalDetails" placeholder='Additional Details'
                    value={editFormData.additionalDetails || ''} onChange={handleEditFormChange} style={{ height: '5rem' }} />
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

export default EditableRowReservation;