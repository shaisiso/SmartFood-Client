import React, {  useEffect, useState } from 'react';

import ShitsConfirmation from './ShitsConfirmation';

const Confirmations = props => {
    const [shifts, setShifts] = useState([]);
    useEffect(() => {
        setShifts(props.shifts)
    }, [props.shifts, shifts]);

    return (
        <div>
            <ShitsConfirmation shifts= {shifts} />
        </div>
    );
};

export default Confirmations;