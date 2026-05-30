import React, { useState, useEffect, } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { helper } from '../../service/helper';
import AYILogo from "../Assets/images/Ayi_logo.png";
import { ToastContainer, toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";

import { makeApiRequest } from "../axiosService/ApiCall";
import { decryptData, encryptData } from '../Auth/SecurityCrypto';

export default function OtpPage({
    title = 'Verify OTP'
}) {

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [timer, setTimer] = useState(0);
    const [registerData, setRegisterData] = useState({});
    const isLoginOtp = title === 'Login Verification';
    const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("AdminCredentials");
    const email = localStorage.getItem("email");

    setRegisterData({
        token,
        email,
    });

    if (token) {
        try {
            const decoded = jwtDecode(token);


            // If already verified, redirect
            if (!decoded?.status) {
                navigate("/dashboard/user-list");
            }
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("AdminCredentials");
        }
    }
}, [navigate]);

/* =========================================
   INITIALIZE TIMER FROM TOKEN
========================================= */

useEffect(() => {
    try {
        if (!registerData?.token) return;

        const decoded = jwtDecode(registerData.token);

        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decoded.exp - currentTime;

        if (timeLeft > 0) {
            setTimer(timeLeft);
            setOtpExpired(false);
        } else {
            setTimer(0);
            setOtpExpired(true);
        }
    } catch (error) {
        console.error(error);
        setTimer(0);
        setOtpExpired(true);
    }
}, [registerData?.token]);

/* =========================================
   TIMER COUNTDOWN
========================================= */

useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
        setTimer((prev) => {
            if (prev <= 1) {
                clearInterval(interval);
                setOtpExpired(true);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(interval);
}, [timer > 0]);

/* =========================================
   FORMAT TIMER
========================================= */

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
    )}`;
};

/* =========================================
   VERIFY OTP
========================================= */

const handleVerifyOtp = async () => {
    try {
        if (!otp.trim()) {
            toast.error("Enter OTP");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            toast.error("Enter valid 6 digit OTP");
            return;
        }

        setLoading(true);

        const payload = encryptData({
            LoginToken: registerData?.token,
            verifyOTP: otp,
        });

        const params = {
            url: "admin-verifyLoginOTP",
            method: "POST",
            data: {
                data: payload,
            },
        };

        const response = await makeApiRequest(params);

        const responseData = decryptData(response.data);


        if (responseData?.status) {
            toast.success(
                responseData?.message || "OTP verified successfully"
            );

            localStorage.setItem(
                "AdminCredentials",
                responseData.token
            );

            if (responseData?.email) {
                localStorage.setItem("email", responseData.email);
            }

            setRegisterData({
                token: responseData.token,
                email:
                    responseData.email || registerData?.email,
            });

            setOtpExpired(false);

                navigate("/dashboard/user-list");
        } else {
            toast.error(responseData?.message);

            if (
                responseData?.message
                    ?.toLowerCase()
                    ?.includes("expired")
            ) {
                setOtpExpired(true);
                setTimer(0);
            }
        }
    } catch (error) {
        console.error(error);

        toast.error(
            error?.response?.data?.message ||
                "OTP verification failed"
        );
    } finally {
        setLoading(false);
    }
};

/* =========================================
   RESEND OTP
========================================= */

const handleResendOtp = async () => {
    try {
        setResendLoading(true);

        const payload = encryptData({
            email: registerData?.email,
        });

        const params = {
            url: "admin-resendMailOTP",
            method: "POST",
            data: {
                data: payload,
            },
        };

        const response = await makeApiRequest(params);

        const responseData = decryptData(response.data);


        if (responseData?.status) {
            const newToken = responseData?.token;

            localStorage.setItem(
                "AdminCredentials",
                newToken
            );

            setRegisterData({
                email: registerData?.email,
                token: newToken,
            });

            setOtp("");
            setOtpExpired(false);

            try {
                const decoded = jwtDecode(newToken);

                const currentTime = Math.floor(
                    Date.now() / 1000
                );

                const timeLeft =
                    decoded.exp - currentTime;

                setTimer(timeLeft > 0 ? timeLeft : 0);
            } catch (err) {
                console.error(err);

                setTimer(0);
                setOtpExpired(true);
            }

            toast.success(
                responseData?.message ||
                    "OTP resent successfully"
            );
        } else {
            toast.error(responseData?.message);
        }
    } catch (error) {
        console.error(error);

        toast.error(
            error?.response?.data?.message ||
                "Failed to resend OTP"
        );
    } finally {
        setResendLoading(false);
    }
};

    return (
        <div className="container mx-auto">
            <ToastContainer />
            <div className="custom-login pt-0">
                <div className="container">
                    <div className="row min-vh-100 align-items-center justify-content-center">
                        <div className="col-lg-5">
                            <div className="custom-inside-log-in">
                                <Link
                                    className="navbar-brand custom-right-nav-name-2"
                                    to="/"
                                >
                                    <img src={AYILogo} alt="Logo" />
                                </Link>
                                <h6 className="fw-bold">
                                    {title}
                                </h6>
                                <div className="mb-1 mt-4 custom-form">
                                    <label className="form-label">
                                        Enter the OTP sent to your email address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ''
                                                    );
                                                setOtp(value);
                                            }}
                                            placeholder="Enter 6 digit OTP"
                                            maxLength={6}
                                            className="form-control input-form py-2"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-6">
                                    <div>

                                        {
                                            timer > 0 ? (
                                                <span className="text-muted fs-6">
                                                    OTP expires in{" "}
                                                    <span className="text-dark">
                                                        {formatTime(timer)}
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="text-danger fs-6">
                                                    OTP Expired
                                                </span>
                                            )
                                        }
                                    </div>
                                    {
                                        otpExpired && (
                                            <button
                                                onClick={handleResendOtp}
                                                disabled={resendLoading}
                                                className="border-0 bg-transparent text-decoration-underline"
                                            >
                                                {
                                                    resendLoading
                                                        ? 'Resending...'
                                                        : 'Resend OTP'
                                                }
                                            </button>
                                        )
                                    }
                                </div>

                                <div className='d-flex flex-column mt-4 gap-3'>
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={loading || otpExpired}
                                        className="w-100 custom-main-button"
                                    >
                                        {
                                            loading ? 'Verifying...' : 'Verify OTP'
                                        }
                                        <ArrowRight size={16} className='ms-1' />
                                    </button>
                                    {/* <button
                                        onClick={() => { navigate("/") }}
                                        className="w-full border-0 rounded"
                                        style={{padding:"10px 0px"}}
                                    >
                                        Back
                                    </button> */}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}