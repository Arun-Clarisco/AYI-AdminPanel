
let config = {};
let environment = "local";
if (environment == "local") {
  config = {
    adminBackendUrl: "http://localhost:3012/ayi/admin/",
    SECURITY_KEY: "lDjIOueR98239842",
    Ethereum: 'https://etherscan.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',
    Base: "https://basescan.org/tx/",

    FlashLoanContract: {
      Ethereum: "",
      BNB: "0xb7c5801c2336545a19adf55ca69d1a1c74f135c8",
      Polygon: "0x247080acbcadefc91ebd99366cf056beec3331c7",
      Arbitrum: "0x9e64ea527bdD2752c305F720397E6337320F69E7",
      Base: "0xa4e63206EF039c48f6602EE5106359d9561510DF"
    },

    RPC: {
      Ethereum: 'https://mainnet.infura.io/v3/your_infura_key',
      Arbitrum: 'https://arb1.arbitrum.io/rpc',
      BNB: 'https://bsc-dataseed.binance.org/',
      Polygon: 'https://polygon.drpc.org/',
      Base: 'https://base-rpc.publicnode.com'
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
    Base: "https://basescan.org/tx/",

    FlashLoanContract: {
      Ethereum: "",
      BNB: "0xb7c5801c2336545a19adf55ca69d1a1c74f135c8",
      Polygon: "0x247080acbcadefc91ebd99366cf056beec3331c7",
      Arbitrum: "0x9e64ea527bdD2752c305F720397E6337320F69E7",
      Base: "0xa4e63206EF039c48f6602EE5106359d9561510DF"
    },

    RPC: {
      Ethereum: 'https://mainnet.infura.io/v3/your_infura_key',
      Arbitrum: 'https://arb1.arbitrum.io/rpc',
      BNB: 'https://bsc-dataseed.binance.org/',
      Polygon: 'https://polygon.drpc.org/',
      Base: 'https://base-rpc.publicnode.com'
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
    Base: "https://basescan.org/tx/",

    FlashLoanContract: {
      Ethereum: "",
      BNB: "0xb7c5801c2336545a19adf55ca69d1a1c74f135c8",
      Polygon: "0x247080acbcadefc91ebd99366cf056beec3331c7",
      Arbitrum: "0x9e64ea527bdD2752c305F720397E6337320F69E7",
      Base: "0xa4e63206EF039c48f6602EE5106359d9561510DF"
    },

    RPC: {
      Ethereum: 'https://mainnet.infura.io/v3/your_infura_key',
      Arbitrum: 'https://arb1.arbitrum.io/rpc',
      BNB: 'https://bsc-dataseed.binance.org/',
      Polygon: 'https://polygon.drpc.org/',
      Base: 'https://base-rpc.publicnode.com'
    },

  };
}

export default config;
