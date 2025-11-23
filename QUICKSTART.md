# 快速开始指南

## 立即体验项目（5 分钟）

### 步骤 1: 启动项目

```bash
cd /Users/lxy/Desktop/lxy030988/red-packet-system
pnpm dev
```

浏览器访问：http://localhost:5173

### 步骤 2: 连接钱包

1. 点击右上角 "Connect Wallet" 按钮
2. 选择 MetaMask（或其他钱包）
3. 在钱包中确认连接
4. 连接成功后会显示你的地址和 ENS Name（如果有）

**注意**：如果钱包连接没反应，项目已配置临时 Project ID，应该可以正常使用。如需长期使用，请获取自己的 Project ID（见下文）。

### 步骤 3: 切换到测试网

在 MetaMask 中：

1. 点击顶部网络下拉菜单
2. 启用 "显示测试网络"
3. 选择 "Sepolia" 测试网

每次可获取 0.1-0.5 ETH 测试币。

### 步骤 5: 体验周六作业功能

点击 "周六作业：数据上链" 标签页：

1. **直接转账**

   - 输入接收地址（可以是你的另一个地址）
   - 输入金额（如 0.001）
   - 点击发送转账
   - 在 MetaMask 中确认

2. **读取链上数据**

   - 选择 Infura 或 Alchemy
   - 输入 API Key（见下文如何获取）
   - 输入要查询的地址
   - 点击读取数据

3. **合约方式存储**（需要先部署合约）
   - 输入要存储的内容
   - 可选择附带转账金额
   - 点击写入数据
   - 查看事件监听的实时反馈

### 步骤 6: 体验周日作业功能

点击 "周日作业：红包系统" 标签页：

1. **发红包**（需要先部署合约）

   - 输入总金额（如 0.01）
   - 输入红包数量（如 3）
   - 选择随机或平均分配
   - 点击发红包
   - 在 MetaMask 中确认

2. **抢红包**
   - 输入红包 ID（从 0 开始）
   - 点击抢红包
   - 查看实时通知

## 如何部署合约

### 最简单的方式：使用 Remix

1. **打开 Remix**

   - 访问 https://remix.ethereum.org/

2. **创建合约文件**

   - 点击左侧 "文件浏览器"
   - 创建新文件：`RedPacket.sol`
   - 复制 `contracts/RedPacket.sol` 的内容
   - 再创建 `DataStorage.sol`，复制对应内容

3. **编译合约**

   - 点击左侧 "Solidity 编译器" 图标
   - 选择版本 0.8.20
   - 点击 "Compile RedPacket.sol"
   - 确保编译成功（绿色勾）

4. **部署合约**

   - 点击左侧 "部署和运行交易" 图标
   - Environment 选择 "Injected Provider - MetaMask"
   - 确认 MetaMask 连接到 Sepolia
   - 选择合约 "RedPacket"
   - 点击 "Deploy"
   - 在 MetaMask 中确认交易

5. **复制合约地址**

   - 部署成功后，在 "Deployed Contracts" 看到合约
   - 点击复制图标，复制地址
   - 地址格式：0x1234567890abcdef...

6. **更新前端配置**

   - 打开 `src/contracts/RedPacket.ts`
   - 找到 `export const RED_PACKET_ADDRESS = '0x...';`
   - 将 `'0x...'` 替换为你复制的合约地址
   - 保存文件

7. **对 DataStorage 重复上述步骤**

   - 部署 DataStorage.sol
   - 更新 `src/contracts/DataStorage.ts` 中的地址

8. **刷新浏览器**
   - 现在可以正常使用所有功能了！

## 如何获取 API Keys

### Infura API Key（免费）

1. 访问 https://www.infura.io/zh
2. 点击 "开始免费使用" 注册
3. 验证邮箱后登录
4. 点击 "创建新密钥"
5. 选择产品："Ethereum" 或 "Web3 API"
6. 输入项目名称：Red Packet System
7. 复制 API Key（一串字母数字）
8. 在前端界面输入使用

### Alchemy API Key（免费）

1. 访问 https://www.alchemy.com
2. 点击 "Sign Up" 注册
3. 验证邮箱后登录
4. 点击 "Create New App"
5. 选择链：Ethereum
6. 选择网络：Sepolia
7. 输入名称：Red Packet System
8. 点击 "View Key"
9. 复制 API Key
10. 在前端界面输入使用

### WalletConnect Project ID（可选但推荐）

如果想使用自己的 Project ID：

1. 访问 https://cloud.walletconnect.com/
2. 点击 "Sign Up" 注册
3. 验证邮箱后登录
4. 点击 "Create New Project"
5. 输入项目名称：Red Packet System
6. 复制 Project ID
7. 修改 `src/wagmi.config.ts` 中的 projectId
8. 保存并刷新浏览器

## 常见问题快速解决

### ❌ 钱包连接按钮没反应

**原因**：浏览器没有安装 MetaMask

**解决**：

1. 访问 https://metamask.io/
2. 下载并安装 MetaMask 扩展
3. 创建或导入钱包
4. 刷新页面重试

### ❌ 点击连接后没弹出 MetaMask

**原因**：MetaMask 被浏览器拦截

**解决**：

1. 查看浏览器地址栏右侧是否有弹窗拦截提示
2. 点击允许弹窗
3. 或直接点击 MetaMask 扩展图标
4. 手动确认连接

### ❌ 交易失败："insufficient funds"

**原因**：账户余额不足

**解决**：

1. 访问水龙头获取测试币
2. 等待几分钟到账
3. 在 MetaMask 中查看余额
4. 重新发起交易

### ❌ "请先部署合约"提示

**原因**：合约还没部署，或地址配置错误

**解决**：

1. 按照上面步骤部署合约
2. 检查 `src/contracts/*.ts` 文件中的地址
3. 确保地址不是 `'0x...'`
4. 刷新页面

### ❌ 读取数据失败

**原因**：API Key 无效或网络问题

**解决**：

1. 检查 API Key 是否正确复制
2. 确认选择的 Provider 与 API Key 匹配
3. 检查网络连接
4. 尝试切换 Provider（Infura ↔ Alchemy）

### ❌ 事件监听没反应

**原因**：合约地址未配置或网络不匹配

**解决**：

1. 确认合约已部署
2. 检查合约地址配置
3. 确认钱包连接到正确的网络
4. 刷新页面重新连接

## 验证合约（推荐）

验证合约可以让别人在区块链浏览器上看到源代码。

### 在 Remix 中验证

1. 右键点击已部署的合约
2. 选择 "Verify Contract"
3. 按提示操作

### 在 Etherscan 中验证

1. 访问 https://sepolia.etherscan.io/
2. 搜索你的合约地址
3. 点击 "Contract" 标签
4. 点击 "Verify and Publish"
5. 填写信息：
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.20
   - License: MIT
6. 粘贴合约源代码
7. 点击 "Verify and Publish"

## 下一步

- 📖 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解完整部署文档
- 🔍 查看 [contracts/](./contracts/) 目录学习合约代码
- 💻 查看 [src/components/](./src/components/) 目录学习前端代码
- 🎓 阅读代码注释理解实现原理

## 项目特色功能

- ✅ 完整的钱包连接（支持 10+种钱包）
- ✅ 自动显示 ENS Name 和头像
- ✅ 实时事件监听和通知
- ✅ 支持随机和平均红包
- ✅ 防止重复领取红包
- ✅ 友好的错误提示
- ✅ 支持多链切换
- ✅ TypeScript 类型安全
- ✅ 响应式设计

## 需要帮助？

1. 查看浏览器控制台（F12）的错误信息
2. 查看 MetaMask 中的交易详情
3. 在 Etherscan 上查看交易状态
4. 阅读完整文档 [DEPLOYMENT.md](./DEPLOYMENT.md)

祝你使用愉快！🎉
