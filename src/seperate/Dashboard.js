import React, { useState, useEffect } from "react";
import $ from "jquery";
import { GrClose } from "react-icons/gr";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "../Assets/css/dashboard.css";
import Navbar from "../seperate/Navbar";
import Footer from "../seperate/Footer";
import { BiSolidUserDetail } from "react-icons/bi";
import { MdSwitchAccount } from "react-icons/md";
import { GiTwoCoins } from "react-icons/gi";
import UserList from "./UserList";
import { MdNotificationImportant } from "react-icons/md";
import { MdTransferWithinAStation } from "react-icons/md";
import { GoGitPullRequest } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { SiGnuprivacyguard } from "react-icons/si";
import { Link } from "react-router-dom";
import { FaHistory, FaTicketAlt } from "react-icons/fa";
import { MdHistoryEdu } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { makeApiRequest } from "../axiosService/ApiCall";
import { BsFilePerson } from "react-icons/bs";
import { AiOutlineDatabase } from "react-icons/ai";

$(document).ready(function () {
  if ($(window).width() < 600) {
    // if width is less than 600px
    $(".nav-link").click(function () {
      $("#mySidenav").css("width", "0px");
    });
  } else {
    // $('#v-pills-asset-tab').click(function () {
    //   location.reload();
    // });
  }

  $(".dashboard-profile-table-tabs-section-hide").hide();
  $(".details-button-navigation button").click(function () {
    $(".dashboard-profile-section-hide").hide();
    $(".dashboard-profile-table-tabs-section-hide").show();
    $("#mySidenav").css("width", "100px");
    $(".dashboard-main-section").css("margin-left", "100px");
    $(".dashboard-navbar-brand img").css("width", "50px");
    $(".dashboard-navbar-brand img").css("height", "50px");
    $("#mobile-close-arrow-left").hide();
    $(".dashboard-text-1").hide();
    $("#mobile-close-arrow-right").show();
  });
  $(".button-dashboard-table-back").click(function () {
    $(".dashboard-profile-section-hide").show();
    $(".dashboard-profile-table-tabs-section-hide").hide();
    $("#mySidenav").css("width", "250px");
    $(".dashboard-main-section").css("margin-left", "250px");
    $(".dashboard-navbar-brand img").css("width", "80px");
    $(".dashboard-navbar-brand img").css("height", "80px");
    $("#mobile-close-arrow-left").show();
    $(".dashboard-text-1").show();
    $("#mobile-close-arrow-right").hide();
  });
  $("#mobile-close-arrow-right").hide();
  $("#mobile-close-arrow-left").click(function () {
    $("#mySidenav").css("width", "100px");
    $(".dashboard-main-section").css("margin-left", "100px");
    $(".dashboard-navbar-brand img").css("width", "50px");
    $(".dashboard-navbar-brand img").css("height", "50px");
    $("#mobile-close-arrow-left").hide();
    $(".dashboard-text-1").hide();
    $("#mobile-close-arrow-right").show();
  });
  $("#mobile-close-arrow-right").click(function () {
    $("#mySidenav").css("width", "250px");
    $(".dashboard-main-section").css("margin-left", "250px");
    $(".dashboard-navbar-brand img").css("width", "80px");
    $(".dashboard-navbar-brand img").css("height", "80px");
    $("#mobile-close-arrow-left").show();
    $(".dashboard-text-1").show();
    $("#mobile-close-arrow-right").hide();
  });
  if ($("#mySidenav").css("width") === "100px") {
    $("#mySidenav").css("a");
  }
});

function Dashboard({ pageName }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    $("#mobile-three-line-collapse").click(function () {
      $("#mySidenav").css("width", "250px");
      // console.log("Mobile three line collapse clicked");
    });
    $("#mobile-close-collapse").click(function () {
      $("#mySidenav").css("width", "0px");
    });
  });

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="App dashboard-navhide-section">
        <div className="container-fluid">
          <div className="d-flex flex-lg-row flex-column">
            {/* Sidebar */}
            <div>
              <span id="mobile-three-line-collapse" style={{ fontSize: "24px" }}>&#9776;</span>
              <div className="dashboard-sidenav-section" id="mySidenav">
                <nav
                  id="sidebar"
                  className="col-md-12 col-lg-12 d-md-block sidebar component-navbar"
                >
                  <div className="d-flex flex-row">
                    <div className="ms-auto me-3">
                      <span id="mobile-close-collapse">
                        <GrClose />
                      </span>
                    </div>
                  </div>
                  <div>
                    <ul className="nav flex-column nav-pills">
                      <li className="nav-item">
                        <Link
                          className={`nav-link component-tabs ${location.pathname === "/dashboard/user-list"
                            ? "active"
                            : ""
                            }`}
                          to="/dashboard/user-list"
                        >
                          <MdHistoryEdu className="sidenav-icon-size-css " />{" "}
                          User List
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}

            <div className="dashboard-right-section">
              {location.pathname === "/dashboard/user-list" && <UserList />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
