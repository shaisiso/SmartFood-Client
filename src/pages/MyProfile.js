import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import TokenService from '../services/TokenService';
import EmployeeService from '../services/EmployeeService';
import { enumForReading } from '../utility/Utils';

const MyProfile = () => {
    const [employee, setEmployee] = useState({ id: '', phoneNumber: '', name: '', email: '', address: { city: '', streetName: '', houseNumber: '' }, role: '' })
    const [editMode, setEditMode] = useState(false)
    const [password, setPassword] = useState({
        old: "",
        new: "",
        repeat: "",
        errors: []
    })
    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            let phoneNumber = TokenService.getUser().phoneNumber
            EmployeeService.findEmployeeByPhone(phoneNumber)
                .then(res => {
                    setEmployee(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        console.log(employee)

    })
    const handleEditClick = e => {
        e.preventDefault()
        setEditMode(!editMode)
    }
    const onChangeDetails = e => {

    }
    const onChangePassword = e => {

    }
    const updateDetails = e => {
        e.preventDefault();
    }
    const updatePassword = e => {
        e.preventDefault();
        setPassword({})
    }
    return (
        <div className="wrapper ">
            <div className="row">
                <div className="col-md-5 border-right">
                    <div className="p-3 py-5">
                        <span className="h4 text-black">Profile details</span>
                        <span className="ml-2 ">
                            <button
                                className="btn btn-secondary btn-sm d-flex mt-4"
                                onClick={handleEditClick}
                            >
                                Edit ✏️
                            </button>
                        </span>
                        <form onSubmit={updateDetails}>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="d-flex">Id</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={employee.id}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="d-flex">Role</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={enumForReading(employee.role) }
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="d-flex">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled={!editMode}
                                        value={employee.name}
                                        onChange={onChangeDetails}
                                        required
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="d-flex">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled={!editMode}
                                        value={employee.phoneNumber}
                                        onChange={onChangeDetails}
                                        required
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className="d-flex">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        disabled={!editMode}
                                        value={employee.email}
                                        onChange={onChangeDetails}
                                        required
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="d-flex">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled={!editMode}
                                        value={employee.address.city}
                                        onChange={onChangeDetails}
                                        required
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="d-flex">Street</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled={!editMode}
                                        value={employee.address.streetName}
                                        onChange={onChangeDetails}
                                        required
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="d-flex">House Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled={!editMode}
                                        value={employee.address.houseNumber}
                                        onChange={onChangeDetails}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                {
                                    editMode ? (
                                        <input
                                            className="btn btn-primary profile-button"
                                            type="submit"
                                            value="Update"
                                        />
                                    ) : null
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-7 py-5">
                    <h4 className="text-black">Change Password</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <form>
                                <div className="col-md-12 mt-4">
                                    <label className="labels">Old Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        autoComplete="on"
                                        value={password.old}
                                        onChange={onChangePassword}
                                    />
                                </div>{" "}
                                <br />
                                <div className="col-md-12">
                                    <label className="labels">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password.new}
                                        onChange={onChangePassword}
                                        autoComplete="on"
                                    />
                                </div>{" "}
                                <br />
                                <div className="col-md-12">
                                    <label className="labels">Reapeat Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        autoComplete="on"
                                        value={password.repeat}
                                        onChange={onChangePassword}
                                    />
                                </div>{" "}
                                <br />
                                <button
                                    className="btn btn-primary profile-button"
                                    type="button"
                                    onClick={updatePassword}
                                //  disabled={!allPasswordCorrect(this.state.password.errors)}
                                >
                                    Change Password
                                </button>
                            </form>

                        </div>

                        {/* <div className="col-md-5 mt-5 text-left">
                            {
                                password.errors.length > 0 ?
                                    <>
                                        {password.errors.map((item, key) => (
                                            <div key={key}>
                                                < ShowPasswordMsg
                                                    match={item.valid}
                                                    text={item.msg}
                                                />
                                                <br />
                                            </div>
                                        ))}
                                    </>
                                    :
                                    null
                            }
                        </div> */}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MyProfile;