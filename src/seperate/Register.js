import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Assuming you're using react-icons
import { Link } from 'react-router-dom';

function Register() {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <div className='App'>
            <div className='custom-login pt-0'>
                <div className='container'>
                    <div className='row min-vh-100 align-items-center justify-content-center'>
                        <div className='col-lg-5'>
                            <div className='custom-inside-log-in'>
                                <h2>AYI</h2>
                                <h6 className='fw-bold'>Sign In to Application</h6>
                                <div className='custom-form'>
                                    <form>
                                        <div className="mb-3">
                                            <label for="exampleInputEmail1" className="form-label">Email address</label>
                                            <input type="email" className="form-control input-form" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                        </div>
                                        <div className="mb-3  position-relative">
                                            <label for="exampleInputPassword1" className="form-label">Password</label>
                                            <input type={showPassword ? "text" : "password"} className="form-control input-form" id="exampleInputPassword1" />
                                            <span
                                                className="position-absolute top-50 end-0 translate-middle-y me-3 mt-3 cursor-pointer"
                                                onClick={togglePasswordVisibility}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                        <div className="mb-3 form-check">
                                            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                            <label className="form-check-label" for="exampleCheck1">Remember Password</label>
                                        </div>
                                        <div className='w-100'>
                                            <button type="submit" className=" w-40 custom-main-button">Submit</button>
                                        </div>
                                        <div className='d-flex justify-content-between mt-3'>
                                            <p><Link to='/forgot-password' className='custom-a-1'>Forgot Password</Link></p>
                                            <p>Login</p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register