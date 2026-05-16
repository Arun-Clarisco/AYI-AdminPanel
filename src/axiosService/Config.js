import * as bitcoin from "bitcoinjs-lib";

let config = {};
let environment = "local";
if (environment == "local") {
  config = {
    adminBackendUrl: "http://localhost:3012/ayi/admin/",
    backendurl: "http://localhost:3012/",
    SECURITY_KEY: "lDjIOueR98239842",
    Ethereum: 'https://etherscan.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',
  };
} else if (environment == "staging") {
  config = {
    adminBackendUrl: "http://localhost:3012/ayi/admin/",
    backendurl: "http://localhost:3012/",
    SECURITY_KEY: "lDjIOueR98239842",
    Ethereum: 'https://etherscan.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',
  };
} else {
  config = {
    adminBackendUrl: "http://localhost:3012/ayi/admin/",
    backendurl: "http://localhost:3012/",
    SECURITY_KEY: "lDjIOueR98239842",
    Ethereum: 'https://etherscan.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',
  };
}

export default config;
