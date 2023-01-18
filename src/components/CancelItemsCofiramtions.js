import React, { useState } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { ColorRing } from 'react-loader-spinner';
import OrderService from '../services/OrderService';
import { extractHttpError } from '../utility/Utils';
import PopupMessage from './PopupMessage';
import ReadOnlyRow from './ReadOnlyRow';

const CancelItemsCofiramtions = props => {
    const [cancelRequests, setCancelRequests] = useState([]);
    const [propsCancelPrev, setPropsCancelPrev] = useState([]);
    const [orderOfTables, setOrderOfTables] = useState([])
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)


    useEffect(() => {
        const buildCOrderOfTables = async () => {
            let o = [];
            for (let i = 0; i < props.cancelRequests.length; i++) {
                await OrderService.getOrderById(props.cancelRequests[i].orderOfTable)
                    .then(res => {
                        o.push(res.data)
                    }).catch(err => {
                        setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
                    })
            }
            setOrderOfTables([...o])
        }
        if (props.cancelRequests !== propsCancelPrev) {
            setCancelRequests([...props.cancelRequests])
            setPropsCancelPrev(props.cancelRequests)
            buildCOrderOfTables()
        }
    }, [props.cancelRequests, cancelRequests, propsCancelPrev]);

    const handleRequestForCancelItem = async (e, cr, isApproved) => {
        e.preventDefault();
        setShowLoader(true)
        let cancelRequest = { ...cancelRequests.find(c => c.id === cr.id), isApproved: isApproved }
        delete cancelRequest.orderOfTable
        delete cancelRequest.itemInOrder
        await OrderService.handleRequestForCancelItem(cancelRequest)
            .then(() => {
                let updatedRequests = [...cancelRequests].filter(c => c.id !== cancelRequest.id)
                setCancelRequests([...updatedRequests])
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })

            })
        setShowLoader(false)
    }


    const getTableNumber = key => {
        return orderOfTables.length > 0 && orderOfTables.length > key ? orderOfTables[key].table.tableId : ''
    }
    return (
        <div className="row text-center m-1">
            <h3><b><u>Requests for cancel dishes:</u></b></h3>
            <table className="table table-striped table-bordered text-center" style={{ backgroundColor: 'white' }}>
                <thead>
                    <tr>
                        <th /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> Time </th>
                        <th /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> Table Number </th>
                        <th /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> Item to Cancel </th>
                        <th /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> Reason </th>
                        <th /*style={{ cursor: 'pointer' }}onClick={sortByName}*/> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {cancelRequests.map((cr, key) => (
                        <Fragment key={key}>
                            <ReadOnlyRow
                                item={{
                                    time: cr.date,
                                    tableId: getTableNumber(key),
                                    menuItem: cr.menuItem.name,
                                    reason: cr.reason,
                                    actions:
                                        <div>
                                            <button className="btn btn-success" onClick={e => handleRequestForCancelItem(e, cr, true)}>Approve</button>
                                            <button className="btn btn-danger" onClick={e => handleRequestForCancelItem(e, cr, false)}>Decline</button>
                                        </div>
                                }}
                                withId
                            //  rowColor={s.isApproved ? approvedColor : notApprovedColor}
                            />
                        </Fragment>
                    ))}
                </tbody>
            </table>
            <div className="text-center">
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

export default CancelItemsCofiramtions;