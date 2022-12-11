import React from "react";
import { Form } from "react-bootstrap";

const EditableRowMenu = ({ editFormData, categories, handleEditFormChange, handleCancelClick, handleSaveClick }) => {
    return (
        <tr style={{ backgroundColor: 'yellow' }}>
            <td className="align-middle">
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
            <td className="align-middle">
                <Form.Select aria-label="Select Category" onChange={handleEditFormChange} name="category" >
                    {
                        categories.map((category, key) => (
                            <option key={key} value={category} >{category}</option>
                        ))
                    }
                </Form.Select>
            </td>
            <td className="align-middle">
                <textarea
                    rows="2"
                    className="form-control"
                    placeholder="Enter description..."
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                ></textarea>
            </td>
            <td className="align-middle">
                <input
                    type="number"
                    min={1}
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

export default EditableRowMenu;