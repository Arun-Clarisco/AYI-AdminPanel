import React, { useState, useEffect } from "react";
import "../Assets/css/navbar.css";
import { IoMdLogOut } from "react-icons/io";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { makeApiRequest } from "../axiosService/ApiCall";
import AYILogo from "../Assets/images/Ayi_logo.png";
import { useAccount, useConfig, useConnect, useDisconnect } from 'wagmi';
import { Wallet } from "react-bootstrap-icons";
import { encryptData, decryptData } from "../Auth/SecurityCrypto"
import { Link } from "react-router-dom";



function Navbar() {
  const [adminType, setAdminType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [adminName, setAdminName] = useState("");
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

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
      // console.log("adminProfileData--", adminProfileData);

      if (adminProfileData.encryptedData) {
        const decryptRes = decryptData(adminProfileData.encryptedData);
        if (decryptRes.status) {
          const adminProfileres = decryptRes?.data;
          if (adminProfileres) {
            setAdminName(adminProfileres?.name);
          } else {
            setAdminName("");
          }
        }else{
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
            <Link
              className="navbar-brand custom-right-nav-name-1"
              to="/dashboard/admin-transfer"
            >
              <img
                src={AYILogo}
                alt="Logo"
              />
            </Link>

            {/* Admin Type / Name with Dropdown */}
            <div className="d-flex gap-3 align-items-center">
              {!isConnected ?
                <button
                  className="custom-nav-button-1 d-flex align-items-center"
                  onClick={() => connect({ connector: connectors[0] })}
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
                  <Wallet style={{ marginRight: "8px" }} />
                  Connect Wallet
                </button>
                :
                <button
                  className="custom-nav-button-1 d-flex align-items-center"
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
                  <Wallet style={{ marginRight: "8px" }} />
                  {address.substring(0, 5) + "..." + address.substring(address.length - 4)}
                </button>
              }

              {isConnected ?
                <button
                  className="custom-nav-button-1 d-flex align-items-center"
                  onClick={() => disconnect()}
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
                  Disconnect
                </button>
                :
                <></>
              }

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

