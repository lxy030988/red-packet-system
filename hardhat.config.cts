import { HardhatUserConfig } from 'hardhat/config'
import '@typechain/hardhat'

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  typechain: {
    outDir: 'typechain', // 生成的类型存放目录
    target: 'ethers-v6' // 使用 ethers v6 生成类型
  }
}

export default config
