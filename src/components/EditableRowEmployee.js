import React from 'react';
import { Form } from 'react-bootstrap';

const EditableRowEmployee = ({ editFormData, roles, handleEditFormChange, handleCancelClick, handleSaveClick }) => {
    return (
        <tr style={{ backgroundColor: 'yellow' }}>
            <td className="align-middle">{editFormData.id}</td>
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
                <input
                    type="text"
                    className="form-control"
                    required="required"
                    placeholder="Enter Phone Number..."
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleEditFormChange}
                ></input>
            </td>
            <td className="align-middle">
                <Form.Select aria-label="Select Role" onChange={handleEditFormChange} name="role" value={editFormData.role}>
                    {
                        roles.map((role, key) => (
                            <option key={key} value={role} >{role}</option>
                        ))
                    }
                </Form.Select>
            </td>
            <td className="align-middle">
                <input
                    type="email"
                    className="form-control"
                    required="required"
                    placeholder="Enter Email..."
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                ></input>
            </td>
            <td className="align-middle">
                <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="City"
                    id="city"
                    name="address"
                    value={editFormData.address.city ?? ''}
                    onChange={handleEditFormChange}
                />
                <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Street Name"
                    id="streetName"
                    name="address"
                    value={editFormData.address.streetName ?? ''}
                    onChange={handleEditFormChange}
                />
                <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="House Number"
                    name="address"
                    id="houseNumber"
                    value={editFormData.address.houseNumber ?? ''}
                    onChange={handleEditFormChange}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Entrance"
                    name="address"
                    id="entrance"
                    value={editFormData.address.entrance ?? ''}
                    onChange={handleEditFormChange}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Apartment Number"
                    name="address"
                    id="apartmentNumber"
                    value={editFormData.address.apartmentNumber ?? ''}
                    onChange={handleEditFormChange}
                />
            </td>
            <td className="align-middle">
                <button type="submit" className="form-control btn btn-primary mt-1 mx-auto" onClick={handleSaveClick}>Save</button>
                <button type="button" className="form-control btn btn-danger mt-1 mx-auto" onClick={handleCancelClick}>
                    Cancel
                </button>
            </td>
        </tr>
    );
};

export default EditableRowEmployee;