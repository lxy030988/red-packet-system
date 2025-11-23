# 🎁 红包系统 & 数据上链项目

一个完整的 Web3 全栈项目，包含智能合约开发、前端开发、钱包集成等核心功能。

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636)
![Wagmi](https://img.shields.io/badge/Wagmi-3.x-purple)

## 📋 项目概述

本项目实现了两大核心功能：

### 周六作业：数据上链（2种方式）

1. **直接转账方式**
   - 使用 Wagmi 发送 ETH 转账
   - 交易自动记录在链上

2. **使用 Ethers.js 读取链上数据**
   - 支持 Infura API
   - 支持 Alchemy API
   - 读取区块号、账户余额

3. **合约日志方式存储数据**
   - 部署 DataStorage 合约
   - 通过事件日志记录数据
   - 支持 The Graph 子图索引

### 周日作业：链上红包系统

1. **完整的钱包组件**
   - 使用 RainbowKit 连接钱包
   - 自动显示 ENS Name 和头像
   - 支持多种钱包（MetaMask、WalletConnect 等）

2. **红包智能合约**
   - 创建红包（随机/平均分配）
   - 抢红包功能
   - 防止重复领取
   - 完整的事件日志

3. **精美的前端界面**
   - 发红包界面
   - 抢红包界面
   - 红包列表展示
   - 实时统计信息

4. **友好的事件提示**
   - 红包创建通知
   - 红包领取通知
   - 红包抢完提醒
   - 重复领取提醒

## 🚀 快速开始

### 1. 安装依赖

```bash
cd /Users/lxy/Desktop/lxy030988/red-packet-system
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

### 3. 连接钱包并体验

详细步骤请查看 [快速开始指南](./QUICKSTART.md)

## 📁 项目结构

```
red-packet-system/
├── contracts/                    # 智能合约
│   ├── DataStorage.sol          # 数据存储合约
│   └── RedPacket.sol            # 红包合约
│
├── src/
│   ├── components/              # React 组件
│   │   ├── WalletHeader.tsx    # 钱包头部组件
│   │   ├── DirectTransfer.tsx  # 直接转账组件
│   │   ├── ReadChainData.tsx   # 读取链上数据组件
│   │   ├── DataStorageContract.tsx  # 数据存储合约组件
│   │   └── RedPacketSystem.tsx # 红包系统组件
│   │
│   ├── contracts/               # 合约配置
│   │   ├── DataStorage.ts      # DataStorage ABI 和地址
│   │   └── RedPacket.ts        # RedPacket ABI 和地址
│   │
│   ├── wagmi.config.ts         # Wagmi 配置
│   ├── App.tsx                 # 主应用
│   └── main.tsx                # 入口文件
│
├── QUICKSTART.md               # 快速开始指南
├── DEPLOYMENT.md               # 完整部署文档
└── README.md                   # 本文件
```

## 🛠️ 技术栈

### 前端
- **React 19** - 最新版本的 React
- **TypeScript** - 类型安全
- **Vite 7** - 极速构建工具
- **Wagmi 3.x** - React Hooks for Ethereum
- **Viem 2.x** - 高性能以太坊库
- **RainbowKit** - 美观的钱包连接 UI
- **Ethers.js 6** - 以太坊 JavaScript 库
- **TanStack Query** - 数据获取和缓存

### 智能合约
- **Solidity 0.8.20** - 智能合约语言
- **Hardhat** (可选) - 开发环境
- **Foundry** (可选) - 测试框架

### 部署
- **Remix** - 在线 IDE（推荐新手）
- **Sepolia** - 测试网络
- **Etherscan** - 区块浏览器

## ✨ 核心功能

### 钱包集成
- ✅ 支持 MetaMask、WalletConnect、Coinbase Wallet 等
- ✅ 自动显示 ENS Name 和头像
- ✅ 多链支持（Sepolia、Mainnet、Polygon 等）
- ✅ 网络切换提示

### 数据上链
- ✅ 直接转账方式
- ✅ 使用 Infura/Alchemy 读取数据
- ✅ 合约事件日志存储
- ✅ 实时事件监听
- ✅ The Graph 子图支持

### 红包系统
- ✅ 创建红包（随机/平均）
- ✅ 抢红包
- ✅ 防重复领取
- ✅ 实时通知
- ✅ 红包列表
- ✅ 进度展示

### 用户体验
- ✅ 友好的错误提示
- ✅ 交易状态实时反馈
- ✅ 响应式设计
- ✅ 清晰的状态显示

## 📝 合约说明

### RedPacket.sol - 红包合约

**主要功能：**
- `createPacket(count, isRandom)` - 创建红包
- `claimPacket(packetId)` - 领取红包
- `getPacketInfo(packetId)` - 查询红包信息
- `hasClaimed(packetId, user)` - 检查是否已领取

**安全特性：**
- ✅ 防止重复领取
- ✅ 金额精确计算
- ✅ 完整的状态检查
- ✅ 详细的事件日志

### DataStorage.sol - 数据存储合约

**主要功能：**
- `writeData(content)` - 写入数据
- `directTransfer()` - 直接转账
- `getDataByIndex(index)` - 读取数据
- `getAllDataCount()` - 获取数据总数

**特性：**
- ✅ 支持附带转账
- ✅ 完整的事件日志
- ✅ 数据持久化存储
- ✅ 余额查询

## 📖 文档

- [快速开始指南](./QUICKSTART.md) - 5分钟上手
- [完整部署文档](./DEPLOYMENT.md) - 详细部署步骤
- [合约代码](./contracts/) - Solidity 源码
- [前端组件](./src/components/) - React 组件

## 🎯 作业完成情况

### 周六作业 ✅
- [x] 直接转账方式数据上链
- [x] 使用 Ethers.js + Infura 读取数据
- [x] 使用 Ethers.js + Alchemy 读取数据
- [x] 合约日志方式写入数据
- [x] The Graph 集成说明
- [x] 钱包操作界面（右上角）

### 周日作业 ✅
- [x] 钱包组件（切换 + 地址 + ENS Name）
- [x] 红包合约实现
- [x] 发红包 + 抢红包界面
- [x] 事件友好提示
- [x] 支持部署到测试链
- [x] 合约开源说明

## 🔧 开发指南

### 安装新依赖

```bash
pnpm add package-name
```

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

### 部署合约

请参考 [DEPLOYMENT.md](./DEPLOYMENT.md) 中的详细步骤。

## 🌐 支持的网络

- Ethereum Mainnet
- Sepolia Testnet (推荐)
- Polygon
- Optimism
- Arbitrum
- Base

## 🎨 界面预览

项目包含两个主要标签页：

1. **周六作业：数据上链**
   - 直接转账表单
   - 读取链上数据表单
   - 合约数据存储表单
   - 实时事件监听

2. **周日作业：红包系统**
   - 发红包表单
   - 抢红包表单
   - 红包统计卡片
   - 红包列表展示
   - 实时通知面板

## 🚨 常见问题

### 钱包连接问题
**问题**：点击连接钱包没反应
**解决**：
1. 确保已安装 MetaMask
2. 项目已配置临时 Project ID
3. 刷新页面重试

详细问题解决请查看 [QUICKSTART.md](./QUICKSTART.md) 的常见问题部分。

## 📦 依赖说明

### 核心依赖
```json
{
  "react": "^19.2.0",
  "wagmi": "^3.0.1",
  "viem": "^2.39.3",
  "@rainbow-me/rainbowkit": "^2.2.9",
  "ethers": "^6.15.0",
  "@tanstack/react-query": "^5.90.10"
}
```

### 开发依赖
```json
{
  "typescript": "^5.9.3",
  "vite": "^7.2.4",
  "@vitejs/plugin-react": "^5.1.1"
}
```

## 🎓 学习资源

- [Wagmi 文档](https://wagmi.sh/)
- [RainbowKit 文档](https://www.rainbowkit.com/)
- [Viem 文档](https://viem.sh/)
- [Solidity 文档](https://docs.soliditylang.org/)
- [React 文档](https://react.dev/)
- [The Graph 文档](https://thegraph.com/docs/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

Web3 学习项目

---

**提示**：这是一个学习项目，合约未经过安全审计，请勿在主网使用真实资金！