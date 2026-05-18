import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeApiRequest } from "../axiosService/ApiCall";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
import AYILogo from "../Assets/images/Ayi_logo.png";
import { encryptData, decryptData } from "../Auth/SecurityCrypto";


function Forgotpassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("AdminCredentials");
    if (token) {
      navigate("/dashboard/user-list");
    }
    setToken(token)
  }, [token])

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {

      const Payload = encryptData({
        email: values.email,
      });
      const formData = new FormData();
      formData.append("data", Payload);
      try {
        setIsLoading(true);
        const params = {
          url: "admin-forget-password",
          method: "POST",
          data: formData,
        };
        const resp = await makeApiRequest(params);
        if (resp.encryptedData) {
          const decryptRes = decryptData(resp.encryptedData);
          if (decryptRes.status == true) {
            toast.success(decryptRes.message);
            setIsLoading(false);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            setIsLoading(false);
            toast.error(decryptRes.message);
          }
        }else{
          setIsLoading(false);
          toast.error(resp.message);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error("Internal Server Error");
      }
    },
  });


  return (
    <div className="App">
      <ToastContainer />
      <div className="custom-login pt-0">
        <div className="container">
          <div className="row min-vh-100 align-items-center justify-content-center">
            <div className="col-lg-5">
              <div className="custom-inside-log-in">
                <a
                  className="navbar-brand custom-right-nav-name-2"
                  href="/"
                >
                  <img src={AYILogo} alt="Logo" />
                </a>
                <h6 className="fw-bold">Forget Password</h6>
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
                    <div className="d-flex justify-content-between mt-3">
                      <p>
                        <Link to="/" className="text-dark">
                          Back to Login Page
                        </Link>
                      </p>
                    </div>
                    <div className="w-100">
                      {isLoading ? (
                        <button
                          className="d-send-btn-1 rounded-pill custom-main-button w-100"
                          type="button"
                        >
                          <Spinner animation="border" />
                        </button>
                      ) : (
                        <button className=" w-100 custom-main-button">
                          Submit
                        </button>
                      )}
                    </div>
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

export default Forgotpassword;
