import React from "react";
import { Link, Navigate } from "react-router-dom";

function NotFound() {

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "#f8f9fa",
            }}
        >
            <h1 style={{ fontSize: "80px", margin: 0, color: "#1668dd" }}>404</h1>
            <h3 style={{color: "#1668dd",}}>Page Not Found</h3>

            <Link
                to={localStorage.getItem("AdminCredentials") ? "/dashboard/user-list" : "/"}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#1668dd",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "5px",
                }}
            >
                {localStorage.getItem("AdminCredentials") ? "Go To Home" : "Go To Login"}
            </Link>
        </div>
    );
}

export default NotFound;