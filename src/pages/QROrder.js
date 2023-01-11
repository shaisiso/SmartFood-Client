import React, { useEffect, useRef, useState } from 'react';
import PopupMessage from '../components/PopupMessage';
import QRService from '../services/QRService';
import { extractHttpError } from '../utility/Utils';
import OrderOfTable from './OrderOfTable';

const QROrder = () => {
    const [table, setTable] = useState(null)
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getTable()
        }
    });
    const getTable = () => {
        var regEx = new RegExp('/qr-order/', "ig");
        let token = window.location.pathname.replace(regEx, '')
        QRService.verifyToken(`${token}`)
            .then(res => {
                console.log(res)
                setTable(res.data)
            })
            .catch(err => {
                console.log(err)
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }

    return (
        <div className="container">
            {/* <div className="App col col-6 mx-auto" style={{ backgroundColor: "#ffffff90" }}>
                {
                    table ?
                        <h3 ><b><u>Table {table.tableId} </u>:</b></h3>
                        : null
                }
            </div> */}
            <div className="col mx-auto" style={{ backgroundColor: "#ffffff90" }}>
                {/* <ItemsToOrder /> */}
                {
                    table ? <OrderOfTable tableId={table.tableId} isCustomer/> : null
                }

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
                        status={popupMessage.title === 'Error' ? 'error' : 'info'}
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default QROrder;