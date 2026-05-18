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
import { set } from "date-fns";
import { FaRegCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import config from "../axiosService/Config";
import { encryptData, decryptData } from "../Auth/SecurityCrypto";




function FlashLoanHistory() {
    const [flashLoanHistory, setFlashLoanHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [is_Refreshing, setIs_Refreshing] = useState(false);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [status, setStatus] = useState("");
    const [network, setNetwork] = useState("");
    const calendarRef = useRef(null);

    // Range
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
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

            const encryptedData = encryptData({
                search,
                network,
                status,
                fromDate,
                toDate,
                page: currentPage,
                limit,
            });

            let params = {
                url: "get-flashloan-history",
                method: "POST",
                data: {
                    data: encryptedData,
                },
            };

            const response = await makeApiRequest(params);
            if (response.encryptedData) {
                const decryptRes = decryptData(response.encryptedData);
                if (decryptRes.status) {
                    setFlashLoanHistory(decryptRes.getFlashLoanTblDetails || []);
                    setTotalPages(decryptRes.totalItems || 0);
                } else {
                    setFlashLoanHistory([]);
                }
            }else{
                toast.error(response.message);
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
    }, [search, network, status, fromDate, toDate, currentPage, limit,]);

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
        setNetwork("");
        setStatus("");
        setFromDate("");
        setToDate("");
        setShowCalendar(false);
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
            const formattedDate = orgDate.split(",")[1].split("GMT")[0] + amOrPm;
            return formattedDate;
        } catch (e) {
            return "--";
        }
    };

    /* =========================================
          REGISTER DATE CHANGE
    ========================================= */

    const handleDateChange = (item) => {
        setRange([item.selection]);
        const formatDate = (date) => { return date.toLocaleDateString("en-CA"); };
        setFromDate(formatDate(item.selection.startDate));
        setToDate(formatDate(item.selection.endDate));
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
            name: "Network",
            selector: (row) => row.network || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Provider",
            selector: (row) => row.provider || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Asset",
            selector: (row) => row.asset || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Borrowed Amount",
            selector: (row) => row.borrowed_amount_usd || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Gross Profit",
            selector: (row) => row.gross_profit_usd || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Gas Cost",
            selector: (row) => row.gas_cost_usd || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Pair",
            selector: (row) => row.pair || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Buy Dex",
            selector: (row) => row.buy_dex || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Sell Dex",
            selector: (row) => row.sell_dex || "--",
            sortable: true,
            width: "250px",
        },

        // {
        //     name: "Hash",
        //     selector: (row) => row.tx_hash || "--",
        //     sortable: true,
        //     width: "250px",
        // },

        {
            name: "Hash",
            selector: (row) => row.tx_hash || "--",
            sortable: true,
            width: "300px",
            cell: (row) => {
                if (!row?.tx_hash) return "--";

                const explorerMap = {
                    Ethereum: config.Ethereum,
                    Arbitrum: config.Arbitrum,
                    BNB: config.BNB,
                    Polygon: config.Polygon,
                };

                const explorerUrl = explorerMap[row?.network];

                const shortHash =
                    row.tx_hash.length > 24
                        ? `${row.tx_hash.slice(0, 24)}...`
                        : row.tx_hash;

                const handleCopy = () => {
                    navigator.clipboard.writeText(row.tx_hash);
                    toast.success("Hash copied");
                };

                return (
                    <div className="d-flex align-items-center gap-2">
                        {explorerUrl ? (
                            <a
                                href={`${explorerUrl}${row.tx_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#0d6efd",
                                    textDecoration: "none",
                                    fontWeight: "500",
                                }}
                            >
                                {shortHash}
                            </a>
                        ) : (
                            <span>{shortHash}</span>
                        )}

                        <FaRegCopy
                            onClick={handleCopy}
                            style={{
                                cursor: "pointer",
                                fontSize: "14px",
                            }}
                            title="Copy Hash"
                        />
                    </div>
                );
            },
        },

        {
            name: "Status",
            selector: (row) => row.status || "--",
            sortable: true,
            width: "250px",
        },

        {
            name: "Created Date",
            selector: (row) => dateFormat(row.createdAt),
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
                                    Flash Loan History
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
                                            Search by Asset or Provider
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control search-bar"
                                            placeholder="Search by Asset or Provider"
                                            value={search}
                                            onChange={handleSearch}
                                            style={{ width: "220px" }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label for="exampleInputPassword1" className="form-label">
                                            Network
                                        </label>
                                        <select
                                            className="form-select search-bar"
                                            aria-label="Default select example"
                                            value={network}
                                            onChange={(e) => { setNetwork(e.target.value); handleReset() }}
                                        >
                                            <option value="">All Networks</option>
                                            <option value="Ethereum">Ethereum</option>
                                            <option value="Polygon">Polygon</option>
                                            <option value="BNB">BNB</option>
                                            <option value="Arbitrum">Arbitrum</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label for="exampleInputPassword1" className="form-label">
                                            Status
                                        </label>
                                        <select
                                            className="form-select search-bar"
                                            aria-label="Default select example"
                                            value={status}
                                            onChange={(e) => { setStatus(e.target.value); handleReset() }}
                                        >
                                            <option value="">All Types</option>
                                            <option value="completed">Completed</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>

                                    {/* DATE */}

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Created Date
                                        </label>

                                        <div
                                            ref={calendarRef}
                                            style={{
                                                position: "relative",
                                                width: "250px",
                                            }}
                                        >
                                            <div
                                                onClick={() =>
                                                    setShowCalendar(
                                                        !showCalendar
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
                                                    {fromDate &&
                                                        toDate
                                                        ? `${fromDate} - ${toDate}`
                                                        : "Select Date Range"}
                                                </span>

                                                <FaCalendarAlt
                                                    style={{ color: "#555" }}
                                                />
                                            </div>

                                            {showCalendar && (
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
                                                            handleDateChange
                                                        }
                                                        moveRangeOnFirstSelection={
                                                            false
                                                        }
                                                        ranges={range}
                                                        locale={enUS}
                                                        rangeColors={["#1E3FCC"]}
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
                                    data={flashLoanHistory}
                                    theme="solarized"
                                    defaultSortAsc={true}
                                    pagination
                                    paginationServer
                                    persistTableHead
                                    paginationPerPage={limit}
                                    paginationTotalRows={totalPages}
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

export default FlashLoanHistory;