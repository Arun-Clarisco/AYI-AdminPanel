import React, { useState, useEffect } from "react";
import "../Assets/css/style.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeApiRequest } from "../axiosService/ApiCall";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Assuming you're using react-icons
import { encryptData, decryptData } from "../Auth/SecurityCrypto";
import axios from "axios";
import AYILogo from "../Assets/images/Ayi_logo.png";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copyright, setCopyright] = useState("");
  // const handleSubmit = () => {
  //     navigate("/dashboard/analytics")
  // }

  const toggleOldPasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("AdminCredentials");
    if (token) {
      navigate("/dashboard/user-list");
    } else {
      navigate("/");
    }
    setToken(token);
  }, [token]);



  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string("Enter your password").required(
        "Password is required"
      ),
    }),
    onSubmit: async (values) => {
      const address = await axios.get("https://api.ipify.org/?format=json");

      const lastloginIpAddress = address.data.ip;
      const Payload = encryptData({
        email: values.email,
        password: values.password,
        ip: lastloginIpAddress
      });

      if (!Payload) {
        toast.error("Encryption Error");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("data", Payload);

      try {
        setIsLoading(true);
        const params = {
          url: "admin-login",
          method: "POST",
          data: formData,
        };
        const loginResponse = await makeApiRequest(params);
        console.log("login--", loginResponse);

        if (loginResponse.encryptedData) {
          const logindecryptRes = decryptData(loginResponse.encryptedData);
          console.log("logindecryptRes", logindecryptRes);

          // const logindecryptRes = new Date().getTime();
          if (logindecryptRes.status == true) {
            toast.success(logindecryptRes.message);
            localStorage.setItem("email", values.email);
            localStorage.setItem("AdminCredentials", logindecryptRes.token);
            setIsLoading(false);
            setTimeout(() => {
              navigate("/dashboard/user-list");
            }, 3000);
          } else {
            setIsLoading(false);
            toast.error(logindecryptRes.message);
          }
        } else {
          setIsLoading(false);
          toast.error(loginResponse.message);
        }
      } catch (error) {
        console.log("err", error);
        setIsLoading(false);

      }
    },
  });

  // const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // copyrights data fetch
  useEffect(() => {
    // copyrightData();
  }, []);
  const copyrightData = async (req, res) => {
    try {
      const params = {
        url: "get-CopyrightsData",
        method: "GET",
      };
      const copyrightData = await makeApiRequest(params);
      // console.log("copyrightData--", copyrightData);
      if (copyrightData.status == true) {
        setCopyright(copyrightData.data[0].copyright);
      }
    } catch (err) {
      console.log("err", err);
      // toast.error(copyrightData.message);
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      <div className="custom-login pt-0">
        <div className="container">
          <div className="row min-vh-100 align-items-center justify-content-center">
            <div className="col-lg-5">
              <div className="custom-inside-log-in">
                <a className="navbar-brand custom-right-nav-name-2" href="/">
                  <img src={AYILogo} alt="logo" />
                </a>
                <h6 className="fw-bold">Sign In to Application</h6>
                <div className="custom-form">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                      <label for="email" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control input-form"
                        id="email"
                        aria-describedby="emailHelp"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger rq-msg">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>

                    <div className="mb-3 position-relative">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control input-form"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3  mt-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>

                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-danger rq-msg">
                        {formik.errors.password}
                      </div>
                    ) : null}

                    {/* <div class="mb-3 form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="exampleCheck1"
                      />
                      <label class="form-check-label" for="exampleCheck1">Remember Password</label>
                    </div> */}

                    <div className="w-100">
                      {isLoading ? (
                        <button
                          className="d-send-btn-1 rounded-pill custom-main-button w-40"
                          type="button"
                        >
                          <Spinner animation="border" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="custom-main-button w-40"
                        >
                          Submit
                        </button>
                      )}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <p>
                        <a href="/forgot-password" className="text-dark">
                          Forgot Password
                        </a>
                      </p>
                      {/* <a href='/register'><p>Register</p></a> */}
                    </div>
                    <div className="text-center">{copyright}</div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
