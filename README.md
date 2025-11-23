# 合约 - 周六作业

## wagmi 使用

- 1.config 配置

```js
import { http, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected() // MetaMask 和其他注入式钱包
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http()
  }
})
```

- 2. WagmiProvider + QueryClientProvider

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi.config';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)

```

- 3.连接钱包

```js
const { connect } = useConnect()

const handleConnect = async () => {
  try {
    await connect({
      connector: injected(),
      chainId: sepolia.id // 默认连接到 Sepolia 测试链
    })
  } catch (error) {
    console.error('连接失败:', error)
  }
}
```

- 4.显示钱包地址

```js
const { address } = useAccount()
const { data: ensName } = useEnsName({ address, chainId: mainnet.id })
const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined, chainId: mainnet.id })
```

- 5.转账

```js
  const { data: hash, sendTransaction, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleTransfer = async () => {
    if (!toAddress || !amount) {
      alert('请输入地址和金额');
      return;
    }

    try {
      sendTransaction({
        to: toAddress as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (error) {
      console.error('转账失败:', error);
      alert('转账失败: ' + (error as Error).message);
    }
  };
```

## Infura Alchemy 使用

- 1.https://www.infura.io/zh 注册获取 API Key
- 2.使用

```js
let rpcUrl = ''
if (provider === 'infura') {
  rpcUrl = `https://sepolia.infura.io/v3/${apiKey}`
} else {
  rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`
}
const ethersProvider = new ethers.JsonRpcProvider(rpcUrl)
// 获取最新区块号
const currentBlock = await ethersProvider.getBlockNumber()
// 获取余额
const bal = await ethersProvider.getBalance(address)
```

## DataStorage 测试网 sepolia 合约地址

```
0x05D91507E12D790B71bdc34e85745Db2f2826371
```

## The Graph 子图查询

- **Playground**: https://thegraph.com/studio/subgraph/write-contract-test/playground/
- **查询端点**: https://api.studio.thegraph.com/query/1715930/write-contract-test/v0.0.1
- **Deploy Key**: ae0e7b590cc0b1126731debef719bd2c

### 快速查询示例

```js
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1715930/write-contract-test/v0.0.1'

// GraphQL 查询
const query = `
  query {
    dataWrittens(first: 5, orderBy: timestamp, orderDirection: desc) {
      id
      sender
      content
      value
      timestamp
      dataId
    }
    directTransfers(first: 5, orderBy: timestamp, orderDirection: desc) {
      id
      from
      to
      amount
      timestamp
    }
  }
`

// 发送请求
const response = await fetch(SUBGRAPH_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
})

const result = await response.json()
console.log(result.data)
```

# 合约 - 周日作业 红包系统

## RedPacket 红包合约地址

```
0x6Ee4af33A25320f03393b421CF3Ef101478423a6
```
