import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import QRCode from "qrcode.react";
import { ReactComponent as PdfSvg } from "../assets/icons/png-icon.svg";
import { ReactComponent as PngSvg } from "../assets/icons/pdf-icon.svg";
import { DOMAIN_URL, extractHttpError } from '../utility/Utils';
import { useState } from 'react';
import jsPDF from 'jspdf';
import QRService from '../services/QRService';
import { ColorRing } from 'react-loader-spinner';
import { FloatingLabel, Form } from 'react-bootstrap';
import PopupMessage from '../components/PopupMessage';
const iconSize = 80
const TableQRCode = () => {
    const [tableId, setTableId] = useState(0)
    const [tableToken, setTableToken] = useState('')
    const [daysForExpiration, setDaysForExpiration] = useState(1)
    const [showLoader, setShowLoader] = useState(false)
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })

    const mounted = useRef();
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getTable()
        }
    });
    const getTable = () => {
        var regEx = new RegExp('/employee/management/qr/', "ig");
        let id = window.location.pathname.replace(regEx, '')
        setTableId(id)
    }
    const generateQRToken = async (e) => {
        e.preventDefault();
        setShowLoader(true)
        await QRService.getTokenForTableQR(tableId, daysForExpiration)
            .then(res => {
                setTableToken(res.data)
            })
            .catch(err => {
                setPopupMessage({ title: 'Error', messages: extractHttpError(err) })
            })
        setShowLoader(false)
    }
    const onChangeDaysForExpiration = e => {
        setDaysForExpiration(e.target.value)
    }
    const downloadPNG = () => {
        const canvas = document.getElementById(`qrcode`);
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `Table ${tableId} QR Code.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    const downloadPDF = () => {
        // Defines the pdf
        let pdf = new jsPDF({
            //   orientation: 'landscape',
            unit: 'mm',
            //  format: [512, 512]
        })

        // Transforms the canvas into a base64 image
        let base64Image = document.getElementById('qrcode').toDataURL()

        // Adds the image to the pdf
        pdf.addImage(base64Image, 'png', 0, 30, 210, 210)

        // Downloads the pdf
        pdf.save(`Table ${tableId} QR Code.pdf`)

    }
    return (
        <div className="App container p-3 mx-auto">
            <div className="row text-center">
                <h3><b><u>Table {tableId}</u>:</b></h3>
            </div>
            <div className="row text-center">
                <Form onSubmit={generateQRToken}>
                    <table className="mx-auto my-4">
                        <tbody>
                            <tr className="align middle text center">
                                <td className="col-md-6 form-group">
                                    <FloatingLabel label="Days for QR Expiration">
                                        <input type="number" className="form-control" min={1} max={356} name="percent" required placeholder="Days for QR Expiration"
                                            value={daysForExpiration} onChange={onChangeDaysForExpiration} />
                                    </FloatingLabel>

                                </td>
                                <td className="col-md-4 form-group">
                                    <input type="submit" className="btn btn-primary  mt-2" value="Generate QR" />
                                </td>
                                <td className="col-md-2 form-group">
                                    <ColorRing
                                        visible={showLoader}
                                        ariaLabel="blocks-loading"
                                        colors={['#0275d8', '#0275d8', '#0275d8', '#0275d8', '#0275d8']}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
            </div>
            {
                tableToken ?
                    <div className="row">
                        <div className="row">
                            <div className="col col-12 mx-auto text-center">
                                <QRCode
                                    id={`qrcode`}
                                    value={`${DOMAIN_URL}/qr-order/${tableToken}`}
                                    size={512}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-sm-2 col-md-4" />
                            <div className="col col-sm-4 col-md-2 mx-auto text-center my-5">
                                <button className="btn btn-primary" style={{ borderRadius: '100%' }} onClick={downloadPDF}>
                                    <PdfSvg /*onClick={downloadPDF}*/ width={iconSize} height={iconSize} style={{ cursor: 'pointer' }} />
                                </button>
                            </div>
                            <div className="col col-sm-4 col-md-2 mx-auto text-center my-5" >
                                <button className="btn btn-danger" style={{ borderRadius: '100%' }} onClick={downloadPNG}>
                                    <PngSvg /*onClick={downloadPNG}*/ width={iconSize} height={iconSize} style={{ cursor: 'pointer' }} />
                                </button>
                                {/* <button className="btn btn-primary" onClick={downloadPNG}> Download QR as PNG </button>
                                &nbsp;
                                <button className="btn btn-primary" onClick={downloadPDF}> Download QR as PDF </button> */}
                            </div>
                            <div className="col col-sm-2 col-md-4" />

                        </div>
                    </div>
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
                        status={popupMessage.title === 'Error' ? 'error' : 'info'}
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </div>
    );
};

export default TableQRCode;