import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Confirmations from '../components/Confirmations';
import ExternalOrders from '../components/ExternalOrders';

const TasksPage = (props) => {
    const [tasks, setTasks] = useState({ exteranlOrders: [], shifts: [] });
    useEffect(() => {
      //  console.log('props.tasks',props.tasks)
        setTasks(props.tasks)
    }, [props.tasks, tasks]);

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
                        Confirmations {tasks.shifts.length > 0 ? <span className="notification">{tasks.shifts.length}</span> : null}
                    </div>
            } 
            tabClassName="text-black font-weight-bold">
            <Confirmations shifts={tasks.shifts} />
        </Tab>
        </Tabs >
    );
};

export default TasksPage;