import React, { useEffect, useState } from "react";
import { makeApiRequest } from "../axiosService/ApiCall";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { encryptData } from "../Auth/SecurityCrypto";
import { useAccount, useConfig, useSwitchChain } from 'wagmi';
import { ethers } from "ethers";
import config from "../axiosService/Config";
import flashLoanAbi from "../ABI/flashLoanAbi.json";
import { waitForTransactionReceipt, writeContract, estimateGas } from '@wagmi/core';



import axios from "axios";

function AdminSetting() {
  const [loading, setLoading] = useState(false);
  const [adminFee, setAdminFee] = useState("");
  const [network, setNetwork] = useState("Ethereum");
  const { chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();
  const { address, isConnected } = useAccount();
  const configs = useConfig()

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const networkMap = {
    Ethereum: "Ethereum",
    BNB: "BNB Smart Chain",
    Polygon: "Polygon",
    Arbitrum: "Arbitrum One",
  };


  useEffect(() => {
    console.log(chain?.name, network)
    if (chain?.id && network) {
      const expectedChainName = networkMap[network];
      console.log(expectedChainName)
      if (chain?.name != expectedChainName) {
        switchChain?.({ chainId: network == "Ethereum" ? chains[0].id : network == "BNB" ? chains[1].id : network == "Polygon" ? chains[2].id : chains[3].id });
      }
    }
  }, [network])

  const fetchSiteSettings = async () => {
    try {
      let params = {
        url: "get-admin-setting",
        method: "GET",
      };

      const res = await makeApiRequest(params);

      if (res.status && res.data) {
        const data = res.data;
        setAdminFee(data.adminFee || "");
        // setNetwork(data.network || "");
      }
    } catch (err) {
      console.log("Failed to fetch site settings");
    }
  };

  const submitAdminSetting = async (e) => {
    e.preventDefault();
    if (!adminFee || !network) {
      toast.error("All required fields must be filled.");
      return;
    }

    setLoading(true);

    const contractStatus = await handleChangeFee(adminFee);
    if (contractStatus) {

      try {
        const encryptedData = encryptData({
          network,
          adminFee,
        });
        const params = {
          url: "admin-setting",
          method: "POST",
          data: {
            data: encryptedData,
          },
        };

        const res = await makeApiRequest(params);
        if (res.status) {
          toast.success(res.message || "Admin settings updated successfully");
        } else {
          toast.error(res.message || "Failed to update settings");
        }
      } catch (err) {
        console.log("Error updating admin settings", err);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Failed to update settings")
      setLoading(false);
    }
  };

  const handleChangeFee = async (fee) => {
    try {
      if (isConnected) {
        const provider = new ethers.JsonRpcProvider(
          network === 'Ethereum'
            ? config.RPC.Ethereum
            : network === 'Arbitrum'
              ? config.RPC.Arbitrum
              : network === 'BNB'
                ? config.RPC.BNB
                : config.RPC.Polygon
        );
        const contract = config.FlashLoanContract[network.toString()];
        const flashLoanContract = new ethers.Contract(contract, flashLoanAbi, provider);
        const adminAddress = await flashLoanContract.admin();
        console.log(adminAddress, "adminaddress")
        if (adminAddress != address) {
          toast.error("You are not a admin!")
          setLoading(false);
        }
        console.log(fee)

        const feeWei = ethers.parseEther(fee.toString());
        console.log(feeWei)

        const hash = await writeContract(configs, {
          address: contract,
          abi: flashLoanAbi,
          functionName: 'changefee',
          args: [feeWei],
        });

        let transactionReceipt = await waitForTransactionReceipt(configs, {
          hash: hash,
        })

        return true;

      } else {
        toast.warn("Please connect your wallet!")
        setLoading(false);
      }
    } catch (error) {
      console.log("Getting error on change fee", error)
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="container-fluid pb-5">
        <div className="text-dark">
          <div className="row">
            <div className="col-lg-12">
              <div className="custom-nav-userlist-1">
                <h3 className="component-user ms-lg-0 mt-4">Admin Setting</h3>

                <div className="tab-content">
                  {/* Copyright */}
                  <div className="tab-pane fade show active" id="copyright">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="setting-tabs">
                          <form onSubmit={submitAdminSetting}>
                            <div className="mb-3">
                              <div className="mt-3">
                                <label className="form-label">Network</label>
                                <select
                                  className="form-select"
                                  value={network}
                                  onChange={(e) => {
                                    setNetwork(e.target.value);
                                    switchChain?.({ chainId: e.target.value == "Ethereum" ? chains[0].id : e.target.value == "BNB" ? chains[1].id : e.target.value == "Polygon" ? chains[2].id : chains[3].id })
                                  }}
                                >
                                  <option value="Ethereum">Ethereum</option>
                                  <option value="Polygon">Polygon</option>
                                  <option value="BNB">BNB</option>
                                  <option value="Arbitrum">Arbitrum</option>
                                </select>
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="form-label">
                                Admin fee
                              </label>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="form-control"
                                value={adminFee}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d*$/.test(val)) setAdminFee(val);
                                }}
                                // disabled={
                                //   siteSettingEdit == 0 &&
                                //   adminType == "SubAdmin"
                                // }
                                placeholder="e.g. 5"
                              />
                            </div>

                            <div className="mt-4 d-flex justify-content-between">
                              <button
                                type="submit"
                                className="custom-nav-button-1 active"
                                disabled={loading}
                              >
                                {loading ? "Submitting..." : "Submit"}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSetting;
