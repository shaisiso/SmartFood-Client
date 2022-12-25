import React, { useState } from 'react';
import { useAccordionButton } from 'react-bootstrap';

function CustomToggle({ children, eventKey, name, onClickToggle }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
        if (sign === '+') {
            setSign('-')
        }
        else {
            setSign('+')
        }
        if (onClickToggle)
            onClickToggle()
    });
    const [sign, setSign] = useState('+')
    return (
        <h5  onClick={decoratedOnClick} style={{ cursor: 'pointer' }}>
            <span className="mx-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: '50%' }}

                >
                    {sign}
                </button>
                <span className="mx-3"  >
                    {name}
                </span>
            </span>

            <span className="my-auto float-right">
                {children}
            </span>
        </h5>

    );
}

export default CustomToggle;