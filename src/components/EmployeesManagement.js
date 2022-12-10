import React from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import PopupMessage from './PopupMessage';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import EmployeeService from '../services/EmployeeService';
import { addressToString, enumForClass, enumForReading, extractHttpError } from '../utility/Utils';
const EmployeesManagement = () => {
    const [employees, setEmployees] = useState([])
    const [roles, setRoles] = useState([])

    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [loaded, setLoaded] = useState(false)
    const [showNewEmployeemForm, setShowNewForm] = useState(false)
    const [newEmployee, setNewEmployee] = useState({
        phoneNumber: '',
        name: "",
        email: "",
        address: {city:'',streetName:'',houseNumber:'',entrance:'',apartmentNumber:''},
        password: "",
        role: "",
    });
    // const [editItemId, setEditItemId] = useState(null);
    // const [editFormData, setEditFormData] = useState({
    //     id: '',
    //     phoneNumber: '',
    //     name: "",
    //     email: "",
    //     address: {},
    //     password: "",
    //     role: "",
    // });
    const getData = async () => {
        setLoaded(false)
        EmployeeService.getAllRoles()
            .then(res => {
                setRoles(res.data)
            }).catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: [errMsg] })
            })
        await EmployeeService.getAll()
            .then(res => {
                setEmployees(res.data)
            }).catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: [errMsg] })
            })
        setLoaded(true)
    }
    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getData();
        }
    });

    const addEmployee = async event => {
        event.preventDefault()
        setLoaded(false)
        console.log(newEmployee)
        if (!newEmployee.role)
            newEmployee.role = roles[0]
        var employeeForAPI = { ...newEmployee, role: enumForClass(newEmployee.role) }

        await EmployeeService.addEmployee(employeeForAPI)
            .then(res => {
                console.log(res)
                setPopupMessage({ title: 'New employee was registered', messages: [`Employee ID: ${res.data.id}`, `Name: ${newEmployee.name}`, `Phone Number: ${newEmployee.phoneNumber}`, `Role: ${newEmployee.role}`, `Email: ${newEmployee.email}`, `Address: ${addressToString(newEmployee.address)}`] })
                setShowNewForm(false)
                getData();
            })
            .catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: [errMsg] })
            })
        setLoaded(true)
    }
    const onChangeNewEmployee = e => {
        let fieldName = e.target.getAttribute("name")
        let newEmployeeChange = { ...newEmployee }
        newEmployeeChange[fieldName] = e.target.value
        setNewEmployee({ ...newEmployeeChange })
    }
    const onChangeAddress = e => {
        let fieldName = e.target.getAttribute("name")
        let newAddress = { ...newEmployee.address }
        newAddress[fieldName] = e.target.value
        setNewEmployee({ ...newEmployee, address: { ...newAddress } })
    }
    const handleEditFormSubmit = (event) => {
        event.preventDefault();
    };
    // const handleEditClick = (event, item) => {
    //     event.preventDefault();
    // };

    // const handleCancelClick = () => {
    // };

    // const handleDeleteClick = async (item) => {

    // };
    // //
    // const handleEditFormChange = (event) => {
    //     event.preventDefault();


    // };
    // const updateEmployeeClick = async event => {
    //     event.preventDefault();
    //     setLoaded(false)

    //     setLoaded(true)
    // }
    return (
        <div className="container mx-auto text-center">
            <div className="text-center ">
                <ColorRing
                    visible={!loaded}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
            </div>
            <div>
                <button className="btn btn-primary mx-auto mt-5" onClick={(e) => {
                    e.preventDefault();
                    setShowNewForm(!showNewEmployeemForm)
                }}>New Employee</button>
                {
                    showNewEmployeemForm ?
                        <form onSubmit={addEmployee}>
                            <div className="col-md-6 mx-auto my-5">
                                <div className="col-md-12 form-group">
                                    <FloatingLabel label="*Name">
                                        <input type="text" className="form-control" name="name" placeholder="*Name" required
                                            value={newEmployee.name} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*Phone Number">
                                        <input type="text" className="form-control" name="phoneNumber" required placeholder="*Phone Number"
                                            value={newEmployee.phoneNumber} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*Password">
                                        <input type="password" autoComplete="on" className="form-control" name="password" required placeholder="*Password"
                                            value={newEmployee.password} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="Choose Role">
                                        <Form.Select aria-label="Select Role" onChange={onChangeNewEmployee} name="role" >
                                            {
                                                roles.map((role, key) => (
                                                    <option key={key} value={role} >{role}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*Email" >
                                        <input type="email" className="form-control" name="email" required placeholder="*Email"
                                            value={newEmployee.email} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*City">
                                        <input type="text" className="form-control" name="city" required placeholder="*City"
                                            value={newEmployee.address.city} onChange={onChangeAddress} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*Street">
                                        <input type="text" className="form-control" name="streetName" required placeholder="*Street"
                                            value={newEmployee.address.streetName} onChange={onChangeAddress} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*House Number">
                                        <input type="number" min={1} className="form-control" name="houseNumber" required placeholder="*House Number"
                                            value={newEmployee.address.houseNumber} onChange={onChangeAddress} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="Entrance">
                                        <input type="number" className="form-control" name="entrance" placeholder="Entrancer"
                                            value={newEmployee.address.entrance} onChange={onChangeAddress} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="Apartment Number">
                                        <input type="number" min={1} className="form-control" name="apartmentNumber" placeholder="Apartment Number"
                                            value={newEmployee.address.apartmentNumber} onChange={onChangeAddress} />
                                    </FloatingLabel>
                                </div>

                                <input type="submit" className="btn btn-primary mx-auto " value="Add item to menu" visible={showNewEmployeemForm ? 1 : 0} />
                            </div>
                        </form>
                        :
                        null
                }
                <div className="row mt-5">
                    <form onSubmit={handleEditFormSubmit}>
                        <table className="table table-striped table-bordered" style={{ backgroundColor: 'white' }}>
                            <thead>
                                <tr>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Employee ID </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Name </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Phone Number </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Role </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Email </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Address </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((e, key) => (
                                    <tr key={key}>
                                        <td>{e.id}</td>
                                        <td>{e.name}</td>
                                        <td>{e.phoneNumber}</td>
                                        <td>{enumForReading(e.role)}</td>
                                        <td>{e.email}</td>
                                        <td>{addressToString(e.address)}</td>
                                    </tr>
                                    // <Fragment key={key}>
                                    //     {editItemId === item.itemId ? (
                                    //         <EditableRow
                                    //             editFormData={editFormData}
                                    //             //     categories={categories}
                                    //             handleEditFormChange={handleEditFormChange}
                                    //             handleCancelClick={handleCancelClick}
                                    //             handleSaveClick={updateEmployeeClick}
                                    //         />
                                    //     ) : (
                                    //         <ReadOnlyRow
                                    //             item={item}
                                    //             handleEditClick={handleEditClick}
                                    //             handleDeleteClick={handleDeleteClick}
                                    //         />
                                    //     )}
                                    // </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </form>
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
                            setNewEmployee({
                                phoneNumber: '',
                                name: "",
                                email: "",
                                address: {city:'',streetName:'',houseNumber:'',entrance:'',apartmentNumber:''},
                                password: "",
                                role: "",
                            })
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            popupMessage.title.includes('New item') ?
                                'success'
                                :
                                'info'
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

export default EmployeesManagement;