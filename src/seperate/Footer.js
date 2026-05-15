import React from 'react'
import { FaGithubAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import "../Assets/css/navbar.css"

function Footer() {
    return (
        <div className='App'>
            <div className='container-fluid p-0'>
                <div className='custom-footer'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className='row'>
                                    <div className='col-lg-8 '>
                                        <div className='inside-footer'>
                                            <ul className="list-group list-group-horizontal-sm list-group-vertical-lg">
                                                <li className="list-group-item">RewardHub.io</li>
                                                <li className="list-group-item">Terms of Use</li>
                                                <li className="list-group-item">Privacy Policy</li>
                                                <li className="list-group-item last-area">Help Center</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='col-lg-4'>
                                        <div className='inside-footer-right text-lg-end'>
                                            <FaXTwitter className='fotter-icon' />
                                            <FaGithubAlt className='fotter-icon' />
                                            <FaTelegram className='fotter-icon' />
                                            <FaFacebookF className='fotter-icon' />
                                            <FaInstagramSquare className='fotter-icon' />
                                            <FaYoutube className='fotter-icon' />
                                            <FaLinkedinIn className='fotter-icon' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer