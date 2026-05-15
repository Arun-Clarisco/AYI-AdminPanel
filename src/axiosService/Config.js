import * as bitcoin from "bitcoinjs-lib";

let config = {};
let environment = "local";
if (environment == "local") {
  config = {
    adminBackendUrl: "http://localhost:3005/ayi/admin/",
    backendurl: "http://localhost:3005/",
    SECURITY_KEY: "lDjIOueR98239842",
  };
} else if (environment == "staging") {
  config = {
    adminBackendUrl: "http://localhost:3005/ayi/admin/",
    backendurl: "http://localhost:3005/",
    SECURITY_KEY: "lDjIOueR98239842",
  };
} else {
  config = {
    adminBackendUrl: "http://localhost:3005/ayi/admin/",
    backendurl: "http://localhost:3005/",
    SECURITY_KEY: "lDjIOueR98239842",
  };
}

export default config;
