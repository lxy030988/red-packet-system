import { http, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(), // MetaMask 和其他注入式钱包
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
