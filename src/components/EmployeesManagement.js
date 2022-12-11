import React, { Fragment } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import PopupMessage from './PopupMessage';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import EmployeeService from '../services/EmployeeService';
import { addressToString, enumForClass, enumForReading, extractHttpError, isChar } from '../utility/Utils';
import ReadOnlyRow from './ReadOnlyRow';
import EditableRowEmployee from './EditableRowEmployee';
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
        address: { city: '', streetName: '', houseNumber: '', entrance: '', apartmentNumber: '' },
        password: "",
        role: "",
    });
    const [editEmployeeId, setEditEmployeeId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        id: '',
        phoneNumber: '',
        name: "",
        email: "",
        address: {},
        password: "",
        role: "",
    });
    const getData = async () => {
        setLoaded(false)
        EmployeeService.getAllRoles()
            .then(res => {
                setRoles(res.data)
            }).catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        await EmployeeService.getAll()
            .then(res => {
                setEmployees(res.data)
            }).catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
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
        if (!isChar(newEmployee.address.entrance)){
            setPopupMessage({ title: 'Error', messages: ['Entrance should be one charcter'] })
            return
        }
        setLoaded(false)
        if (!newEmployee.role)
            newEmployee.role = roles[0]
        var employeeForAPI = { ...newEmployee, role: enumForClass(newEmployee.role) }

        await EmployeeService.addEmployee(employeeForAPI)
            .then(res => {
                setPopupMessage({ title: 'New employee was registered', messages: [`Employee ID: ${res.data.id}`, `Name: ${newEmployee.name}`, `Phone Number: ${newEmployee.phoneNumber}`, `Role: ${newEmployee.role}`, `Email: ${newEmployee.email}`, `Address: ${addressToString(newEmployee.address)}`] })
                setShowNewForm(false)
                getData();
            })
            .catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        setLoaded(true)
    }
    const onChangeNewEmployee = e => {
        let fieldName = e.target.getAttribute("name")
        let newEmployeeChange = { ...newEmployee }
        if (fieldName.includes("address")){
            let addressField = fieldName.split(":")
            newEmployeeChange[addressField[0]][addressField[1]] = e.target.value
        }else{
            newEmployeeChange[fieldName] = e.target.value
        }
        setNewEmployee({ ...newEmployeeChange })
    }

    const handleEditClick = (event, employee) => {
        event.preventDefault();
        setEditEmployeeId(employee.id);
        let employeeObj = employees.find(e => e.id === employee.id)
        const formValues = {
            ...employee,
            address: employeeObj.address
        };
        setEditFormData(formValues);
    };

    const handleCancelClick = () => {
        setEditEmployeeId(null);
    };

    const handleDeleteClick = async (employee) => {
        console.log(employee)
        await EmployeeService.deleteEmployee(employee)
            .then(response => {
                console.log(response)
                const newEmployeesList = [...employees];
                const index = employees.findIndex((e) => e.id === employee.id);
                newEmployeesList.splice(index, 1);
                setEmployees(newEmployeesList);
            })
            .catch(err => {
                console.log(err)
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
    };
    //
    const handleEditFormChange = (event) => {
        event.preventDefault();
        const fieldName = event.target.getAttribute("name");
        console.log(event.target)
        const fieldValue = event.target.value;
        const newFormData = { ...editFormData };
        if (fieldName === "address"){
            let addressField = event.target.getAttribute("id")
            newFormData[fieldName][addressField] = fieldValue
        }else{
            newFormData[fieldName] = fieldValue;
        }
        setEditFormData(newFormData);
    };
    
    const updateEmployeeClick = async event => {
        event.preventDefault();
        if (!isChar(editFormData.address.entrance)){
            setPopupMessage({ title: 'Error', messages: ['Entrance should be one charcter'] })
            return
        }
        setLoaded(false)
        let employeeObj = employees.find(e=>e.id===editEmployeeId)
        let employee = { ...editFormData, password: employeeObj.password, role: enumForClass(editFormData.role) }
        await EmployeeService.updateEmployee(employee)
            .then(response => {
                getData()
                setEditEmployeeId(null);
            })
            .catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        setLoaded(true)
    }
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
                                        <input type="text" className="form-control" name="address:city" required placeholder="*City"
                                            value={newEmployee.address.city} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*Street">
                                        <input type="text" className="form-control" name="address:streetName" required placeholder="*Street"
                                            value={newEmployee.address.streetName} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="*House Number">
                                        <input type="number" min={1} className="form-control" name="address:houseNumber" required placeholder="*House Number"
                                            value={newEmployee.address.houseNumber} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="Entrance">
                                        <input type="text" className="form-control" name="address:entrance" placeholder="Entrancer"
                                            value={newEmployee.address.entrance} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>
                                <div className="col-md-12 form-group mt-3 mt-md-0">
                                    <FloatingLabel label="Apartment Number">
                                        <input type="number" min={1} className="form-control" name="address:apartmentNumber" placeholder="Apartment Number"
                                            value={newEmployee.address.apartmentNumber} onChange={onChangeNewEmployee} />
                                    </FloatingLabel>
                                </div>

                                <input type="submit" className="btn btn-primary mx-auto " value="Add Employee" visible={showNewEmployeemForm ? 1 : 0} />
                            </div>
                        </form>
                        :
                        null
                }
                <div className="row mt-5">
                    <form >
                        <table className="table table-striped table-bordered" style={{ backgroundColor: 'white' }}>
                            <thead>
                                <tr>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Employee ID </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Name </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Phone Number </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Role </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Email </th>
                                    <th style={{ cursor: 'pointer' }} /*onClick={sortByName}*/> Address </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((e, key) => (
                                    <Fragment key={key}>
                                        {editEmployeeId === e.id ? (
                                            <EditableRowEmployee
                                                editFormData={editFormData}
                                                roles={roles}
                                                handleEditFormChange={handleEditFormChange}
                                                handleCancelClick={handleCancelClick}
                                                handleSaveClick={updateEmployeeClick}
                                            />
                                        ) : (
                                            <ReadOnlyRow
                                                item={{ id: e.id, name: e.name, phoneNumber: e.phoneNumber, role: enumForReading(e.role), email: e.email, address: addressToString(e.address) }}
                                                withId
                                                handleEditClick={handleEditClick}
                                                handleDeleteClick={handleDeleteClick}
                                            />
                                        )}
                                    </Fragment>
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
                            // setNewEmployee({
                            //     phoneNumber: '',
                            //     name: "",
                            //     email: "",
                            //     address: { city: '', streetName: '', houseNumber: '', entrance: '', apartmentNumber: '' },
                            //     password: "",
                            //     role: "",
                            // })
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            popupMessage.title.toLowerCase().includes('new employee') ?
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