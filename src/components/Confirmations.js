import React, { useEffect, useState } from 'react';
import CancelItemsCofiramtions from './CancelItemsCofiramtions';

import ShitsConfirmation from './ShitsConfirmation';

const Confirmations = props => {
    const [shifts, setShifts] = useState([]);
    const [cancelRequests, setCancelRequests] = useState([]);
    useEffect(() => {
        setShifts(props.shifts)
        setCancelRequests(props.cancelRequests)
    }, [props.shifts, shifts, cancelRequests, props.cancelRequests]);

    return (
        <div>
            <CancelItemsCofiramtions cancelRequests={cancelRequests}/>
            <ShitsConfirmation shifts={shifts} />
        </div>
    );
};

export default Confirmations;