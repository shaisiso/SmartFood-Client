import React, { useState, useEffect, useRef } from 'react';
import RestaurantTable from '../components/RestaurantTable';
import PopupMessage from '../components/PopupMessage';
import { extractHttpError } from '../utility/Utils';
import { ColorRing } from 'react-loader-spinner';
import TableService from '../services/TableService';
import TableReservationService from '../services/TableReservationService';
const tableBusyImg = require('../assets/img/table-busy.png');
const tableFreeImg = require('../assets/img/table-free.png');
const tableReservedImg = require('../assets/img/table-reserved.png');

const INTERVAL_MS = 60000

const Tables = () => {
    const [tables, setTables] = useState([])
    const [currentReservations, setCurrentReservations] = useState([])
    const [errorMessage, setErrorMessage] = useState('');
    const [loaded, setLoaded] = useState(false)

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getData();
        }
        //This will run each minute to check reservations
        const reservationsInterval = setInterval(() => {
            getCurrentReservations()
            console.log('Get Current Reservations');
        }, INTERVAL_MS);
        return () => clearInterval(reservationsInterval);
    });
    const getData = () => {
        getAllTables()
        getCurrentReservations()
    }
    const getAllTables = async () => {
        setLoaded(false)
        await TableService.getAllTables()
            .then((res) => {
                setTables(res.data)
            })
            .catch(err => {
                var errMsg = extractHttpError(err)[0]
                setErrorMessage(errMsg)
            })
        setLoaded(true)
    }
    const getCurrentReservations = async () => {
        setLoaded(false)
        await TableReservationService.getCurrentReservations()
            .then(res => {
                setCurrentReservations(res.data)
            }).catch(err => {
                var errMsg = extractHttpError(err)[0]
                setErrorMessage(errMsg)
            })
        setLoaded(true)
    }
    const isTableReserved = (table) => {
        let answer = [...currentReservations].findIndex(r => r.table.tableId === table.tableId) !== -1
        return answer
    }
    return (
        <div className='container text-center'>

            <div className="row pt-3" >
                <div className="col col-4 "  >
                    <img className='img-fluid' src={tableFreeImg} alt="background" style={{ height: '3rem', width: '3rem' }} />
                    <h3>Free Table </h3>
                </div>
                <div className="col  col-4  "  >
                    <img className='img-fluid' src={tableBusyImg} alt="background" style={{ height: '3rem', width: '3rem' }} />
                    <h3>Busy Table </h3>
                </div>
                <div className="col  col-4 "  >
                    <img className='img-fluid' src={tableReservedImg} alt="background" style={{ height: '3rem', width: '3rem' }} />
                    <h3>Resrved Table </h3>
                </div>
            </div>
            <ColorRing
                visible={!loaded}
                ariaLabel="blocks-loading"
                colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
            />
            <div className="row py-5">
                {
                    tables.map((t, index) =>
                        <RestaurantTable className="m-3" table={t} key={index} isReserved={isTableReserved(t)} />
                    )
                }
            </div>

            {
                errorMessage ?
                    <PopupMessage
                        title="Error"
                        body={
                            <div className="text-black" style={{ fontSize: '1.2rem' }}>{errorMessage}</div>
                        }
                        onClose={() => {
                            setErrorMessage('')
                        }}
                        status='error'
                    >

                    </PopupMessage>
                    :
                    null
            }
        </div >
    );
};

export default Tables;