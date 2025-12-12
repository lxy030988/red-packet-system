import { defineConfig } from '@wagmi/cli'
import { Abi } from 'viem'

// 直接从 Hardhat artifacts 导入
import RedPacketArtifact from './artifacts/contracts/RedPacket.sol/RedPacket.json' assert { type: 'json' }

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'RedPacket',
      abi: RedPacketArtifact.abi as Abi,
      address: {
        // 本地测试网络
        31337: '0x6Ee4af33A25320f03393b421CF3Ef101478423a6'
      }
    }
  ],
  plugins: []
})
