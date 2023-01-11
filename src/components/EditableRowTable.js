import React from 'react';

const EditableRowTable = ({ editFormData, handleEditFormChange, handleCancelClick, handleSaveClick }) => {
    return (
        <tr style={{ backgroundColor: 'yellow' }}>
            <td className="align-middle">{editFormData.tableId}</td>
            <td className="align-middle">
                <input
                    type="number"
                    min={1}
                    className="form-control"
                    required
                    placeholder="Enter number of seats..."
                    name="name"
                    value={editFormData.numberOfSeats}
                    onChange={handleEditFormChange}
                ></input>
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

export default EditableRowTable;