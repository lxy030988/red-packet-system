import { http, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(), // MetaMask 和其他注入式钱包
  ],
  transports: {
    // 使用 Alchemy 公共端点，更稳定
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/demo'),
    [mainnet.id]: http(),
  },
});
