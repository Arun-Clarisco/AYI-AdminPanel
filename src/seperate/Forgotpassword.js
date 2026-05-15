import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeApiRequest } from "../axiosService/ApiCall";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
import AYILogo from "../Assets/images/Ayi_logo.png";

function Forgotpassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [copyright, setCopyright] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
      const token = localStorage.getItem("AdminCredentials");
      if (token) {
          navigate("/dashboard/admin-transfer");
      }
      setToken(token)
  }, [token])

  const handleSubmit = () => {
    navigate("/dashboard/analytics");
  };

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
      const formData = new FormData();
      formData.append("email", values.email);
      try {
        setIsLoading(true);
        const params = {
          url: "admin-forget-password",
          method: "POST",
          data: formData,
        };
        const resp = await makeApiRequest(params);
        if (resp.status == true) {
          toast.success(resp.message);
          setIsLoading(false);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setIsLoading(false);
          toast.error(resp.message);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error("Internal Server Error");
      }
    },
  });
  // copyrightsdata fetch ...........
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
      toast.error(copyrightData.message);
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
                        <a href="/" className="text-dark">
                          Back to Login Page
                        </a>
                      </p>
                    </div>
                    <div className="w-100">
                      {isLoading ? (
                        <button
                          className="d-send-btn-1 rounded-pill custom-main-button w-40"
                          type="button"
                        >
                          <Spinner animation="border" />
                        </button>
                      ) : (
                        <button className=" w-40 custom-main-button">
                          Submit
                        </button>
                      )}
                      <div className="text-center">
                        {copyright}
                      </div>
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
