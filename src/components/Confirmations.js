import React, { useEffect, useState } from 'react';
import CancelItemsCofiramtions from './CancelItemsCofiramtions';

import ShitsConfirmation from './ShitsConfirmation';

const Confirmations = props => {
    const [shifts, setShifts] = useState([]);
    const [cancelRequests, setCancelRequests] = useState([]);
    const [propsShiftsPrev, setPropsShiftslPrev] = useState([]);
    const [propsCancelPrev, setPropsCancelPrev] = useState([]);

    useEffect(() => {
        if (props.shifts !== propsShiftsPrev) {
            setShifts([...props.shifts])
            setPropsShiftslPrev(props.shifts)
        }
        if (props.cancelRequests !== propsCancelPrev) {
            setCancelRequests([...props.cancelRequests])
            setPropsCancelPrev(props.cancelRequests)
        }
    }, [props.shifts, shifts, cancelRequests, props.cancelRequests, propsShiftsPrev, propsCancelPrev]);

    return (
        <div>
            <CancelItemsCofiramtions cancelRequests={cancelRequests} />
            <ShitsConfirmation shifts={shifts} />
        </div>
    );
};

export default Confirmations;