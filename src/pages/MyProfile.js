import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import TokenService from '../services/TokenService';
import { enumForReading, extractHttpError } from '../utility/Utils';
import PopupMessage from '../components/PopupMessage';
import { ColorRing } from 'react-loader-spinner';
import EmployeeService from '../services/EmployeeService';

const MyProfile = () => {
    const [employee, setEmployee] = useState({ id: '', phoneNumber: '', name: '', email: '', address: { city: '', streetName: '', houseNumber: '' }, role: '' })
    const [editMode, setEditMode] = useState(false)
    const [password, setPassword] = useState({ old: "", new: "", repeat: "", errors: [] })
    const [showLoader, setShowLoader] = useState({ details: false, password: false })
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [] })
    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            setEmployee(TokenService.getEmployee())
        }
    }, [])
    const handleEditClick = e => {
        e.preventDefault()
        setEditMode(!editMode)
    }
    const onChangeDetails = e => {
        let fieldName = e.target.name
        let fieldValue = e.target.value
        let newDetails = { ...employee }
        if (fieldName.includes("address")) {
            let addressFields = fieldName.split(".")
            newDetails[addressFields[0]][addressFields[1]] = fieldValue
        } else {
            newDetails[fieldName] = fieldValue
        }
        setEmployee({ ...newDetails })
    }
    const onChangePassword = e => {
        let fieldName = e.target.name
        let fieldValue = e.target.value
        let newPassowrdState = { ...password }
        newPassowrdState[fieldName] = fieldValue
        setPassword({ ...newPassowrdState })
    }
    const updateDetails = async e => {
        e.preventDefault();
        setShowLoader({ ...showLoader, details: true })
        await EmployeeService.updateEmployee(employee)
            .then(res => {
                TokenService.setEmployee(res.data)
                setPopupMessage({ title: 'Update Details', messages: ["Your details were updated successfully"] })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader({ ...showLoader, details: false })
    }
    const updatePassword = e => {
        e.preventDefault();
        setShowLoader({ ...showLoader, password: true })
        if (password.new !== password.repeat){
            setPopupMessage({ title: 'Error', messages: ["Password are not match!"] })
            setShowLoader({ ...showLoader, password: false })
            return
        }

        let changePasswordRequest = { userId: employee.id, oldPassword: password.old, newPassword: password.new }
        EmployeeService.updatePassowrd(changePasswordRequest)
            .then(res => {
                setPassword({ old: "", new: "", repeat: "", errors: [] })
                setPopupMessage({ title: 'Update Passord', messages: ["Your password was updated successfully"] })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
            setShowLoader({ ...showLoader, password: false })
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
                                        value={enumForReading(employee.role)}
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
                                        name="name"
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
                                        name="phoneNumber"
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
                                        name="email"
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
                                        name="address.city"
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
                                        name="address.streetName"
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
                                        name="address.houseNumber"
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
                                <div className="col col-12 text-center">
                                    <ColorRing
                                        className="text-center"
                                        visible={showLoader.details}
                                        ariaLabel="blocks-loading"
                                        colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                                    />
                                </div>
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
                                        name="old"
                                    />
                                </div>{" "}
                                <br />
                                <div className="col-md-12">
                                    <label className="labels">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        autoComplete="on"
                                        value={password.new}
                                        onChange={onChangePassword}
                                        name="new"

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
                                        name="repeat"
                                    />
                                </div>{" "}
                                <br />
                                <div className="col-md-12 text-center">
                                    <button
                                        className="btn btn-primary profile-button"
                                        type="button"
                                        onClick={updatePassword}
                                    >
                                        Change Password
                                    </button>
                                </div>
                                <div className="col col-12 text-center">
                                    <ColorRing
                                        className="text-center"
                                        visible={showLoader.password}
                                        ariaLabel="blocks-loading"
                                        colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                                    />
                                </div>
                            </form>

                        </div>
                        <div className="col-md-5 mt-5 text-left">
                        </div>
                    </div>
                </div>
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
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            'success'
                        }
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default MyProfile;