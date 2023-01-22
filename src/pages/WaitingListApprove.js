import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { ColorRing } from 'react-loader-spinner';
import WaitingListService from '../services/WaitingListService';
import { extractHttpError } from '../utility/Utils';

const WaitingListApprove = () => {
    const [reservation, setReservation] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const mounted = useRef()
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            validateToken()
        }
    })
    const validateToken = async () => {
        setShowLoader(true)
        var regEx = new RegExp('/waiting-list/', "ig");
        let token = window.location.pathname.replace(regEx, '')
        console.log(token)
        await WaitingListService.approveTokenForReservation(token)
            .then(res => {
                console.log(res.data)
                setReservation(res.data)
            }).catch(err => {
                console.log(err)
                if (err.response.status === 404)
                    setErrorMsg('This invitation was already approved')
                else
                    setErrorMsg(extractHttpError(err)[0])
            })
        setShowLoader(false)
    }
    return (
        <div className='App p-2' style={{ background: '#ffffffd0', minHeight: '27vh' }}>
            <ColorRing
                visible={showLoader}
                ariaLabel="blocks-loading"
                colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
            />
            {
                reservation ?
                    <div className='row'>
                        <h1 className="hRestaurant" style={{ color: "black" }}>Your Reservation is now Approved !!</h1>
                        <div className='col col-md-3 col-sm-6 mx-auto my-3'>
                            <ul className='text-left fw-bold'>
                                <li>Date: {reservation.date}</li>
                                <li>Hour: {reservation.hour}</li>
                                <li>Phone Number: {reservation.person.phoneNumber}</li>
                                <li>Name: {reservation.person.name}</li>
                            </ul>
                        </div>
                    </div>
                    :
                    errorMsg ?
                        <h2>{errorMsg} </h2>
                        : null
            }
        </div>
    );
};

export default WaitingListApprove;