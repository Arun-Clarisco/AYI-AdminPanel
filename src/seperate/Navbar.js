import React, { useState, useEffect } from "react";
import "../Assets/css/navbar.css";
import { IoMdLogOut } from "react-icons/io";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { makeApiRequest } from "../axiosService/ApiCall";
import AYILogo from "../Assets/images/Ayi_logo.png";
function Navbar() {
  const [adminType, setAdminType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [adminName, setAdminName] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    adminProfileres();
  }, []);

  const adminProfileres = async () => {
    try {
      let params = {
        url: "view-edit-GetData",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminCredentials")}`,
        },
      };
      const adminProfileData = await makeApiRequest(params);
      console.log("adminProfileData--", adminProfileData);


      if (adminProfileData.status) {
        const adminProfileres = adminProfileData?.data;
        if (adminProfileres) {
          setAdminName(adminProfileres?.name);
        } else {
          setAdminName("");
        }
      }
    } catch (error) {
      console.log("err--", error);
    }
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg custom-nav-top-1">
          <div className="container-fluid d-flex justify-content-between align-items-center">

            {/* Logo */}
            <a
              className="navbar-brand custom-right-nav-name-1"
              href="/dashboard/admin-transfer"
            >
              <img
                src={AYILogo}
                alt="Logo"
              />
            </a>

            {/* Admin Type / Name with Dropdown */}
            <div className="d-flex align-items-center">
              <button
                className="custom-nav-button-1 d-flex align-items-center"
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontWeight: "600",
                  fontSize: "16px",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                }}
              >
                <IoMdLogOut style={{ marginRight: "8px" }} />
                Log Out
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Logout Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="custom-nav-button-1 active"
            onClick={handleLogout}
          >
            Yes, Log Out
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Navbar;

