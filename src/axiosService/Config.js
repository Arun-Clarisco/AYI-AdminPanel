
let config = {};
let environment = "local";
if (environment == "local") {
  config = {
    adminBackendUrl: "https://api.ayibot92.tech/ayi/admin/",
    SECURITY_KEY: "lDjIOueR98239842",
    Ethereum: 'https://etherscan.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',
    Base: "https://basescan.org/tx/",

    FlashLoanContract: {
      Ethereum: "0xb7c5801c2336545a19adf55ca69d1a1c74f135c8",
      BNB: "0x247080aCBCaDEFc91ebD99366CF056Beec3331C7",
      Polygon: "0x86a6d92e3e63cf54616d87730d26c898890b38f6",
      Arbitrum: "0x86A6d92E3E63cF54616d87730d26C898890b38f6",
      Base: "0xCfcD3D1662e63E56694f19c22195dE923800ba7F"
    },

     RPC: {
      Ethereum: 'https://ethereum-rpc.publicnode.com',
      Arbitrum: 'https://arb1.arbitrum.io/rpc',
      BNB: 'https://bsc-dataseed1.binance.org',
      Polygon: 'https://polygon.drpc.org/',
      Base: 'https://base-rpc.publicnode.com'
    },
  };
}

export default config;
