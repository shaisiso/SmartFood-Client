import React from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import CanvasJSReact from '../lib/canvasjs.react';
import ReportService from '../services/ReportService';
import { enumForReading, extractHttpError, formatDateForServer, formatDateWithDots, formatDateWithSlash, formatDateWithSlashNoYear, getCurrentDate, substractDate, toCamelCase } from '../utility/Utils';
import PopupMessage from './PopupMessage';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const chartTypes = ['Stacked Column', 'Column', 'Stacked Area', 'Stacked Bar', 'Bar',]
const OrdersQuantityReport = () => {
    const [dataColumns, setDataColumns] = useState({ TA: [], Deliveries: [], Tables: [] })
    const [startDate, setStartDate] = useState(substractDate(7))
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [title, setTitle] = useState({ startDate: '', endDate: '' })
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
        await ReportService.getOrdersDailyReport(startDateAPI, endDateAPI)
            .then(res => {
                let data = { ...res.data }
                let columnsMap = { TA: [], Deliveries: [], Tables: [] }
                Object.entries(data).forEach(entry => {
                    let key = entry[0]
                    let dataPoints = entry[1]
                    let columns = dataPoints.map(d => {
                        return { "label": `${formatDateWithSlashNoYear(d.date)} - ${enumForReading(d.dayOfWeek)}`, "y": d.value } // { "x": `${d.date}`, "y": d.value }
                    })
                    columnsMap[key] = [...columns]
                })
                setDataColumns({ ...columnsMap })
                setTitle({ startDate: startDate, endDate: endDate })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const generateMonthlyReport= async (startDateAPI, endDateAPI) => {
        await ReportService.getOrdersMonthlyReport(startDateAPI, endDateAPI)
            .then(res => {
                let data = { ...res.data }
                let columnsMap = { TA: [], Deliveries: [], Tables: [] }
                Object.entries(data).forEach(entry => {
                    let key = entry[0]
                    let dataPoints = entry[1]
                    let columns = dataPoints.map(d => {
                        return { "label": `${d.month}`, "y": d.value } // { "x": `${d.date}`, "y": d.value }
                    })
                    columnsMap[key] = [...columns]
                })
                setDataColumns({ ...columnsMap })
                setTitle({ startDate: startDate, endDate: endDate })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const getTotal = () => dataColumns.TA.map(c => c.y).reduce((sum, currentValue) => sum + currentValue, 0)
        + dataColumns.Deliveries.map(c => c.y).reduce((sum, currentValue) => sum + currentValue, 0)
        + dataColumns.Tables.map(c => c.y).reduce((sum, currentValue) => sum + currentValue, 0)
        
    const options = {
        animationDuration: 1000,
        animationEnabled: true,
        exportEnabled: true,
        height: 600,
        exportFileName: `Orders ${formatDateWithDots(title.startDate)} - ${formatDateWithDots(title.endDate)}`,
        theme: "dark2", //"light1","light2", "dark1", "dark2"
        title: {
            text: `Orders : ${formatDateWithSlash(title.startDate)} - ${formatDateWithSlash(title.endDate)} - Total: ${getTotal()}`
        },
        axisX: {
            title: `Total Orders: ${getTotal()}`,
        },
        axisY: {
            title: `Quantity`,
        },
        data: [
            {
                type: selectedType, //change type to column bar, line, area, pie, etc
                indexLabel: "{y}",
                indexLabelFontColor: "white",
                toolTipContent: selectedType.includes('stacked')? "TA - #percent %" : "TA - {y}", 
                legendText: "TA",
                showInLegend: "true",
                dataPoints: [...dataColumns['TA']]
            },
            {
                type: selectedType, //change type to column bar, line, area, pie, etc
                indexLabel: "{y}" ,
                indexLabelFontColor: "white",
                toolTipContent: selectedType.includes('stacked')? "Deliveries - #percent %" : "Deliveries - {y}", 
                legendText: "Deliveries",
                showInLegend: "true",
                dataPoints: [...dataColumns['Deliveries']]
            },
            {
                type: selectedType, //change type to column bar, line, area, pie, etc
                indexLabel: "{y}" ,
                indexLabelFontColor: "white",
                toolTipContent: selectedType.includes('stacked')? "Tables - #percent %" : "Tables - {y}", 
                legendText: "Tables",
                showInLegend: "true",
                dataPoints: [...dataColumns['Tables']]
            },
        ]
    }
    return (
        <div className="App">
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
                <table className="mx-auto m-5">
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
                dataColumns.TA.length > 0 || dataColumns.Deliveries.length > 0 || dataColumns.Tables.length > 0 ?
                    <CanvasJSChart options={options} />
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
        </div >
    )
};

export default OrdersQuantityReport;