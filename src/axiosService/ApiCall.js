import axios from "axios";
import config from "./Config";

export const makeApiRequest = async (params) => {
  try {
    let headerContentType = "application/json";
    if (params.header && params.header == "image") {
      headerContentType = "multipart/form-data"
    }
    let getToken = localStorage.getItem('AdminCredentials');
    // console.log(getToken)
    const token = getToken != null ? getToken : "";
    const headers = {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': headerContentType,
      "Access-Control-Allow-Headers": "*",
      "Authorization": `Bearer ${token}`,
    };

    let response;
    const payload = params.body || params.data;
    switch (params.method.toUpperCase()) {
      case "GET":
        response = await axios.get(`${config.adminBackendUrl}${params.url}`, { headers });
        break;
      case "POST":
        response = await axios.post(`${config.adminBackendUrl}${params.url}`, payload, { headers });
        break;
      case "PUT":
        response = await axios.put(`${config.adminBackendUrl}${params.url}`, payload, { headers });
        break;
      case "DELETE":
        response = await axios.delete(`${config.adminBackendUrl}${params.url}`, { headers });
        break;
      default:
        throw new Error(`Unsupported method: ${params.method}`);
    }
    if (response?.data?.logout) {
      localStorage.removeItem("AdminCredentials");
      window.location.href = "/";
    }
    return response.data;
  } catch (error) {
    console.log("axios error", error);
    throw error;
  }
};