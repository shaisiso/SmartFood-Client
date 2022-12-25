import React from 'react';
import { Link } from 'react-router-dom';

const tableBusyImg = require('../assets/img/table-busy.png');
const tableFreeImg = require('../assets/img/table-free.png');
const tableReservedImg = require('../assets/img/table-free.png');

const RestaurantTable = (props) => {
    const getTableImg =()=> props.isReserved ? tableReservedImg : props.table.isBusy ? tableBusyImg : tableFreeImg
    return (
        <div className={props.className} style={{ height: '9.2rem', width: '10.7rem' }} >
            <Link to= {`/employee/tables/${props.table.tableId}`}>
                <article className='articletable'  >
                    <picture className='imagetable'>
                        <source media="(min-width: 0px)" srcSet={getTableImg()} />
                        <img className='img-fluid' src={getTableImg()} alt="background" />
                    </picture>
                    <h1 className='headertable'>{props.table.tableId} <div style={{fontSize:'0.9rem'}} >Size: {props.table.numberOfSeats}</div></h1>
                    
                </article>
            </Link>
        </div>
    );
};

export default RestaurantTable;