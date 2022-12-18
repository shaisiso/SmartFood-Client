import React, {  useEffect, useState } from 'react';

import ShitsConfirmation from './ShitsConfirmation';

const Confirmations = props => {
    const [shifts, setShifts] = useState([]);
    useEffect(() => {
        setShifts(props.shifts)
    }, [props.shifts, shifts]);
    const onUpatedShifts = (newShifts)=>{
        setShifts([...newShifts])
        props.onUpatedShifts([...newShifts])
    }
    return (
        <div>
            <ShitsConfirmation shifts= {shifts} onUpatedShifts={onUpatedShifts}/>
        </div>
    );
};

export default Confirmations;