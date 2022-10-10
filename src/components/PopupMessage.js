import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { ReactComponent as ErrorSvg } from "../assets/pop-error.svg";
import { ReactComponent as SuccessSvg } from "../assets/pop-success.svg";
import { ReactComponent as InfoSvg } from "../assets/pop-info.svg";

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
                <div className="modal-dialog modal-lg m-0 p-0">
                    <div className="modal-content  m-0 p-0">
                        <div className="modal-header">
                            <h5 className="modal-title text-black" id="exampleModalLabel">{props.title}</h5>
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
                                    <Link to={props.navigateTo} className="btn btn-primary">{props.okBtnText}</Link>
                                    :
                                    null
                            }
                            {
                                props.withClose ?
                                    <Link to={props.navigateTo} className="btn btn-primary">{props.closeBtnText}</Link>
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