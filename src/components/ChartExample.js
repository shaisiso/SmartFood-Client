import React from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import CanvasJSReact from '../lib/canvasjs.react';
import ReportService from '../services/ReportService';
import { formatDateForServer, getCurrentDate, extractHttpError, substractDate, formatDateWithSlash, enumForReading, formatDateWithSlashNoYear, formatDateWithDots } from '../utility/Utils';
import PopupMessage from './PopupMessage';
//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const chartTypes = ['column', 'bar', 'line', 'area', 'pie', 'doughnut', 'spline', 'splineArea']
const ChartExample = () => {
    const [dataColumns, setDataColumns] = useState([])
    const [startDate, setStartDate] = useState(substractDate(7))
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [datesForTitle, setDatesForTitle] = useState({ start: '', end: '' })
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [selectedType, setSelectedType] = useState(chartTypes[0])

    const onChangeStartDate = (e) => {
        setStartDate(e.target.value)
    }
    const onChangeEndDate = (e) => {
        setEndDate(e.target.value)
    }
    const onChangeType = e => {
        setSelectedType(e.target.value)
    }
    // const addSymbols = (e) => {
    //     var suffixes = ["", "K", "M", "B"];
    //     var order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);

    //     if (order > suffixes.length - 1)
    //         order = suffixes.length - 1;

    //     var suffix = suffixes[order];
    //     return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    // }
    const onClickGenerate = async e => {
        e.preventDefault()
        let startDateAPI = formatDateForServer(startDate)
        let endDateAPI = formatDateForServer(endDate)
        await ReportService.getIncomeDaily(startDateAPI, endDateAPI)
            .then(res => {
                let data = [...res.data]
                let columns = []
                data.forEach(c => {
                    columns.push({ "label": `${formatDateWithSlashNoYear(c.date)} - ${enumForReading(c.dayOfWeek)}`, "y": c.value },)
                })
                setDataColumns([...columns])
                setDatesForTitle({ start: startDate, end: endDate })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const getTotalAmount = () => dataColumns.map(c => c.y).reduce((sum, currentValue) => sum + currentValue, 0)


    const options = {
        animationDuration: 1000,
        animationEnabled: true,
        exportEnabled: true,
        exportFileName: `Orders Income ${formatDateWithDots(datesForTitle.start)} - ${formatDateWithDots(datesForTitle.end)}`,
        theme: "dark2", //"light1","light2", "dark1", "dark2"
        title: {
            text: `Orders Income : ${formatDateWithSlash(datesForTitle.start)} - ${formatDateWithSlash(datesForTitle.end)} - Total Amount: ${getTotalAmount()}₪`
        },
        axisX: {
            title: `Total Amount: ${getTotalAmount()}₪`,
        },
        axisY: {
            title: "Amount (NIS-₪)",
            //  labelFormatter: addSymbols,
            // scaleBreaks: {
            //     autoCalculate: true,
            //     type: "wavy",
            //     lineColor: "yellow"
            // }
        },
        data: [{
            type: selectedType, //change type to column bar, line, area, pie, etc
            indexLabel: selectedType !== 'pie' && selectedType!=='doughnut' ? "{y}" : "{label}: {y}",
            indexLabelFontColor: "white",
            dataPoints: [...dataColumns

                // { "label": "Akismet Anti-Spam", "y": 5000000 },
                // { "label": "Jetpack", "y": 4000000 },
                // { "label": "WP Super Cache", "y": 2000000 },
                // { "label": "bbPress", "y": 300000 },
                // { "label": "BuddyPress", "y": 200000 },
                // { "label": "Health Check", "y": 200000 }
            ]
        }]
    }

    return (
        <div className="App p-2">
            <h3 ><b><u>Choose Type</u>:</b> </h3>
            <div className="d-flex justify-content-center m-3 h5">
                <Form.Check
                    inline
                    label="Daily"
                    name="Daily"
                    type='radio'
                    id={`1`}
                    value={true}
                //   checked={newDiscount.forMembersOnly === true}
                //   onChange={onChangeNewDiscount}
                />
                <Form.Check
                    inline
                    label="Weekly"
                    name="Weekly"
                    type='radio'
                    id={`2`}
                    value={false}
                //  checked={newDiscount.forMembersOnly === false}
                //  onChange={e => setNewDiscount({ ...newDiscount, forMembersOnly: e.target.value === false })}
                />
                <Form.Check
                    inline
                    label="Monthly"
                    name="Monthly"
                    type='radio'
                    id={`3`}
                    value={false}
                //  checked={newDiscount.forMembersOnly === false}
                //  onChange={e => setNewDiscount({ ...newDiscount, forMembersOnly: e.target.value === false })}
                />
            </div>

            <table className="mx-auto mt-4 mb-5">
                <tbody>
                    <tr className="align middle text center">
                        <td className="col-md-3 form-group">
                            <FloatingLabel label="Choose Chart Type">
                                <Form.Select aria-label="Select Category" onChange={onChangeType} name="type" >
                                    {
                                        chartTypes.map((type, key) => (
                                            <option key={key} value={type} >{type}</option>
                                        ))
                                    }
                                </Form.Select>
                            </FloatingLabel>
                        </td>
                        <td className="col-md-3 form-group">
                            <FloatingLabel label="Start Date">
                                <input type="date" style={{ textAlign: "left" }} className="form-control"
                                    name="date" value={startDate} onChange={onChangeStartDate} required
                                />
                            </FloatingLabel>
                        </td>
                        <td className="col-md-3 form-group">
                            <FloatingLabel label="End Date">
                                <input type="date" style={{ textAlign: "left" }} className="form-control"
                                    name="date" value={endDate} onChange={onChangeEndDate} required min={startDate}
                                />
                            </FloatingLabel>
                        </td>

                        <td className="col-md-3 form-group">
                            <button className='btn btn-primary' onClick={onClickGenerate}>Generate Report</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            {
                dataColumns.length > 0 ?
                    <CanvasJSChart options={options}
                    /* onRef={ref => this.chart = ref} */
                    />
                    :
                    null
            }

            {
                popupMessage.title ?
                    <PopupMessage
                        title={popupMessage.title}
                        body={
                            <ul>
                                {
                                    popupMessage.messages.map((message, key) => (
                                        <li key={key} className="mt-2" style={{ fontSize: '1.2rem' }}>
                                            {message}
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                        onClose={() => {
                            setPopupMessage({ title: '', messages: [''] })

                        }}
                        status={popupMessage.title === 'Error' ? 'error' : 'success'}
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default ChartExample;