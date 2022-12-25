import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import TokenService from '../services/TokenService';
import EmployeeService from '../services/EmployeeService';

const MyProfile = () => {
    const [employee, setEmployee] = useState({})
    const mounted = useRef()
    useEffect(()=>{
        if (!mounted.current){
            mounted.current=true
            let phoneNumber = TokenService.getUser().phoneNumber
            EmployeeService.findEmployeeByPhone(phoneNumber)
                .then(res=>{
                    setEmployee(res.data)
                })
                .catch(err=>{
                    console.log(err)
                })
        }
        console.log(employee)

    }) 

    return (
        <div>
            My profile
        </div>
    );
};

export default MyProfile;