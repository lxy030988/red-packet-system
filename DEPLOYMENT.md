# 红包系统 & 数据上链项目 - 完整部署指南

这是一个完整的 Web3 应用，包含周六和周日的作业要求。

## 项目结构

```
red-packet-system/
├── contracts/              # Solidity 智能合约
│   ├── DataStorage.sol    # 数据上链合约
│   └── RedPacket.sol      # 红包系统合约
├── src/
│   ├── components/        # React 组件
│   │   ├── WalletHeader.tsx         # 钱包连接头部（含 ENS Name）
│   │   ├── DirectTransfer.tsx       # 直接转账
│   │   ├── ReadChainData.tsx        # 读取链上数据（Infura/Alchemy）
│   │   ├── DataStorageContract.tsx  # 合约日志方式存储
│   │   └── RedPacketSystem.tsx      # 红包系统
│   ├── contracts/         # 合约 ABI 和地址配置
│   │   ├── DataStorage.ts
│   │   └── RedPacket.ts
│   ├── wagmi.config.ts   # Wagmi 配置
│   ├── App.tsx           # 主应用
│   └── main.tsx          # 入口文件
└── README.md
```

## 功能清单

### 周六作业：数据上链（2种方式）

✅ **1. 直接转账方式**
- 使用 Wagmi 直接发送 ETH 转账
- 交易记录自动上链

✅ **1-1. 使用 Ethers.js 读取链上数据**
- 支持 Infura API
- 支持 Alchemy API
- 读取区块号和账户余额

✅ **2. 合约日志方式写入数据**
- 部署 DataStorage.sol 合约
- 通过事件日志记录数据
- 实时监听事件

✅ **2-1. The Graph 集成说明**
- 界面中包含 The Graph 使用指南
- 可配置子图索引事件日志

### 周日作业：红包系统

✅ **1. 钱包组件**
- RainbowKit 钱包连接
- 显示 ENS Name 和头像
- 账户地址显示

✅ **2. 红包合约**
- 创建红包（支持随机/平均分配）
- 抢红包功能
- 防止重复领取

✅ **3. 前端界面**
- 发红包界面
- 抢红包界面
- 红包列表展示

✅ **4. 事件监听**
- 红包创建提醒
- 红包领取提醒
- 红包抢完提醒
- 已领取提醒

✅ **5. 部署到测试链**
- 支持多链（Sepolia、Base、Arbitrum等）
- 完整部署文档

## 快速开始

### 1. 安装依赖

```bash
cd /Users/lxy/Desktop/lxy030988/red-packet-system
pnpm install
```

### 2. 配置 WalletConnect Project ID

1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 注册账号并创建新项目
3. 获取 Project ID
4. 修改 `src/wagmi.config.ts`

```typescript
export const config = getDefaultConfig({
  appName: 'Red Packet System',
  projectId: 'YOUR_PROJECT_ID', // 替换这里！
  chains: [...],
});
```

### 3. 启动开发服务器

```bash
pnpm dev
```

浏览器访问：http://localhost:5173

## 合约部署详细步骤

### 方式一：使用 Remix（推荐新手）

#### 1. 打开 Remix IDE
访问 https://remix.ethereum.org/

#### 2. 创建合约文件

在 Remix 左侧文件浏览器中：
- 创建新文件：`DataStorage.sol`
- 创建新文件：`RedPacket.sol`
- 复制项目 `contracts/` 目录下的对应代码

#### 3. 编译合约

1. 点击左侧 "Solidity Compiler" 图标
2. 选择编译器版本：`0.8.20` 或更高
3. 点击 "Compile DataStorage.sol" 和 "Compile RedPacket.sol"
4. 确保编译成功（绿色勾）

#### 4. 部署到测试链

1. **准备钱包**
   - 安装 MetaMask 扩展
   - 切换到 Sepolia 测试网
   - 获取测试币（见下文）

2. **在 Remix 中部署**
   - 点击左侧 "Deploy & Run Transactions" 图标
   - Environment 选择：`Injected Provider - MetaMask`
   - 确认 MetaMask 连接
   - 选择要部署的合约：`DataStorage` 或 `RedPacket`
   - 点击 "Deploy" 按钮
   - 在 MetaMask 中确认交易

3. **获取合约地址**
   - 部署成功后，在 "Deployed Contracts" 中看到合约
   - 点击复制合约地址

#### 5. 验证合约（推荐）

1. 在 Remix 中右键点击已部署的合约
2. 选择 "Verify Contract"
3. 或访问 https://sepolia.etherscan.io/
4. 找到你的合约地址，点击 "Verify and Publish"

#### 6. 更新前端配置

编辑以下文件，填入部署的合约地址：

**src/contracts/DataStorage.ts**
```typescript
export const DATA_STORAGE_ADDRESS = '0xYourDataStorageAddress';
```

**src/contracts/RedPacket.ts**
```typescript
export const RED_PACKET_ADDRESS = '0xYourRedPacketAddress';
```

### 方式二：使用 Hardhat

#### 1. 安装 Hardhat

```bash
cd /Users/lxy/Desktop/lxy030988/red-packet-system
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

选择：`Create a TypeScript project`

#### 2. 配置 hardhat.config.ts

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
```

#### 3. 创建 .env 文件

```bash
# .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **重要：将 .env 添加到 .gitignore，不要提交私钥！**

#### 4. 创建部署脚本

**scripts/deploy.ts**
```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("开始部署合约...");

  // 部署 DataStorage
  console.log("\n部署 DataStorage 合约...");
  const DataStorage = await ethers.getContractFactory("DataStorage");
  const dataStorage = await DataStorage.deploy();
  await dataStorage.waitForDeployment();
  const dataStorageAddress = await dataStorage.getAddress();
  console.log("✅ DataStorage 部署成功:", dataStorageAddress);

  // 部署 RedPacket
  console.log("\n部署 RedPacket 合约...");
  const RedPacket = await ethers.getContractFactory("RedPacket");
  const redPacket = await RedPacket.deploy();
  await redPacket.waitForDeployment();
  const redPacketAddress = await redPacket.getAddress();
  console.log("✅ RedPacket 部署成功:", redPacketAddress);

  console.log("\n=== 部署完成 ===");
  console.log("DataStorage 地址:", dataStorageAddress);
  console.log("RedPacket 地址:", redPacketAddress);
  console.log("\n请将这些地址更新到前端配置文件中！");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

#### 5. 部署合约

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

#### 6. 验证合约

```bash
# 验证 DataStorage
npx hardhat verify --network sepolia YOUR_DATASTORAGE_ADDRESS

# 验证 RedPacket
npx hardhat verify --network sepolia YOUR_REDPACKET_ADDRESS
```

### 方式三：使用 Foundry

#### 1. 安装 Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### 2. 初始化项目

```bash
cd /Users/lxy/Desktop/lxy030988/red-packet-system
forge init --no-git foundry-contracts
cd foundry-contracts
```

#### 3. 复制合约

```bash
cp ../contracts/*.sol src/
```

#### 4. 部署合约

```bash
# 部署 DataStorage
forge create --rpc-url https://sepolia.infura.io/v3/YOUR_INFURA_KEY \
  --private-key YOUR_PRIVATE_KEY \
  src/DataStorage.sol:DataStorage

# 部署 RedPacket
forge create --rpc-url https://sepolia.infura.io/v3/YOUR_INFURA_KEY \
  --private-key YOUR_PRIVATE_KEY \
  src/RedPacket.sol:RedPacket
```

#### 5. 验证合约

```bash
forge verify-contract \
  --chain-id 11155111 \
  --compiler-version v0.8.20 \
  YOUR_CONTRACT_ADDRESS \
  src/DataStorage.sol:DataStorage \
  YOUR_ETHERSCAN_API_KEY
```

## 测试网络配置

### Sepolia 测试网（推荐）

- **网络名称**: Sepolia
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY
- **Chain ID**: 11155111
- **货币符号**: ETH
- **区块浏览器**: https://sepolia.etherscan.io/

### 在 MetaMask 中添加 Sepolia

1. 打开 MetaMask
2. 点击顶部网络下拉菜单
3. 点击 "添加网络"
4. 填入上述信息
5. 保存

### 获取测试币

#### Sepolia Faucet

1. **Alchemy Faucet** (推荐)
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - 需要注册 Alchemy 账号
   - 每24小时可领取一次

2. **Infura Faucet**
   - https://www.infura.io/faucet/sepolia
   - 需要注册 Infura 账号

3. **QuickNode Faucet**
   - https://faucet.quicknode.com/ethereum/sepolia

4. **其他 Faucet**
   - https://sepoliafaucet.com/
   - https://sepolia-faucet.pk910.de/

#### 其他测试网

- **Base Sepolia**: https://www.coinbase.com/faucets
- **Arbitrum Sepolia**: https://faucet.quicknode.com/arbitrum/sepolia
- **Optimism Sepolia**: https://faucet.quicknode.com/optimism/sepolia

## 配置详细说明

### 1. WalletConnect Project ID

**必须配置！** 否则钱包无法连接。

1. 访问 https://cloud.walletconnect.com/
2. 点击 "Sign Up" 注册账号
3. 登录后点击 "Create New Project"
4. 填写项目名称：`Red Packet System`
5. 复制 Project ID
6. 修改 `src/wagmi.config.ts` 文件

### 2. Infura API Key（可选）

用于周六作业的数据读取功能。

1. 访问 https://www.infura.io/zh
2. 注册并登录
3. 创建新项目
4. 获取 API Key
5. 在前端界面中输入使用

### 3. Alchemy API Key（可选）

用于周六作业的数据读取功能。

1. 访问 https://www.alchemy.com
2. 注册并登录
3. 创建新 App
4. 选择 Sepolia 网络
5. 获取 API Key
6. 在前端界面中输入使用

### 4. The Graph 子图配置（可选）

用于索引和查询事件日志。

#### 安装 Graph CLI

```bash
npm install -g @graphprotocol/graph-cli
```

#### 初始化子图

```bash
graph init --product subgraph-studio
```

#### 配置 schema.graphql

```graphql
type DataWritten @entity {
  id: ID!
  sender: Bytes!
  content: String!
  value: BigInt!
  timestamp: BigInt!
  dataId: BigInt!
  transactionHash: Bytes!
}

type PacketCreated @entity {
  id: ID!
  packetId: BigInt!
  creator: Bytes!
  totalAmount: BigInt!
  count: BigInt!
  isRandom: Boolean!
  timestamp: BigInt!
  transactionHash: Bytes!
}

type PacketClaimed @entity {
  id: ID!
  packetId: BigInt!
  claimer: Bytes!
  amount: BigInt!
  timestamp: BigInt!
  transactionHash: Bytes!
}
```

#### 部署子图

```bash
graph auth --studio YOUR_DEPLOY_KEY
graph codegen && graph build
graph deploy --studio your-subgraph-name
```

## 开发说明

### 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **Web3 库**: Wagmi 3.x + Viem 2.x + Ethers.js 6
- **钱包连接**: RainbowKit 2.x
- **状态管理**: TanStack Query (React Query)
- **智能合约**: Solidity 0.8.20
- **包管理器**: pnpm

### 项目特色

1. ✅ 完整的钱包连接（支持 MetaMask、WalletConnect、Coinbase 等）
2. ✅ ENS Name 和头像自动显示
3. ✅ 实时事件监听（WebSocket）
4. ✅ 友好的错误提示和状态反馈
5. ✅ 响应式设计（支持移动端）
6. ✅ TypeScript 完全类型安全
7. ✅ 模块化组件设计
8. ✅ 多链支持

### 合约安全特性

#### RedPacket.sol

- ✅ 防止重复领取（mapping 记录）
- ✅ 红包状态完整检查
- ✅ 精确的金额计算（避免溢出）
- ✅ 完整的事件日志
- ✅ 随机数生成（可升级为 Chainlink VRF）

#### DataStorage.sol

- ✅ 数据持久化存储
- ✅ 完整的事件日志
- ✅ 余额查询功能
- ✅ 支持附带转账

## 常见问题解决

### 1. MetaMask 连接失败

**问题**：点击连接钱包没有反应

**解决方案**：
- ✅ 确保已安装 MetaMask 扩展
- ✅ 检查 WalletConnect Project ID 是否配置正确
- ✅ 刷新页面重试
- ✅ 清除浏览器缓存
- ✅ 检查浏览器控制台错误信息

### 2. 交易失败

**问题**：发送交易后失败

**解决方案**：
- ✅ 检查账户是否有足够的测试币（至少 0.01 ETH）
- ✅ 确认合约地址配置正确
- ✅ 检查网络是否正确（Sepolia）
- ✅ 查看 MetaMask 错误详情
- ✅ 提高 Gas Limit（如果需要）

### 3. 合约未部署提示

**问题**：界面显示 "请先部署合约"

**解决方案**：
- ✅ 确认已部署合约到测试网
- ✅ 检查 `src/contracts/*.ts` 文件中的地址配置
- ✅ 确认地址格式正确（0x 开头）
- ✅ 确认网络选择正确

### 4. 事件监听不工作

**问题**：看不到实时通知

**解决方案**：
- ✅ 确保钱包已连接
- ✅ 检查合约地址和 ABI 配置
- ✅ 查看浏览器控制台错误
- ✅ 确认使用的 RPC 支持 WebSocket
- ✅ 刷新页面重新连接

### 5. Vite 开发服务器无法启动

**问题**：运行 `pnpm dev` 报错

**解决方案**：
```bash
# 清除缓存
rm -rf node_modules .pnpm-store
pnpm install

# 检查端口占用
lsof -i :5173
kill -9 <PID>

# 重新启动
pnpm dev
```

### 6. 红包金额计算错误

**问题**：领取的红包金额不对

**说明**：这是正常的！
- 随机红包：每个红包金额随机
- 平均红包：由于精度问题可能有微小差异
- 最后一个红包会获得剩余全部金额

## 部署检查清单

使用前请确保：

- [ ] 已安装所有依赖 (`pnpm install`)
- [ ] 已配置 WalletConnect Project ID
- [ ] 已获取测试币（至少 0.01 ETH）
- [ ] 已部署 DataStorage 合约
- [ ] 已部署 RedPacket 合约
- [ ] 已更新前端合约地址配置
- [ ] 已验证合约（推荐）
- [ ] 已测试钱包连接
- [ ] 已测试所有功能
- [ ] 已检查事件监听

## 作业要求完成情况

### 周六作业 ✅

- [x] 1. 直接转账方式数据上链
- [x] 1-1. 使用 Ethers.js + Infura 读取数据
- [x] 1-1. 使用 Ethers.js + Alchemy 读取数据
- [x] 2. 合约日志方式写入数据
- [x] 2-1. The Graph 使用说明
- [x] 完整的钱包操作界面（右上角）
- [x] 支持 web3-react / Wagmi / RainbowKit

### 周日作业 ✅

- [x] 1. 钱包组件展示（切换 + 地址 + ENS Name）
- [x] 2. 红包合约实现（可默写）
- [x] 3. 发红包前端界面
- [x] 3. 抢红包前端界面
- [x] 4. 事件友好提示（红包抢完、已抢过）
- [x] 5. 支持部署到测试链
- [x] 5. 合约开源说明

## 技术亮点

1. **完整的 Web3 技术栈**
   - Wagmi 3.x（最新版本）
   - Viem 2.x（高性能以太坊库）
   - RainbowKit（美观的钱包连接）

2. **智能合约设计**
   - 完整的事件日志
   - 安全的状态管理
   - Gas 优化

3. **前端工程化**
   - TypeScript 类型安全
   - 组件化设计
   - 响应式布局

4. **用户体验**
   - 实时事件监听
   - 友好的错误提示
   - 清晰的状态反馈

## 扩展功能建议

1. **红包系统增强**
   - [ ] 添加红包口令功能
   - [ ] 支持 ERC20 代币红包
   - [ ] 红包过期自动退款
   - [ ] 红包记录查询页面

2. **数据存储增强**
   - [ ] 支持文件上传（IPFS）
   - [ ] 数据加密存储
   - [ ] 数据访问权限控制

3. **UI/UX 优化**
   - [ ] 添加动画效果
   - [ ] 深色模式支持
   - [ ] 多语言支持
   - [ ] 移动端优化

## 参考资源

- **Wagmi 文档**: https://wagmi.sh/
- **RainbowKit 文档**: https://www.rainbowkit.com/
- **Viem 文档**: https://viem.sh/
- **Solidity 文档**: https://docs.soliditylang.org/
- **Remix IDE**: https://remix.ethereum.org/
- **Etherscan**: https://sepolia.etherscan.io/
- **The Graph**: https://thegraph.com/docs/

## 联系和支持

如有问题，请检查：
1. 浏览器控制台错误信息
2. MetaMask 交易详情
3. Etherscan 区块浏览器

## 许可证

MIT License