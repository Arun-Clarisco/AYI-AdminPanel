import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { makeApiRequest } from "../axiosService/ApiCall"

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const hasFetched = useRef(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const fetchData = async () => {
        try {
            localStorage.getItem('AdminCredentials');
            let params = {
                url: "admin-auth",
                method: "POST",
            }
            let response = await makeApiRequest(params);
            console.log("fetchData---",response);
            
            if (response.status) {
            } else {
                localStorage.clear()
                setIsLoggedIn(false);
                return navigate('/');
            }
        } catch (error) {
            console.log("An error occurred:", error.message);
        }
    };

    useEffect(() => {
        hasFetched.current = false
    },[location.pathname])

    useEffect(() => {
        // console.log(hasFetched.current,"hasFetched.current>>>>>>>>>>>>>")
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  });

    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}
export default ProtectedRoute
