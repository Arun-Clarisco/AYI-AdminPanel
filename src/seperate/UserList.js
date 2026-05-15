import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { enUS } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCalendarAlt } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { makeApiRequest } from "../axiosService/ApiCall";
import { Spinner } from "react-bootstrap";
import { MdRefresh } from "react-icons/md";
import {encryptData} from "../Auth/SecurityCrypto"

function UserList() {
  const [userData, setUserData] = useState([]);

  // Search
  const [search, setSearch] = useState("");

  // Register Date
  const [registerFromDate, setRegisterFromDate] = useState("");
  const [registerToDate, setRegisterToDate] = useState("");

  // Login Date
  const [loginFromDate, setLoginFromDate] = useState("");
  const [loginToDate, setLoginToDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);

  // Loading
  const [loading, setLoading] = useState(false);

  // Refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [is_Refreshing, setIs_Refreshing] = useState(false);

  // Pagination Reset
  const [resetPaginationToggle, setResetPaginationToggle] =
    useState(false);

  // Calendar
  const [showRegisterCalendar, setShowRegisterCalendar] =
    useState(false);

  const [showLoginCalendar, setShowLoginCalendar] =
    useState(false);

  const registerCalendarRef = useRef(null);
  const loginCalendarRef = useRef(null);

  // Register Range
  const [registerRange, setRegisterRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Login Range
  const [loginRange, setLoginRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  /* =========================================
        CLOSE CALENDAR OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        registerCalendarRef.current &&
        !registerCalendarRef.current.contains(event.target)
      ) {
        setShowRegisterCalendar(false);
      }

      if (
        loginCalendarRef.current &&
        !loginCalendarRef.current.contains(event.target)
      ) {
        setShowLoginCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  /* =========================================
        API CALL
  ========================================= */

  const getUserhistory = async (page = 1) => {
    try {
      setLoading(true);

      // let queryParams = new URLSearchParams({
      //   search: search || "",

      //   registerFromDate: registerFromDate || "",
      //   registerToDate: registerToDate || "",

      //   loginFromDate: loginFromDate || "",
      //   loginToDate: loginToDate || "",

      //   page: page,
      //   limit: limit,
      // }).toString();

      const encryptedData = encryptData({
        search,
        registerFromDate,
        registerToDate,
        loginFromDate,
        loginToDate,
        page: currentPage,
        limit,
      });

      let params = {
        url: "get-user-history",
        method: "POST",
        data: {
          data: encryptedData,
        },
      };

      const response = await makeApiRequest(params);
      console.log({ response });


      if (response.status) {
        setUserData(response.getUserTblDetails || []);
        setTotalPages(response.totalItems || 0);
      } else {
        setUserData([]);
      }

      setLoading(false);
    } catch (error) {
      console.log("error---", error);
      setLoading(false);
    }
  };

  /* =========================================
        USE EFFECT
  ========================================= */

  useEffect(() => {
    getUserhistory(currentPage);
  }, [
    search,
    registerFromDate,
    registerToDate,
    loginFromDate,
    loginToDate,
    currentPage,
    limit,
  ]);

  /* =========================================
        RESET PAGINATION
  ========================================= */

  const handleReset = () => {
    setLimit(10);
    setCurrentPage(1);
    setResetPaginationToggle(!resetPaginationToggle);
  };

  /* =========================================
        CLEAR FILTER
  ========================================= */

  const handleClearFilters = async () => {
    setIsRefreshing(true);

    setSearch("");

    // Register
    setRegisterFromDate("");
    setRegisterToDate("");

    // Login
    setLoginFromDate("");
    setLoginToDate("");

    // Calendar
    setShowRegisterCalendar(false);
    setShowLoginCalendar(false);

    setCurrentPage(1);
    setLimit(10);

    setIs_Refreshing(!is_Refreshing);

    const start = Date.now();

    const elapsed = Date.now() - start;

    if (elapsed < 500) {
      await new Promise((resolve) =>
        setTimeout(resolve, 500 - elapsed)
      );
    }

    setIsRefreshing(false);
  };

  /* =========================================
        DATE FORMAT
  ========================================= */

  const dateFormat = (date) => {
    try {
      if (!date) return "--";

      const orgDate = new Date(date).toUTCString();

      const hours = new Date(date).getUTCHours();

      const amOrPm = hours >= 12 ? "PM" : "AM";

      const formattedDate =
        orgDate.split(",")[1].split("GMT")[0] + amOrPm;

      return formattedDate;
    } catch (e) {
      return "--";
    }
  };

  /* =========================================
        REGISTER DATE CHANGE
  ========================================= */

  const handleRegisterDateChange = (item) => {
    setRegisterRange([item.selection]);

    const formatDate = (date) => {
      return date.toLocaleDateString("en-CA");
    };

    setRegisterFromDate(
      formatDate(item.selection.startDate)
    );

    setRegisterToDate(
      formatDate(item.selection.endDate)
    );

    handleReset();
  };

  /* =========================================
        LOGIN DATE CHANGE
  ========================================= */

  const handleLoginDateChange = (item) => {
    setLoginRange([item.selection]);

    const formatDate = (date) => {
      return date.toLocaleDateString("en-CA");
    };

    setLoginFromDate(
      formatDate(item.selection.startDate)
    );

    setLoginToDate(
      formatDate(item.selection.endDate)
    );

    handleReset();
  };

  /* =========================================
        SEARCH
  ========================================= */

  const handleSearch = (e) => {
    setSearch(e.target.value);
    handleReset();
  };

  /* =========================================
        TABLE COLUMNS
  ========================================= */

  const columnsone = [
    {
      name: "S.No",
      selector: (row, index) =>
        (currentPage - 1) * limit + index + 1,
      sortable: true,
      width: "90px",
    },

    {
      name: "Register Date",
      selector: (row) => dateFormat(row.dateTime),
      sortable: true,
      width: "250px",
    },

    {
      name: "Name",
      selector: (row) => row.name || "--",
      sortable: true,
      width: "250px",
    },

    {
      name: "Email",
      selector: (row) => row.email || "--",
      sortable: true,
      width: "300px",
    },

    {
      name: "Last Login",
      selector: (row) =>
        row.lastLogin
          ? dateFormat(row.lastLogin)
          : "--",
      sortable: true,
      width: "250px",
    },
  ];

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="text-dark">
          <div className="row">
            <div className="col-lg-12">
              <div className="py-3 d-flex justify-content-between">
                <h3 className="component-user text-center">
                  User List
                </h3>
              </div>

              {/* =========================================
                    FILTER SECTION
              ========================================= */}

              <div className="d-flex calendor-form align-items-end">
                <form className="d-flex gap-lg-2 align-items-end flex-wrap">

                  {/* SEARCH */}

                  <div className="mb-3">
                    <label className="form-label">
                      Search by Name or Email
                    </label>

                    <input
                      type="text"
                      className="form-control search-bar"
                      placeholder="Search by Name or Email"
                      value={search}
                      onChange={handleSearch}
                      style={{ width: "220px" }}
                    />
                  </div>

                  {/* REGISTER DATE */}

                  <div className="mb-3">
                    <label className="form-label">
                      Register Date
                    </label>

                    <div
                      ref={registerCalendarRef}
                      style={{
                        position: "relative",
                        width: "250px",
                      }}
                    >
                      <div
                        onClick={() =>
                          setShowRegisterCalendar(
                            !showRegisterCalendar
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px",
                          border:
                            "1px solid var(--color-1)",
                          borderRadius: "5px",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          {registerFromDate &&
                            registerToDate
                            ? `${registerFromDate} - ${registerToDate}`
                            : "Select Date Range"}
                        </span>

                        <FaCalendarAlt
                          style={{ color: "#555" }}
                        />
                      </div>

                      {showRegisterCalendar && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: -80,
                            zIndex: 1000,
                            background: "#fff",
                            boxShadow:
                              "0px 4px 6px rgba(0,0,0,0.1)",
                            borderRadius: "5px",
                          }}
                        >
                          <DateRange
                            editableDateInputs={true}
                            onChange={
                              handleRegisterDateChange
                            }
                            moveRangeOnFirstSelection={
                              false
                            }
                            ranges={registerRange}
                            locale={enUS}
                            rangeColors={["#58f9b0"]}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LOGIN DATE */}

                  <div className="mb-3">
                    <label className="form-label">
                      Last Login
                    </label>

                    <div
                      ref={loginCalendarRef}
                      style={{
                        position: "relative",
                        width: "250px",
                      }}
                    >
                      <div
                        onClick={() =>
                          setShowLoginCalendar(
                            !showLoginCalendar
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px",
                          border:
                            "1px solid var(--color-1)",
                          borderRadius: "5px",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          {loginFromDate &&
                            loginToDate
                            ? `${loginFromDate} - ${loginToDate}`
                            : "Select Date Range"}
                        </span>

                        <FaCalendarAlt
                          style={{ color: "#555" }}
                        />
                      </div>

                      {showLoginCalendar && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: -80,
                            zIndex: 1000,
                            background: "#fff",
                            boxShadow:
                              "0px 4px 6px rgba(0,0,0,0.1)",
                            borderRadius: "5px",
                          }}
                        >
                          <DateRange
                            editableDateInputs={true}
                            onChange={
                              handleLoginDateChange
                            }
                            moveRangeOnFirstSelection={
                              false
                            }
                            ranges={loginRange}
                            locale={enUS}
                            rangeColors={["#58f9b0"]}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* REFRESH */}

                  <div className="mb-2">
                    <button
                      type="button"
                      className="form-label custom-nav-button-1 active cursor-pointer"
                      onClick={handleClearFilters}
                      disabled={isRefreshing}
                    >
                      <MdRefresh
                        style={{ fontSize: "24px" }}
                        className={
                          isRefreshing
                            ? "rotate-icon"
                            : ""
                        }
                      />
                    </button>
                  </div>
                </form>
              </div>

              {/* =========================================
                    TABLE
              ========================================= */}

              <div className="liquidity-table-1">
                <DataTable
                  key={is_Refreshing}
                  columns={columnsone}
                  data={userData}
                  theme="solarized"
                  defaultSortAsc={true}
                  pagination
                  paginationServer
                  persistTableHead
                  paginationPerPage={limit}
                  paginationTotalRows={totalPages}
                  paginationRowsPerPageOptions={[
                    5,
                    10,
                    15,
                    20,
                  ]}
                  paginationResetDefaultPage={
                    resetPaginationToggle
                  }
                  onChangeRowsPerPage={(
                    newRowsPerPage
                  ) => {
                    setLimit(newRowsPerPage);
                    setCurrentPage(1);
                  }}
                  onChangePage={(page) =>
                    setCurrentPage(page)
                  }
                  progressPending={loading}
                  progressComponent={
                    <div
                      className="py-4 w-100"
                      style={{ marginLeft: "45vw" }}
                    >
                      <Spinner animation="border" />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;