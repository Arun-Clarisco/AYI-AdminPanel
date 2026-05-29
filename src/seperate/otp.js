import React, { useState, useEffect, } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { helper } from '../../service/helper';
import LogoWhite from '../Assets/images/LogoWhite.png';
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

    /* =========================================
       START TIMER FROM JWT TOKEN
    ========================================= */
    useEffect(() => {
        const token = localStorage.getItem('AdminCredentials');
        const email = localStorage.getItem('email');
        setRegisterData({ token: token, email: email })
    }, []);

    useEffect(() => {
        try {


            if (!registerData?.token) return;
            // console.log('registerData.token :>> ', registerData?.token);
            const decoded = jwtDecode(registerData?.token);
            // console.log('decoded :>> ', decoded);
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
            setTimer(0);
            setOtpExpired(true);
        }
    }, [registerData?.token]);

    /* =========================================
       TIMER COUNTDOWN
    ========================================= */

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setOtpExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (countdown) {
                clearInterval(countdown);
            }
        };
    }, [timer]);

    /* =========================================
       FORMAT TIMER
    ========================================= */

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    /* =========================================
       VERIFY OTP
    ========================================= */

    const handleVerifyOtp = async () => {

        try {
            if (!otp.trim()) {
                toast.error('Enter OTP');
                return;
            }
            if (!/^\d{6}$/.test(otp)) {
                toast.error('Enter valid 6 digit OTP');
                return;
            }
            setLoading(true);
            const token = localStorage.getItem('AdminCredentials')
            setRegisterData({ token: token })
            const data = encryptData({
                LoginToken: token || registerData?.token,
                verifyOTP: otp,
            });

            const params = {
                url: "admin-verifyLoginOTP",
                method: "POST",
                data: { data },
            };
            const response = await makeApiRequest(params);

            const responseData = decryptData(response.data);
            if (responseData.status) {

                toast.success(responseData?.message || 'OTP verified successfully');
                setOtpExpired(false);
                localStorage.setItem("AdminCredentials", responseData.token);
                setTimeout(() => {
                    navigate("/dashboard/user-list");
                }, 3000);

            } else {
                toast.error(responseData.message);
                if (
                    response.message?.toLowerCase().includes('expired')
                ) {
                    setOtpExpired(true);
                    setTimer(0);
                }
            }

        } catch (error) {
            console.log(error);
            toast.error('OTP verification failed');
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
            const token = localStorage.getItem('AdminCredentials')
            const data = encryptData({
                LoginToken: token
            })
            const params = {
                url: "admin-resendMailOTP",
                method: "POST",
                data: { data },
            };
            const response = await makeApiRequest(params);


            if (response.success) {
                const responseData = response.data;

                const newToken = responseData?.token;

                setRegisterData?.(
                    (prev) => ({
                        ...prev,
                        token: newToken,
                    })
                );
                setOtp('');
                setOtpExpired(false);

                /* =========================
                   RESTART TIMER
                ========================= */

                try {

                    const decoded = jwtDecode(newToken);

                    const currentTime = Math.floor(Date.now() / 1000);

                    const timeLeft = decoded.exp - currentTime;
                    setTimer(timeLeft > 0 ? timeLeft : 0);

                } catch (err) {
                    setTimer(0);
                    setOtpExpired(true);
                }
                toast.success(responseData?.message || 'OTP resent successfully');

            } else {
                toast.error(response.error);
            }

        } catch (error) {
            console.log(error);
            toast.error('Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="container mx-auto">
            <ToastContainer />
            <img src={LogoWhite} alt="AYI Flashloan" className='w-16 h-full mx-auto mb-4' />
            <div className="bg-[#0F258F] border border-[#1E3FCC] rounded-xl md:p-8 p-4 w-full md:max-w-xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-center">
                        {title}
                    </h2>
                    <p className="text-sm text-slate-300 text-center">
                        Enter the OTP sent to your email address
                    </p>
                </div>
                {/* OTP INPUT */}
                <div className="mb-4">
                    <label className="text-xs mb-2 block">
                        OTP Code
                    </label>
                    <div className="relative">
                        <ShieldCheck
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
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
                            className="w-full bg-[#3d57d82f] placeholder:text-slate-400 border border-[#1E3FCC] rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                        />
                    </div>
                </div>
                {/* TIMER + RESEND */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        {
                            timer > 0 ? (
                                <span className="text-slate-300 text-sm">
                                    OTP expires in{" "}
                                    <span className="text-[#42fff5]">
                                        {formatTime(timer)}
                                    </span>
                                </span>
                            ) : (
                                <span className="text-red-400 text-sm">
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
                                className="text-sm text-[#42fff5] hover:text-white disabled:opacity-50"
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

                {/* VERIFY BUTTON */}

                <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otpExpired}
                    className="w-full bg-[#42fff5] text-black rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {
                        loading ? 'Verifying...' : 'Verify OTP'
                    }
                    <ArrowRight size={16} />
                </button>
                {/* BACK BUTTON */}
                <button
                    onClick={() => { navigate("/dashboard/user-list") }}
                    className="w-full mt-4 border border-[#1E3FCC] rounded-xl py-3 text-sm flex items-center justify-center gap-2 hover:bg-[#1E3FCC]"
                >
                    <   ArrowLeft size={16} />
                    Back
                </button>
            </div>
        </div>
    );
}