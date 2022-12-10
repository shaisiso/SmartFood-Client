import React, { useState, useEffect, useRef } from 'react';
import { ColorRing } from 'react-loader-spinner';
import TableService from '../services/TableService';
import {  extractHttpError } from '../utility/Utils';
import PopupMessage from './PopupMessage';

const OrderOfTable = () => {
    const [table, setTable] = useState({})
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(true)

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            getTable();
            mounted.current = true;
        }
    });
    const getTable = async () => {
        setShowLoader(true)
        var regEx = new RegExp('/employee/tables/', "ig");
        let tableId = window.location.pathname.replace(regEx, '')
        await TableService.getTableByTableId(tableId)
            .then(res => {
                setTable(res.data)
            })
            .catch(err => {
                var errMsg = extractHttpError(err)
                setPopupMessage({ title: 'Error', messages: [errMsg] })
            })
        setShowLoader(false)

    }
    return (
        <div className="container text-center">
            <h1 className="py-5 bold"><b><u>Table #{table.tableId}</u></b></h1>
            {
                !table.isBusy ?
                    <button className='btn btn-success'>Open Table</button>
                    :
                    <button className='btn btn-danger'>Close Table</button>
            }
            <div className="row text-center">
                <ColorRing
                    visible={showLoader}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
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

export default OrderOfTable;