import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Confirmations from '../components/Confirmations';
import ExternalOrders from '../components/ExternalOrders';

const TasksPage = (props) => {
    const [tasks, setTasks] = useState({ exteranlOrders: [], shifts: [] });
    useEffect(() => {
        setTasks(props.tasks)
    }, [props.tasks, tasks]);

    return (
        <Tabs
            justify variant="tabs"
            id="controlled-tab-example"
            defaultActiveKey="1"
            className="mb-3 text-black"
        >
            <Tab eventKey="1" title={`External Orders ${tasks.exteranlOrders.length || ''}`} tabClassName="text-black font-weight-bold" >
                <ExternalOrders exteranlOrders={tasks.exteranlOrders}/>
            </Tab>
            <Tab eventKey="2" title={`Confirmations ${tasks.shifts.length|| ''} `} tabClassName="text-black font-weight-bold">
                <Confirmations shifts={tasks.shifts} /> 
            </Tab>
        </Tabs>
    );
};

export default TasksPage;