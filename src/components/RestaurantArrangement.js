import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Fragment } from 'react';
import { FloatingLabel } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import TableService from '../services/TableService';
import { allCharsAreDigits, extractHttpError } from '../utility/Utils';
import EditableRowTable from './EditableRowTable';
import PopupMessage from './PopupMessage';
import ReadOnlyRow from './ReadOnlyRow';

const RestaurantArrangement = () => {
    const [tables, setTables] = useState([])
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)
    const [showNewTableForm, setShowNewTableForm] = useState(false)
    const [newTable, setNewTable] = useState({ numberOfSeats: "" });
    const [editTableId, setEditTableId] = useState(null);
    const [editFormData, setEditFormData] = useState({ tableId: "", numberOfSeats: "1", });
    const [tableToDelete, setTableToDelete] = useState(null)
    const navigate = useNavigate();
    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getData();
        }
    });
    const getData = async () => {
        setShowLoader(true)
        await TableService.getAllTables()
            .then(res => {
                setTables(res.data)
            }).catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const addTable = async event => {
        event.preventDefault()
        setShowLoader(true)
        TableService.addTable(newTable)
        .then(res=>{
            setPopupMessage({ title: 'New Table', messages: ['A new table was added to your restaurant.']})
            getData()
        })
        .catch(err=>{
            setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
        })
        setShowLoader(false)
    }
    const onChangeNewTable = e => {
        setNewTable({ numberOfSeats: e.target.value })
    }
    const handleEditClick = (event, table) => {
        setEditTableId(table.tableId);
        setEditFormData({ ...table });
    };

    const handleCancelClick = () => {
        setEditTableId(null);
    };
    const handleDeleteClick = async (e, table) => {
        e.preventDefault();
        setTableToDelete(table)
        setPopupMessage({
            title: 'Delete Request',
            messages: ['Attention! this action is not recomended to do after the restaurant started operating because it will delete any reletad order or resrevation'
                , 'Are you sure you want to delete this table ?']
        })

    };
    const deleteTable = async () => {
        setShowLoader(true)
        await TableService.deleteTable(tableToDelete)
            .then(res => getData())
            .catch(err => setPopupMessage({ title: 'Error', messages: extractHttpError(err) }))
        setShowLoader(false)
    }
    const handleEditFormChange = (event) => {
        const fieldValue = event.target.value;
        setEditFormData({ ...editFormData, numberOfSeats: fieldValue });
    };
    const updateTableClick = async event => {
        event.preventDefault()
        if (!allCharsAreDigits(editFormData.numberOfSeats)) {
            setPopupMessage({ title: 'Error', messages: ['Enter valid number of seats'] })
            return
        }
        let table = tables.find(t => t.tableId === editFormData.tableId)
        if (editFormData.numberOfSeats < table.numberOfSeats)
            setPopupMessage({
                title: 'Update Request',
                messages: ['You are trying to reduce the number of seats in a table. If you have future reservation it may affect them, and it is not recomended.'
                    , 'Are you sure you want do it ?']
            })
        else
            updateTable()
    }
    const updateTable = async () => {
        setShowLoader(true)
        await TableService.updateTable(editFormData)
            .then(res => {
                getData()
                setEditTableId(null);
            })
            .catch(err => {
                console.log(err)
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const handleGenerateClick = (e,table)=>{
        navigate(`/employee/management/qr/${table.tableId}`)
    }
    return (
        <div className="container mx-auto text-center">
            <div className="text-center ">
                <ColorRing
                    visible={showLoader}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
            </div>
            <div>
                <button className="btn btn-primary mx-auto mt-5" onClick={(e) => {
                    e.preventDefault();
                    setShowNewTableForm(!showNewTableForm)
                }}>New Table</button>
                {
                    showNewTableForm ?
                        <form onSubmit={addTable}>
                            <div className="col-md-6 mx-auto my-5">
                                <div className="col-md-6 mx-auto form-group">
                                    <FloatingLabel label="*Number of Seats">
                                        <input type="number" className="form-control" name="numberOfSeats" placeholder="*Number of Seats" required min={1}
                                            value={newTable.numberOfSeats} onChange={onChangeNewTable} />
                                    </FloatingLabel>
                                </div>
                                <input type="submit" className="btn btn-primary mx-auto " value="Add Table" visible={showNewTableForm ? 1 : 0} />
                            </div>
                        </form>
                        :
                        null
                }
                <div className="row mt-5 text-left">
                    <h5 style={{ backgroundColor: '#ffff00A0', }}><b>Be aware! you need to speify the tables before the restaurant start operate.
                        After that, it is not recomended to delete tables, or to reduce the number of seats in a table because it is affecting orders that are connected to that table. </b></h5>
                </div>
                <div className="row  p-2">
                    <div className="col col-lg-3 col-sm-6 text-center mx-auto">

                        <form >
                            <table className="table table-striped table-bordered" style={{ backgroundColor: 'white' }}>
                                <thead>
                                    <tr>
                                        <th style={{ cursor: 'pointer' }} > Table ID </th>
                                        <th style={{ cursor: 'pointer' }} > Number of Seats </th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tables.map((table, key) => (
                                        <Fragment key={key}>
                                            {editTableId === table.tableId ? (
                                                <EditableRowTable
                                                    editFormData={editFormData}
                                                    handleEditFormChange={handleEditFormChange}
                                                    handleCancelClick={handleCancelClick}
                                                    handleSaveClick={updateTableClick}
                                                />
                                            ) : (
                                                <ReadOnlyRow
                                                    item={{ tableId: table.tableId, numberOfSeats: table.numberOfSeats }}
                                                    withId
                                                    handleEditClick={handleEditClick}
                                                    handleDeleteClick={handleDeleteClick}
                                                    handleGenerateClick={handleGenerateClick}
                                                />
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </form>
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
                            popupMessage.title.toLowerCase().includes('new') ?
                                'success'
                                :
                                'info'
                        }
                        closeOnlyWithBtn
                        withOk={popupMessage.title.toLowerCase().includes('delete') || popupMessage.title.toLowerCase().includes('update')}
                        okBtnText="Yes"
                        cancelBtnText={popupMessage.title.toLowerCase().includes('delete') || popupMessage.title.toLowerCase().includes('update') ? "No" : null}
                        onClickOk=
                        {
                            popupMessage.title.toLowerCase().includes('delete') ?
                                e => {
                                    e.preventDefault()
                                    deleteTable()
                                    setPopupMessage({ title: '', messages: [''] })
                                }
                                :
                                e => {
                                    e.preventDefault()
                                    updateTable()
                                    setPopupMessage({ title: '', messages: [''] })
                                }
                    }

                        onClickCancel={e => {
                            e.preventDefault()
                            setTableToDelete(null)
                            setPopupMessage({ title: '', messages: [''] })
                        }}
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default RestaurantArrangement;