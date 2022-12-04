import React, { useState, useEffect, useRef } from 'react';
import RestaurantTable from '../components/RestaurantTable';
import PopupMessage from '../components/PopupMessage';
import {  extractHttpError } from '../utility/Utils';
import { ColorRing } from 'react-loader-spinner';
import TableService from '../services/TableService';

const Tables = () => {
    const [tables, setTables] = useState([])
    const [errorMessage, setErrorMessage] = useState('');
    const [loaded, setLoaded] = useState(false)

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getData();
        }
    });
    const getData = async () => {
        setLoaded(false)
       await TableService.getAllTables()
            .then((res) => {
                setTables(res.data)
            })
            .catch(err => {
                var errMsg = extractHttpError(err)
                setErrorMessage(errMsg)
            })
            setLoaded(true)
    }
    return (
        <div className='container text-center p-5'>
            <ColorRing
                visible={!loaded}
                ariaLabel="blocks-loading"
                colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
            />
            <div className="row">
                {
                    tables.map((t, index) =>
                        <RestaurantTable className="m-3" table={t} key={index} />
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