import React from 'react';
import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { ColorRing } from 'react-loader-spinner';
import CanvasJSReact from '../lib/canvasjs.react';
import ReportService from '../services/ReportService';
import { extractHttpError, formatDateForServer, formatDateWithDots, formatDateWithSlash, getCurrentDate, substractDate, toCamelCase } from '../utility/Utils';
import PopupMessage from './PopupMessage';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const chartTypes = ['Pie', 'Doughnut', 'Column', 'Bar', 'Line', 'Area', 'Spline', 'Spline Area']
const CancelledReport = () => {
    const [dataColumns, setDataColumns] = useState([])
    const [startDate, setStartDate] = useState(substractDate(7))
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [title, setTitle] = useState({ startDate: '', endDate: '', report: '' })
    const [selectedType, setSelectedType] = useState(toCamelCase(chartTypes[0]))
    const [reportSubject, setReportSubject] = useState('Cancellations')
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
    const onChangeReportSubject = e => {
        setReportSubject(e.target.value)
    }
    const onClickGenerate = async e => {
        e.preventDefault()
        setShowLoader(true)
        let startDateAPI = formatDateForServer(startDate)
        let endDateAPI = formatDateForServer(endDate)
        if (reportSubject === 'Cancellations')
            await generateCancellationsReport(startDateAPI, endDateAPI)
        else // Ordered
            await generateOrderedReport(startDateAPI, endDateAPI)
        setShowLoader(false)
    }
    const generateOrderedReport = async (startDateAPI, endDateAPI) => {
        await ReportService.getOrderedItems(startDateAPI, endDateAPI)
            .then(res => {
                let data = { ...res.data }
                let columns = []
                Object.entries(data).forEach(entry => {
                    columns.push({ "label": `${entry[0]}`, "y": entry[1] },)
                })
                setDataColumns([...columns])
                setTitle({ startDate: startDate, endDate: endDate, report: 'Ordered' })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }
    const generateCancellationsReport = async (startDateAPI, endDateAPI) => {
        await ReportService.getCanceledItems(startDateAPI, endDateAPI)
            .then(res => {
                let data = { ...res.data }
                let columns = []
                Object.entries(data).forEach(entry => {
                    columns.push({ "label": `${entry[0]}`, "y": entry[1] },)
                })
                if (columns.length > 0) {
                    setDataColumns([...columns])
                    setTitle({ startDate: startDate, endDate: endDate, report: 'Cancelled' })
                } else
                    setPopupMessage({ title: 'Error', messages: ['There were no cancel requests at this requested period of time'] })
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
    }

    const getTotal = () => dataColumns.map(c => c.y).reduce((sum, currentValue) => sum + currentValue, 0)
    const options = {
        animationDuration: 1000,
        animationEnabled: true,
        exportEnabled: true,
        height: 600,
        exportFileName: `${title.report} Items ${formatDateWithDots(title.startDate)} - ${formatDateWithDots(title.endDate)}`,
        theme: "dark2", //"light1","light2", "dark1", "dark2"
        title: {
            text: `${title.report} Items : ${formatDateWithSlash(title.startDate)} - ${formatDateWithSlash(title.endDate)} - Total: ${getTotal()}`
        },
        axisX: {
            title: `Total ${title.report}: ${getTotal()}`,
        },
        axisY: {
            title: `${title.report}`,
        },
        data: [{
            type: selectedType, //change type to column bar, line, area, pie, etc
            indexLabel: selectedType !== 'pie' && selectedType !== 'doughnut' ? "{y}" : "{label}: {y}",
            indexLabelFontColor: "white",
            toolTipContent: "{label} - #percent %",
            dataPoints: [...dataColumns]
        }]
    }
    return (
        <div className="App">
            <h3 ><b><u>Report Type</u>:</b> </h3>
            <form onSubmit={onClickGenerate}>
                <div className="d-flex justify-content-center m-3 h5">
                    <Form.Check
                        inline
                        label="Cancelled Items"
                        name="Cancelled"
                        type='radio'
                        id={`1`}
                        value='Cancellations'
                        checked={reportSubject === 'Cancellations'}
                        onChange={onChangeReportSubject}
                    />
                    <Form.Check
                        inline
                        label="Ordered Items"
                        name="Ordered"
                        type='radio'
                        id={`2`}
                        value='Ordered'
                        checked={reportSubject === 'Ordered'}
                        onChange={onChangeReportSubject}
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
        </div >
    );
};

export default CancelledReport;