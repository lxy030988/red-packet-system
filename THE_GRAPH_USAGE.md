# The Graph 使用指南

## 📊 什么是 The Graph？

The Graph 是一个用于索引和查询区块链数据的去中心化协议。简单来说，它可以把区块链上的事件日志转换成易于查询的数据库。

### 为什么需要 The Graph？

**问题：** 直接从区块链读取历史数据很慢

- 需要遍历所有区块
- 过滤事件效率低
- 每次查询都要重新扫描

**解决：** The Graph 预先索引数据

- 自动监听合约事件
- 建立索引数据库
- 使用 GraphQL 快速查询

## 🎯 本项目的 The Graph 配置

### 子图信息

- **端点**: `https://api.studio.thegraph.com/query/1715930/write-contract-test/v0.0.1`
- **Deploy Key**: `ae0e7b590cc0b1126731debef719bd2c`
- **合约地址**: `0x05D91507E12D790B71bdc34e85745Db2f2826371`
- **网络**: Sepolia 测试网

### 索引的事件

本子图索引了 DataStorage 合约的两个事件：

1. **DataWritten** - 数据写入事件
   - sender: 发送者地址
   - content: 存储的内容
   - value: 附带的金额
   - timestamp: 时间戳
   - dataId: 数据ID

2. **DirectTransfer** - 直接转账事件
   - from: 发送方地址
   - to: 接收方地址
   - amount: 转账金额
   - timestamp: 时间戳

## 💻 如何使用

### 方式1：使用组件（已集成）

在项目中已经集成了 `TheGraphQuery` 组件：

1. 启动项目：`pnpm dev`
2. 访问 http://localhost:5173
3. 点击"周六作业：数据上链"标签
4. 滚动到最下方，找到"The Graph 数据查询"区域
5. 点击"查询所有数据"按钮

### 方式2：直接使用 GraphQL API

#### 使用 cURL

```bash
curl -X POST \
  https://api.studio.thegraph.com/query/1715930/write-contract-test/v0.0.1 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ dataWrittens(first: 5) { id sender content value timestamp } }"
  }'
```

#### 使用 JavaScript/TypeScript

```typescript
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
`;

const response = await fetch(
  'https://api.studio.thegraph.com/query/1715930/write-contract-test/v0.0.1',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  }
);

const result = await response.json();
console.log(result.data);
```

## 📝 GraphQL 查询示例

### 1. 查询最新的 5 条数据写入事件

```graphql
query {
  dataWrittens(first: 5, orderBy: timestamp, orderDirection: desc) {
    id
    sender
    content
    value
    timestamp
    dataId
  }
}
```

### 2. 查询特定地址的数据

```graphql
query {
  dataWrittens(where: { sender: "0x你的地址" }) {
    id
    sender
    content
    value
    timestamp
  }
}
```

### 3. 查询金额大于 0 的数据

```graphql
query {
  dataWrittens(where: { value_gt: "0" }) {
    id
    sender
    content
    value
    timestamp
  }
}
```

### 4. 查询直接转账事件

```graphql
query {
  directTransfers(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    from
    to
    amount
    timestamp
  }
}
```

### 5. 分页查询

```graphql
query {
  dataWrittens(
    first: 10
    skip: 0
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    sender
    content
    timestamp
  }
}
```

### 6. 组合查询

```graphql
query {
  dataWrittens(first: 5) {
    id
    sender
    content
    value
  }
  directTransfers(first: 5) {
    id
    from
    to
    amount
  }
}
```

## 🔧 高级用法

### 1. 过滤器 (where)

```graphql
# 按发送者过滤
dataWrittens(where: { sender: "0xABC..." })

# 按金额过滤
dataWrittens(where: { value_gt: "1000000000000000000" }) # > 1 ETH

# 按时间过滤
dataWrittens(where: { timestamp_gt: "1700000000" })

# 组合条件
dataWrittens(where: {
  sender: "0xABC..."
  value_gt: "0"
})
```

### 2. 排序 (orderBy, orderDirection)

```graphql
# 按时间降序
dataWrittens(orderBy: timestamp, orderDirection: desc)

# 按金额升序
dataWrittens(orderBy: value, orderDirection: asc)
```

### 3. 分页 (first, skip)

```graphql
# 第一页（0-10）
dataWrittens(first: 10, skip: 0)

# 第二页（10-20）
dataWrittens(first: 10, skip: 10)

# 第三页（20-30）
dataWrittens(first: 10, skip: 20)
```

## 🌐 在线 GraphQL Playground

访问子图的 GraphQL Playground：

https://api.studio.thegraph.com/query/1715930/write-contract-test/v0.0.1

在这里你可以：
- 交互式编写查询
- 查看自动完成提示
- 测试不同的查询
- 查看返回结果

## 📊 数据格式说明

### DataWritten 事件

```json
{
  "id": "0x交易哈希-日志索引",
  "sender": "0x发送者地址",
  "content": "存储的字符串内容",
  "value": "1000000000000000000", // Wei 单位，需要除以 10^18
  "timestamp": "1700000000", // Unix 时间戳（秒）
  "dataId": "0" // 数据ID
}
```

### DirectTransfer 事件

```json
{
  "id": "0x交易哈希-日志索引",
  "from": "0x发送方地址",
  "to": "0x接收方地址",
  "amount": "1000000000000000000", // Wei 单位
  "timestamp": "1700000000" // Unix 时间戳（秒）
}
```

## 💡 实际应用示例

### 示例 1：查询某个用户的所有操作

```typescript
const getUserData = async (userAddress: string) => {
  const query = `
    query {
      dataWrittens(where: { sender: "${userAddress}" }) {
        id
        content
        value
        timestamp
      }
    }
  `;

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  return response.json();
};
```

### 示例 2：统计总数据量

```typescript
const getTotalCount = async () => {
  const query = `
    query {
      dataWrittens {
        id
      }
    }
  `;

  const result = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const data = await result.json();
  return data.data.dataWrittens.length;
};
```

### 示例 3：React Hook 封装

```typescript
import { useState, useEffect } from 'react';

const useTheGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = `
        query {
          dataWrittens(first: 10) {
            id
            sender
            content
            value
            timestamp
          }
        }
      `;

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      setData(result.data.dataWrittens);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetchData };
};
```

## 🎓 对比：The Graph vs 直接读取

### 直接读取事件（慢）

```typescript
// 需要扫描所有区块
const filter = contract.filters.DataWritten();
const events = await contract.queryFilter(filter, 0, 'latest');
// 可能需要几分钟
```

### 使用 The Graph（快）

```typescript
// 立即返回结果
const query = `{ dataWrittens { id sender content } }`;
const result = await fetch(SUBGRAPH_URL, {
  method: 'POST',
  body: JSON.stringify({ query })
});
// 通常在 1 秒内完成
```

## 🔗 相关链接

- **The Graph 官网**: https://thegraph.com/
- **文档**: https://thegraph.com/docs/
- **Studio**: https://thegraph.com/studio/
- **GraphQL 学习**: https://graphql.org/learn/

## 📝 总结

The Graph 的优势：
- ✅ 快速查询历史数据
- ✅ 强大的过滤和排序
- ✅ 分页支持
- ✅ 实时更新
- ✅ 减少 RPC 调用

适用场景：
- 📊 显示历史交易记录
- 📈 数据统计和分析
- 🔍 搜索和过滤功能
- 📱 Dapp 前端数据展示

现在你可以在项目中体验 The Graph 的强大功能了！
