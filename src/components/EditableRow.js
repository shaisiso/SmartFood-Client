import React from "react";

const EditableRow = ({ editFormData, handleEditFormChange,handleCancelClick, handleSaveClick}) => {
    return (
        <tr >
            <td>
                <input
                    type="text"
                    className="form-control"
                    required="required"
                    placeholder="Enter a name..."
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                ></input>
            </td>
            <td>
                <input
                    type="text"
                    className="form-control"
                    required="required"
                    placeholder="Enter category..."
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                ></input>
            </td>
            <td>
                <textarea

                    rows="2"
                    className="form-control"
                    placeholder="Enter description..."
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                ></textarea>
            </td>
            <td>
                <input
                    type="text"
                    className="form-control"
                    required="required"
                    placeholder="Enter price..."
                    name="price"
                    value={editFormData.price}
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

export default EditableRow;