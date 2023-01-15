import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { ColorRing } from 'react-loader-spinner';
import PopupMessage from '../components/PopupMessage';
import TableReservationService from '../services/TableReservationService';
import TokenService from '../services/TokenService';
import { cleanAll, extractHttpError } from '../utility/Utils';
import Reservations from './Reservations';

const MyReservations = () => {
    const [userReservations, setUserReservations] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [] })

    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            getUserReservations()
        }
    })

    const getUserReservations = async () => {
        setShowLoader(true)
        if (!TokenService.getUser())
            return
        let phoneNumber = TokenService.getUser().phoneNumber
        await TableReservationService.getTableReservationsByCustomer(phoneNumber)
            .then(res => {
                setUserReservations(res.data)
            })
            .catch(err => setPopupMessage({ title: 'Error', messages: extractHttpError(err) }))
        setShowLoader(false)
    }
    const onChangeReservations = async () => {
        cleanAll()
    }
    return (
        <div style={{ background: '#ffffffc0' }}>
            <div className="text-center">
                <ColorRing
                    visible={showLoader}
                    ariaLabel="blocks-loading"
                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                />
            </div>
            {
                userReservations ? <Reservations userReservations={userReservations} onChangeReservations={onChangeReservations} /> : null
            }
            {
                userReservations && userReservations.length === 0 ? <h4 className="text-center pb-5">You don't have any reservations </h4> : null
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

export default MyReservations;