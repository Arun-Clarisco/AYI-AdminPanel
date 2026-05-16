
const polygon = {
  id: 137,
  name: 'Polygon',
  network: 'POL',
  nativeCurrency: {
    decimals: 18,
    name: 'POL',
    symbol: 'POL',
  },
  rpcUrls: {
    public: { http: ["https://polygon.drpc.org/"] },
    default: { http: ["https://polygon.drpc.org/"] },
  },
  blockExplorers: {
    etherscan: { name: 'POL', url: 'https://polygonscan.com/' },
    default: { name: 'POL', url: 'https://polygonscan.com/' },
  },

}
export default polygon;