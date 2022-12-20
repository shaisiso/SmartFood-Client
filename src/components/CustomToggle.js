import React, { useState } from 'react';
import { useAccordionButton } from 'react-bootstrap';

function CustomToggle({ children, eventKey, name }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
        if (sign === '+') {
            setSign('-')
        }
        else {
            setSign('+')
        }
    });
    const [sign, setSign] = useState('+')
    return (
        <h5 onClick={decoratedOnClick} style={{ cursor: 'pointer' }}>
            <span className="mx-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: '50%' }}
                   
                >
                    {sign}
                </button>
            </span>
            <span className="mx-2"  >
                {name}
            </span>
        </h5>

    );
}

export default CustomToggle;