import React, { useState, useEffect, useRef } from 'react';
import { ColorRing } from 'react-loader-spinner';
import TableService from '../services/TableService';
import { extractHttpError } from '../utility/Utils';
import PopupMessage from './PopupMessage';
import ItemsToOrder from './ItemsToOrder'
//import { Row } from 'react-bootstrap';
const OrderOfTable = () => {
    const [table, setTable] = useState({})
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(true)
    const [order, setOrder] = useState({ table: {}, numberOfDiners: 1 })
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
                setPopupMessage({ title: 'Error', messages: errMsg })
            })
        setShowLoader(false)

    }
    const onClickOpenTable = async (e, setToBusy) => {
        e.preventDefault();
        setShowLoader(true)
        await TableService.changeTableBusy(table.tableId, setToBusy)
            .then(res => {
                setTable(res.data)
                setOrder({ ...order, table: res.data })
            }).catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })

            })
        setShowLoader(false)
    }
    return (
        <div className="container">
            <div className=" text-center">
                <h1 className="py-5 bold"><b><u>Table #{table.tableId}</u></b></h1>
                {
                    !table.isBusy ?
                        <button className='btn btn-success mb-3' onClick={(e) => onClickOpenTable(e, true)}>Open Table</button>
                        :
                        <button className='btn btn-danger mb-3' onClick={(e) => onClickOpenTable(e, false)}>Close Table</button>
                }
                <div className="row text-center">
                    <ColorRing
                        visible={showLoader}
                        ariaLabel="blocks-loading"
                        colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                    />
                </div>
            </div>

            {
                table.isBusy ? <ItemsToOrder /> : null
            }
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