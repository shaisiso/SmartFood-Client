import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Confirmations from '../components/Confirmations';
import ExternalOrders from '../components/ExternalOrders';

const TasksPage = (props) => {
    const [tasks, setTasks] = useState({ exteranlOrders: [], shifts: [], cancelRequests:[] });
    useEffect(() => {
        setTasks(props.tasks)
    }, [props.tasks, tasks]);
    const totalConfirmationsNumber= ()=>tasks.shifts.length+tasks.cancelRequests.length
    return (
        <Tabs
            justify variant="tabs"
            id="controlled-tab-example"
            defaultActiveKey="1"
            className="mb-3 text-black"
        >
            <Tab eventKey="1"
                title=
                {
                    <div>
                        External Orders {tasks.exteranlOrders.length > 0 ? <span className="notification">{tasks.exteranlOrders.length}</span> : null}
                    </div>
                }
                tabClassName="text-black font-weight-bold" >
                <ExternalOrders exteranlOrders={tasks.exteranlOrders} />
            </Tab>
            <Tab eventKey="2" title=
                {
                    <div>
                        Confirmations {totalConfirmationsNumber() > 0 ? <span className="notification">{totalConfirmationsNumber()}</span> : null}
                    </div>
            } 
            tabClassName="text-black font-weight-bold">
            <Confirmations shifts={tasks.shifts} cancelRequests={tasks.cancelRequests}/>
        </Tab>
        </Tabs >
    );
};

export default TasksPage;