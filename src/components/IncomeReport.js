import React from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import CanvasJSReact from '../lib/canvasjs.react';
import ReportService from '../services/ReportService';
import { formatDateForServer, getCurrentDate, extractHttpError, substractDate, formatDateWithSlash, enumForReading, formatDateWithSlashNoYear, formatDateWithDots, toCamelCase } from '../utility/Utils';
import PopupMessage from './PopupMessage';
//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const chartTypes = ['Column', 'Bar', 'Line', 'Area', 'Pie', 'Doughnut', 'Spline', 'Spline Area']

const IncomeReport = () => {
    const [dataColumns, setDataColumns] = useState([])
    const [startDate, setStartDate] = useState(substractDate(7))
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [datesForTitle, setDatesForTitle] = useState({ start: '', end: '' })
    const [selectedType, setSelectedType] = useState(toCamelCase(chartTypes[0]))
    const [isDaily, setIsDaily] = useState(true)
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const [showLoader, setShowLoader] = useState(false)

    const onChangeStartDate = (e) => {
        setStartDate(e.target.value)
    }
    const onChangeEndDate = (e) => {
        setEndDate(e.target.value)
    }
    const onChangeType = e => {
        var value = toCamelCase(e.target.value)
        setSelectedType(value)
    }
    const onChangePeriod = e => {
        let fieldValue = e.target.value === 'true' ? true : e.target.value === 'false' ? false : e.target.value
        setIsDaily(fieldValue)
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
        setShowLoader(true)
        let startDateAPI = formatDateForServer(startDate)
        let endDateAPI = formatDateForServer(endDate)
        if (isDaily) {
            await generateDailyReport(startDateAPI, endDateAPI)
        }
        else {
            await generateMonthlyReport(startDateAPI, endDateAPI)
        }
        setShowLoader(false)
    }
    const generateDailyReport = async (startDateAPI, endDateAPI) => {
        await ReportService.getIncomeDaily(startDateAPI, endDateAPI)
            .then(res => {
                let data = [...res.data]
                let columns = []
                data.forEach(c => {
                    columns.push({ "label": `${formatDateWithSlashNoYear(c.date)} - ${enumForReading(c.dayOfWeek)}`, "y": c.value })
                })
                setDataColumns([...columns])
                setDatesForTitle({ start: startDate, end: endDate })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const generateMonthlyReport = async (startDateAPI, endDateAPI) => {
        await ReportService.getIncomeMonthly(startDateAPI, endDateAPI)
            .then(res => {
                let data = [...res.data]
                let columns = []
                data.forEach(c => {
                    columns.push({ "label": `${c.month}`, "y": c.value },)
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
        height:500,
        exportFileName: `Orders Income ${formatDateWithDots(datesForTitle.start)} - ${formatDateWithDots(datesForTitle.end)}`,
        theme: "dark2", //"light1","light2", "dark1", "dark2"
        title: {
            text: `Orders Income : ${formatDateWithSlash(datesForTitle.start)} - ${formatDateWithSlash(datesForTitle.end)} - Total Amount: ${getTotalAmount().toLocaleString()}₪`
        },
        axisX: {
            title: `Total Amount: ${getTotalAmount().toLocaleString()}₪`,
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
        data: [
            {
            type: selectedType, //change type to column bar, line, area, pie, etc
            indexLabel: selectedType !== 'pie' && selectedType !== 'doughnut' ? "{y}" : "{label}: {y}",
            indexLabelFontColor: "white",
            dataPoints: [...dataColumns

                // { "label": "Akismet Anti-Spam", "y": 5000000 },
                // { "label": "Jetpack", "y": 4000000 },
                // { "label": "WP Super Cache", "y": 2000000 },
                // { "label": "bbPress", "y": 300000 },
                // { "label": "BuddyPress", "y": 200000 },
                // { "label": "Health Check", "y": 200000 }
            ]
        }
    ]
    }

    return (
        <div className="App p-2">
            <h3 ><b><u>Choose Period</u>:</b> </h3>
            <form onSubmit={onClickGenerate}>
                <div className="d-flex justify-content-center m-3 h5">
                    <Form.Check
                        inline
                        label="Daily"
                        name="Daily"
                        type='radio'
                        id={`1`}
                        value={true}
                        checked={isDaily === true}
                        onChange={onChangePeriod}
                    />
                    <Form.Check
                        inline
                        label="Monthly"
                        name="Monthly"
                        type='radio'
                        id={`2`}
                        value={false}
                        checked={isDaily === false}
                        onChange={onChangePeriod}
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
                                <input type="submit" className='btn btn-primary' value='Generate Report' />
                                <ColorRing
                                    visible={showLoader}
                                    ariaLabel="blocks-loading"
                                    colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>


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

export default IncomeReport;