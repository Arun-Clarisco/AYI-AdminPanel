
let config = {};
let environment = "staging";
if (environment == "local") {
  config = {
    adminBackendUrl: "http://localhost:3012/ayi/admin/",
    SECURITY_KEY: "lDjIOueR98239842",
    Ethereum: 'https://etherscan.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',

    FlashLoanContract: {
      Ethereum: "",
      BNB: "0x85B0040DcB5BfBd7614a21934597698bb48F67A5",
      Polygon: "",
      Arbitrum: ""
    },

    RPC: {
      Sepolia: "https://eth-sepolia-testnet.api.pocket.network",
      Ethereum: 'https://mainnet.infura.io/v3/your_infura_key',
      Arbitrum: 'https://arb1.arbitrum.io/rpc',
      BNB: 'https://bsc-dataseed.binance.org/',
      Polygon: 'https://polygon.drpc.org/',
    },
  };
} else if (environment == "staging") {
  config = {
    adminBackendUrl: "https://staging.api.ayibot92.tech/ayi/admin/",
    SECURITY_KEY: "lDjIOueR98239842",
    Ethereum: 'https://etherscan.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',

        FlashLoanContract: {
      Ethereum: "",
      BNB: "0x85B0040DcB5BfBd7614a21934597698bb48F67A5",
      Polygon: "",
      Arbitrum: ""
    },

    RPC: {
      Sepolia: "https://eth-sepolia-testnet.api.pocket.network",
      Ethereum: 'https://mainnet.infura.io/v3/your_infura_key',
      Arbitrum: 'https://arb1.arbitrum.io/rpc',
      BNB: 'https://bsc-dataseed.binance.org/',
      Polygon: 'https://polygon.drpc.org/',
    },

  };
} else {
  config = {
    adminBackendUrl: "http://localhost:3012/ayi/admin/",
    SECURITY_KEY: "lDjIOueR98239842",
    Ethereum: 'https://etherscan.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',

        FlashLoanContract: {
      Ethereum: "",
      BNB: "0x85B0040DcB5BfBd7614a21934597698bb48F67A5",
      Polygon: "",
      Arbitrum: ""
    },

    RPC: {
      Sepolia: "https://eth-sepolia-testnet.api.pocket.network",
      Ethereum: 'https://mainnet.infura.io/v3/your_infura_key',
      Arbitrum: 'https://arb1.arbitrum.io/rpc',
      BNB: 'https://bsc-dataseed.binance.org/',
      Polygon: 'https://polygon.drpc.org/',
    },

  };
}

export default config;
