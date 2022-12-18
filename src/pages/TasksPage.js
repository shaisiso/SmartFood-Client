import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Confirmations from '../components/Confirmations';

const TasksPage = (props) => {
    const [tasks, setTasks] = useState({exteranlOrders:[] , shifts: []});
    useEffect(() => {
        setTasks(props.tasks)
    },[props.tasks, tasks]);
    const onUpatedShifts =(newshifts)=>{

        setTasks({...tasks, shifts:[...newshifts]})
        props.onUpatedShifts(newshifts)
    }
    return (
        <Tabs
            justify variant="tabs"
            id="controlled-tab-example"
            defaultActiveKey="1"
            className="mb-3 text-black"
        >
            <Tab eventKey="1" title={`External Orders ${tasks.exteranlOrders.length || ''}`} tabClassName="text-black font-weight-bold" >
                <div></div>
            </Tab>
            <Tab eventKey="2" title={`Confirmations ${tasks.shifts.length|| ''} `} tabClassName="text-black font-weight-bold">
                <Confirmations shifts={tasks.shifts} onUpatedShifts= {onUpatedShifts}/> 
            </Tab>
        </Tabs>
    );
};

export default TasksPage;