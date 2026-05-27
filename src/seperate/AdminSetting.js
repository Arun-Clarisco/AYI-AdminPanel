import React, { useEffect, useState } from "react";
import { makeApiRequest } from "../axiosService/ApiCall";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { encryptData, decryptData } from "../Auth/SecurityCrypto";
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
  const [networkFees, setNetworkFees] = useState([]);
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
    Base: "Base"
  };


  useEffect(() => {
    if (chain?.id && network) {
      const expectedChainName = networkMap[network];
      if (chain?.name != expectedChainName) {
        switchChain?.({ chainId: network == "Ethereum" ? chains[0].id : network == "BNB" ? chains[1].id : network == "Polygon" ? chains[2].id : network == "Arbitrum" ? chains[3].id : network == "Base" ? chains[4].id : chains[0].id });
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
      if (res.encryptedData) {
        const decryptRes = decryptData(res.encryptedData);
        if (decryptRes.status) {
          setNetworkFees(decryptRes.data.networkFees || []);
        } else {
          setNetworkFees([]);
        }
      } else {
        setNetworkFees([]);
      }
    } catch (err) {
      console.log("Failed to fetch site settings");
    }
  };

  const handleNetworkChange = async (value) => {
    setNetwork(value);
      try {
        const provider = new ethers.JsonRpcProvider(
          value === 'Ethereum'
            ? config.RPC.Ethereum
            : value === 'Arbitrum'
              ? config.RPC.Arbitrum
              : value === 'BNB'
                ? config.RPC.BNB
                : value === 'Polygon' ? config.RPC.Polygon : config.RPC.Base
        );
        const contract = config.FlashLoanContract[value.toString()];
        const flashLoanContract = new ethers.Contract(contract, flashLoanAbi, provider);
        const fee = await flashLoanContract.fee();
        const feeEther = ethers.formatUnits(fee, 18);
        setAdminFee(feeEther);
      } catch (error) {
        console.log(error)
        setAdminFee("");
      }
  };

  useEffect(()=>{
    if(network){
      handleNetworkChange(network)
    }
  },[network])

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
        if (res.encryptedData) {
          const decryptRes = decryptData(res.encryptedData);
          if (decryptRes.status) {
            toast.success(decryptRes.message || "Admin settings updated successfully");
            // Update local state with new settings
            const updatedNetworkFees = networkFees.filter(
              (item) => item.network !== network
            );
            updatedNetworkFees.push({ network, adminFee });
            setNetworkFees(updatedNetworkFees);
          } else {
            toast.error(decryptRes.message);
          }
        } else {
          toast.error(res.message);
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
                : network === 'Polygon' ? config.RPC.Polygon : config.RPC.Base
        );
        const contract = config.FlashLoanContract[network.toString()];
        const flashLoanContract = new ethers.Contract(contract, flashLoanAbi, provider);
        const adminAddress = await flashLoanContract.admin();
        if (adminAddress != address) {
          toast.error("You are not a admin!")
          setLoading(false);
          return false
        }

        const feeWei = ethers.parseEther(fee.toString());

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
                                  onChange={(e) => setNetwork(e.target.value)}
                                >
                                  <option value="Ethereum">Ethereum</option>
                                  <option value="Polygon">Polygon</option>
                                  <option value="BNB">BNB</option>
                                  <option value="Arbitrum">Arbitrum</option>
                                  <option value="Base">Base</option>
                                </select>
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Admin fee</label>

                              <input
                                type="text"
                                className="form-control"
                                value={adminFee}
                                onChange={(e) => {
                                  let val = e.target.value;

                                  if (!/^\d*\.?\d*$/.test(val)) return;

                                  if (/^0\d+/.test(val)) return;

                                  if (val === ".") return;

                                  if (/^00+/.test(val)) return;


                                  setAdminFee(val);
                                }}
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
