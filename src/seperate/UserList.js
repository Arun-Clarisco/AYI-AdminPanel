import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { enUS } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCalendarAlt } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import DataTable from "react-data-table-component";
import { Spinner } from "react-bootstrap";
import { makeApiRequest } from "../axiosService/ApiCall";
import { encryptData, decryptData } from "../Auth/SecurityCrypto";

function UserList() {
  const [userData, setUserData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [registerFromDate, setRegisterFromDate] = useState("");
  const [registerToDate, setRegisterToDate] = useState("");
  const [loginFromDate, setLoginFromDate] = useState("");
  const [loginToDate, setLoginToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showRegisterCalendar, setShowRegisterCalendar] = useState(false);
  const [showLoginCalendar, setShowLoginCalendar] = useState(false);
  const registerCalendarRef = useRef(null);
  const loginCalendarRef = useRef(null);

  /* =========================================
        REGISTER RANGE
  ========================================= */

  const [registerRange, setRegisterRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  /* =========================================
        LOGIN RANGE
  ========================================= */

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
      if (registerCalendarRef.current && !registerCalendarRef.current.contains(event.target)) {
        setShowRegisterCalendar(false);
      }

      if (loginCalendarRef.current && !loginCalendarRef.current.contains(event.target)) {
        setShowLoginCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================
        SEARCH DEBOUNCE
  ========================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* =========================================
        API CALL
  ========================================= */

  const getUserhistory = async (page = 1) => {
    try {
      setLoading(true);

      const encryptedData = encryptData({
        search,
        registerFromDate,
        registerToDate,
        loginFromDate,
        loginToDate,
        page,
        limit,
      });

      const params = {
        url: "get-user-history",
        method: "POST",
        data: {
          data: encryptedData,
        },
      };

      const response = await makeApiRequest(params);

      if (response?.encryptedData) {
        const decryptRes = decryptData(response.encryptedData);

        if (decryptRes?.status) {
          setUserData(decryptRes?.getUserTblDetails || []);
          setTotalRows(decryptRes?.totalItems || 0);
        } else {
          setUserData([]);
          setTotalRows(0);
        }
      }
    } catch (error) {
      console.log("get-user-history error =>", error);
      setUserData([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
        API USE EFFECT
  ========================================= */

  useEffect(() => {
    getUserhistory(currentPage);
  }, [search, registerFromDate, registerToDate, loginFromDate, loginToDate, currentPage, limit]);

  /* =========================================
        DATE FORMAT
  ========================================= */

  const dateFormat = (date) => {
    try {
      if (!date) return "--";

      return new Date(date).toLocaleString(
        "en-IN",
        {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }
      );
    } catch {
      return "--";
    }
  };

  /* =========================================
        REGISTER DATE CHANGE
  ========================================= */

  const handleRegisterDateChange = (item) => {
    setRegisterRange([item.selection]);
    const formatDate = (date) => date.toLocaleDateString("en-CA");
    setRegisterFromDate(formatDate(item.selection.startDate));
    setRegisterToDate(formatDate(item.selection.endDate));
    setCurrentPage(1);
  };

  /* =========================================
        LOGIN DATE CHANGE
  ========================================= */

  const handleLoginDateChange = (item) => {
    setLoginRange([item.selection]);
    const formatDate = (date) => date.toLocaleDateString("en-CA");
    setLoginFromDate(formatDate(item.selection.startDate));
    setLoginToDate(formatDate(item.selection.endDate));
    setCurrentPage(1);
  };

  /* =========================================
        CLEAR FILTERS
  ========================================= */

  const handleClearFilters = () => {
    setIsRefreshing(true);
    setSearchInput("");
    setSearch("");
    setRegisterFromDate("");
    setRegisterToDate("");
    setLoginFromDate("");
    setLoginToDate("");
    setShowRegisterCalendar(false);
    setShowLoginCalendar(false);
    setCurrentPage(1);
    setLimit(10);
    setResetPaginationToggle((prev) => !prev);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  /* =========================================
        TABLE COLUMNS
  ========================================= */

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * limit + index + 1,
      sortable: true,
      width: "90px",
    },

    {
      name: "Register Date",
      selector: (row) => dateFormat(row?.dateTime),
      sortable: true,
      width: "250px",
    },

    {
      name: "Name",
      selector: (row) => row?.name || "--",
      sortable: true,
      width: "220px",
    },

    {
      name: "Email",
      selector: (row) => row?.email || "--",
      sortable: true,
      width: "300px",
    },

    {
      name: "Last Login",
      selector: (row) => row?.lastLogin ? dateFormat(row?.lastLogin) : "--",
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

              {/* HEADER */}

              <div className="py-3 d-flex justify-content-between">
                <h3 className="component-user text-center">
                  User List
                </h3>
              </div>

              {/* FILTER SECTION */}

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
                      value={searchInput}
                      onChange={(e) =>
                        setSearchInput(e.target.value)
                      }
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
                          setShowRegisterCalendar(!showRegisterCalendar)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px",
                          border: "1px solid var(--color-1)",
                          borderRadius: "5px",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          {registerFromDate && registerToDate ? `${registerFromDate} - ${registerToDate}` : "Select Date Range"}
                        </span>

                        <FaCalendarAlt />
                      </div>

                      {showRegisterCalendar && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: -80,
                            zIndex: 1000,
                            background: "#fff",
                            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                            borderRadius: "5px",
                          }}
                        >
                          <DateRange
                            editableDateInputs
                            onChange={
                              handleRegisterDateChange
                            }
                            moveRangeOnFirstSelection={
                              false
                            }
                            ranges={registerRange}
                            locale={enUS}
                            rangeColors={[
                              "#1E3FCC",
                            ]}
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
                          justifyContent:
                            "space-between",
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

                        <FaCalendarAlt />
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
                            editableDateInputs
                            onChange={
                              handleLoginDateChange
                            }
                            moveRangeOnFirstSelection={
                              false
                            }
                            ranges={loginRange}
                            locale={enUS}
                            rangeColors={[
                              "#1E3FCC",
                            ]}
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
                        style={{
                          fontSize: "24px",
                        }}
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

              {/* TABLE */}

              <div className="liquidity-table-1">
                <DataTable
                  columns={columns}
                  data={userData}
                  theme="solarized"
                  pagination
                  paginationServer
                  persistTableHead
                  paginationPerPage={limit}
                  paginationTotalRows={totalRows}
                  paginationRowsPerPageOptions={[5, 10, 15, 20]}
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
                      className="py-4 w-100 text-center"
                    >
                      <Spinner animation="border" />
                    </div>
                  }
                  noDataComponent={
                    <div className="py-4">
                      No Users Found
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