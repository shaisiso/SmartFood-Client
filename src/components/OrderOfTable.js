import Axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { ColorRing } from 'react-loader-spinner';
import { API_URL,extractHttpError } from '../utility/Utils';
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

        await Axios.get((`${API_URL}/api/table/${tableId}`))
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
        <div>
            {JSON.stringify(table)}
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