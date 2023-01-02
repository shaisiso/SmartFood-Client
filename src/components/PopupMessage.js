import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Link } from "react-router-dom";
//import { useState } from 'react';
import { ReactComponent as ErrorSvg } from "../assets/icons/pop-error.svg";
import { ReactComponent as SuccessSvg } from "../assets/icons/pop-success.svg";
import { ReactComponent as InfoSvg } from "../assets/icons/pop-info.svg";

const PopupMessage = (props) => {
    // const [navigate, setNavigate] = useState(false);
    const getIcon = () => {
        if (!props.status) {
            return null
        }
        switch (props.status) {
            case 'success':
                return (
                    <div className="col-lg-1 mx-auto d-none d-lg-block  float-right ">
                        <SuccessSvg width="48" height="48" />
                    </div>
                )
            case 'error':
                return (
                    <div className="col-lg-1 mx-auto d-none d-lg-block  float-right ">
                        <ErrorSvg width="48" height="48" />
                    </div>
                )
            case 'info':
                return (
                    <div className="col-lg-1 mx-auto d-none d-lg-block  float-right ">
                        <InfoSvg width="48" height="48" />
                    </div>
                )
            default:
                return null;
        }
    }
    return (
        <Popup
            trigger={<div />}
            modal
            open={true}
            closeOnDocumentClick={!props.closeOnlyWithBtn}
            onClose={() => {
                if (props.onClose)
                    props.onClose()
            }}
        >

            {close => (
                <div className="p-0 m-0" id="exampleModal" tableindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl my-0 p-0 mx-0">
                        <div className="modal-content  m-0 p-0">
                            <div className="modal-header">
                                <h4 className="modal-title text-black" id="exampleModalLabel">{props.title}</h4>
                                <button className="btn-close" onClick={close} data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className="row align-items-center">
                                    <div className="col-lg-10 ">
                                        {props.body}
                                    </div>
                                    {
                                        getIcon()
                                    }

                                </div>
                            </div>
                            <div className="modal-footer">
                                {
                                    props.withOk ?
                                        props.onClicOk ?
                                            <button className="btn btn-primary" onClick={props.onClicOk}>{props.okBtnText}</button>
                                            :
                                            <Link to={props.navigateTo} className="btn btn-primary">{props.okBtnText}</Link>
                                        :
                                        null
                                }
                                {
                                    props.cancelBtnText ?
                                        props.onClickCancel ?
                                            <button className="btn btn-danger" onClick={props.onClickCancel}>{props.cancelBtnText}</button>
                                            :
                                            <Link to={props.navigateTo} className="btn btn-primary">{props.cancelBtnText}</Link>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </Popup>
    );
};

export default PopupMessage;
