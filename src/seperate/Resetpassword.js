import React, { useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeApiRequest } from "../axiosService/ApiCall";
import { toast, ToastContainer } from "react-toastify";
import AYILogo from "../Assets/images/Ayi_logo.png";

function Resetpassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
//   const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("AdminCredentials");
    if (token) {
      navigate("/dashboard/admin-transfer");
    }
    //setToken(token);
  }, [token]);

  const togglePasswordVisibility = () => {
    setNewPassword(!newPassword);
  };

  const toggleConfirmPassword = () => {
    setConfirmPassword(!confirmPassword);
  };

  const handleSubmit = () => {
    navigate("/dashboard/analytics");
  };

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      password: Yup.string("Enter your password")
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`\{|}~\\])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`\{|}~\\]{8,}$/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords does not Match")
        .required("Confirm Password is required"),
    }),

    onSubmit: async (values) => {
      const datas = new FormData();
      datas.append("password", values.password);
      datas.append("confirmPassword", values.confirmPassword);
      datas.append("token", token);
      try {
        let params = {
          url: "admin-reset-password",
          method: "POST",
          data: datas,
        };
        const response = await makeApiRequest(params);

        if (response.status == true) {
          toast.success(response.message);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.warn(response.message);
          localStorage.clear();
        }
      } catch (error) { 
        console.log("resetpasswordError", error);
        //toast.error("Something Went Wrong...");
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
                <a class="navbar-brand custom-right-nav-name-2" href="/">
                  <img src={AYILogo} alt="logo" />
                </a>
                <h6 className="fw-bold">Reset Password</h6>
                <div className="custom-form">
                  <form onSubmit={formik.handleSubmit}>
                    <div class="mb-3  position-relative">
                      <label for="exampleInputPassword1" class="form-label">
                        New Password
                      </label>
                      <input
                        type={newPassword ? "text" : "password"}
                        className="form-control password-input  input-form"
                        name="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="**********"
                      />
                      <span
                        className="password-toggle-icon  cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {newPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-danger rq-msg mb-2">
                        {formik.errors.password}
                      </div>
                    ) : null}

                    <div className="mb-3   position-relative">
                      <label className="form-check-label" for="exampleCheck1">
                        Confirm Password
                      </label>
                      <input
                        type={confirmPassword ? "text" : "password"}
                        className="form-control password-input"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="**********"
                      />
                      <span
                        className="password-toggle-icon-1 cursor-pointer"
                        onClick={toggleConfirmPassword}
                      >
                        {confirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <div className="text-danger rq-msg mb-2">
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                    <div className="w-100 mt-3">
                      <button
                        type="submit"
                        className=" w-40 custom-main-button"
                      >
                        Reset
                      </button>
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

export default Resetpassword;
