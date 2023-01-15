import React, { useState } from 'react';
import { ReactComponent as ClockSvg } from "../assets/icons/clock.svg";
import { ReactComponent as LocationSvg } from "../assets/icons/location.svg";
import { ReactComponent as EmailSvg } from "../assets/icons/email.svg";
import { ReactComponent as CallSvg } from "../assets/icons/phone.svg";
import PopupMessage from '../components/PopupMessage';
import { cleanAll } from '../utility/Utils';

const height = 28
const width = 28
const Contact = () => {
    const [popupMessage, setPopupMessage] = useState({ title: '', messages: [''] })
    const onSubmitForm = e => {
        e.preventDefault();
        setPopupMessage({title:'Contact', messages:['Your message has been sent. Thank you!']})
    }
    return (
        <section id="contact" className="contact px-5" style={{ background: '#ffffffd0' }}>
            <div className="container">
                <div className="section-title">
                    <h2><span>Contact</span> Us</h2>
                </div>
            </div>
            <div className="container mt-5">

                <div className="info-wrap">
                    <div className="row">

                        <div className="col-lg-3 col-md-6 info mx-auto">
                            <h4>Location:  <LocationSvg height={height} width={width} /> </h4>
                            <p>A108 Hertzel Street<br />Kiryat Ata, IL 535022</p>
                        </div>

                        <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
                            <i className="bi bi-clock"></i>
                            <h4>Open Hours: <ClockSvg height={height} width={width} /> </h4>
                            <p>All week:<br />11:00  - 00:00 </p>
                        </div>

                        <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
                            <i className="bi bi-envelope"></i>
                            <h4>Email: <EmailSvg height={height} width={width} /> </h4>
                            <p>smartfoood2023@gmail.com<br />smartfoood2022@gmail.com</p>
                        </div>

                        <div className="col-lg-3 col-md-6 info mt-4 mt-lg-0">
                            <i className="bi bi-phone"></i>
                            <h4>Call: <CallSvg height={height} width={width} /> </h4>
                            <p>+1 5589 55488 51<br />+1 5589 22475 14</p>
                        </div>
                    </div>
                </div>

                <form className="php-email-form" onSubmit={onSubmitForm}>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                        </div>
                        <div className="col-md-6 form-group mt-3 mt-md-0">
                            <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
                    </div>
                    <div className="form-group mt-3">
                        <textarea className="form-control" name="message" rows="5" placeholder="Message" required></textarea>
                    </div>
                    <div className="text-center"><input type="submit" className="contact-btn" value="Send Message" /></div>
                </form>
            </div>
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
                            cleanAll()
                        }}
                        status={popupMessage.title === 'Error' ?
                            'error'
                            :
                            'success'
                        }
                        closeOnlyWithBtn
                    >
                    </PopupMessage>
                    :
                    null
            }
        </section>

    );
};

export default Contact;