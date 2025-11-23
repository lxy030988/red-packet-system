import { useState } from 'react';

// The Graph API 端点
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1715930/write-contract-test/v0.0.1';

// 数据类型定义
interface DataWritten {
  id: string;
  sender: string;
  content: string;
  value: string;
  timestamp: string;
  dataId: string;
}

interface DirectTransfer {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
}

export function TheGraphQuery() {
  const [dataWrittens, setDataWrittens] = useState<DataWritten[]>([]);
  const [directTransfers, setDirectTransfers] = useState<DirectTransfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 查询所有数据写入事件
  const fetchDataWrittens = async () => {
    setLoading(true);
    setError('');

    try {
      const query = `
        query {
          dataWrittens(first: 10, orderBy: timestamp, orderDirection: desc) {
            id
            sender
            content
            value
            timestamp
            dataId
          }
        }
      `;

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setDataWrittens(result.data.dataWrittens);
    } catch (err) {
      setError('查询失败: ' + (err as Error).message);
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 查询所有直接转账事件
  const fetchDirectTransfers = async () => {
    setLoading(true);
    setError('');

    try {
      const query = `
        query {
          directTransfers(first: 10, orderBy: timestamp, orderDirection: desc) {
            id
            from
            to
            amount
            timestamp
          }
        }
      `;

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setDirectTransfers(result.data.directTransfers);
    } catch (err) {
      setError('查询失败: ' + (err as Error).message);
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 查询所有数据
  const fetchAllData = async () => {
    setLoading(true);
    setError('');

    try {
      const query = `
        query {
          dataWrittens(first: 10, orderBy: timestamp, orderDirection: desc) {
            id
            sender
            content
            value
            timestamp
            dataId
          }
          directTransfers(first: 10, orderBy: timestamp, orderDirection: desc) {
            id
            from
            to
            amount
            timestamp
          }
        }
      `;

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setDataWrittens(result.data.dataWrittens);
      setDirectTransfers(result.data.directTransfers);
    } catch (err) {
      setError('查询失败: ' + (err as Error).message);
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString('zh-CN');
  };

  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 格式化金额
  const formatAmount = (value: string) => {
    const eth = parseFloat(value) / 1e18;
    return eth.toFixed(6);
  };

  return (
    <div style={styles.container}>
      <h2>周六作业2-1: The Graph 数据查询</h2>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
        通过 The Graph 子图查询链上事件数据
      </p>

      {/* 查询按钮 */}
      <div style={styles.buttonGroup}>
        <button
          onClick={fetchAllData}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: '#6f42c1',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? '查询中...' : '查询所有数据'}
        </button>
        <button
          onClick={fetchDataWrittens}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: '#007bff',
            opacity: loading ? 0.5 : 1,
          }}
        >
          查询数据写入事件
        </button>
        <button
          onClick={fetchDirectTransfers}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: '#28a745',
            opacity: loading ? 0.5 : 1,
          }}
        >
          查询直接转账事件
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div style={styles.errorBox}>
          ❌ {error}
        </div>
      )}

      {/* The Graph 信息 */}
      <div style={styles.infoBox}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
          子图信息
        </h3>
        <p style={{ margin: '0.25rem 0', fontSize: '0.75rem' }}>
          <strong>端点:</strong> {SUBGRAPH_URL}
        </p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.75rem' }}>
          <strong>状态:</strong> <span style={{ color: '#28a745' }}>✓ 已部署</span>
        </p>
      </div>

      {/* 数据写入事件列表 */}
      {dataWrittens.length > 0 && (
        <div style={styles.section}>
          <h3 style={{ margin: '0 0 1rem 0' }}>
            数据写入事件 ({dataWrittens.length})
          </h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>发送者</th>
                  <th style={styles.th}>内容</th>
                  <th style={styles.th}>金额 (ETH)</th>
                  <th style={styles.th}>时间</th>
                </tr>
              </thead>
              <tbody>
                {dataWrittens.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>{item.dataId}</td>
                    <td style={styles.td}>{formatAddress(item.sender)}</td>
                    <td style={styles.td}>
                      <div style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.content}
                      </div>
                    </td>
                    <td style={styles.td}>{formatAmount(item.value)}</td>
                    <td style={styles.td}>{formatTimestamp(item.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 直接转账事件列表 */}
      {directTransfers.length > 0 && (
        <div style={styles.section}>
          <h3 style={{ margin: '0 0 1rem 0' }}>
            直接转账事件 ({directTransfers.length})
          </h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>交易ID</th>
                  <th style={styles.th}>发送方</th>
                  <th style={styles.th}>接收方</th>
                  <th style={styles.th}>金额 (ETH)</th>
                  <th style={styles.th}>时间</th>
                </tr>
              </thead>
              <tbody>
                {directTransfers.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>
                      {formatAddress(item.id)}
                    </td>
                    <td style={styles.td}>{formatAddress(item.from)}</td>
                    <td style={styles.td}>{formatAddress(item.to)}</td>
                    <td style={styles.td}>{formatAmount(item.amount)}</td>
                    <td style={styles.td}>{formatTimestamp(item.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GraphQL 查询示例 */}
      <div style={styles.exampleBox}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
          GraphQL 查询示例
        </h3>
        <pre style={styles.code}>
{`query {
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
}`}
        </pre>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  button: {
    padding: '0.75rem 1.5rem',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  } as React.CSSProperties,
  errorBox: {
    padding: '1rem',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    color: '#721c24',
    marginBottom: '1rem',
  } as React.CSSProperties,
  infoBox: {
    padding: '1rem',
    backgroundColor: '#d1ecf1',
    border: '1px solid #bee5eb',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  section: {
    marginBottom: '2rem',
  } as React.CSSProperties,
  tableContainer: {
    overflowX: 'auto',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  th: {
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left',
    fontWeight: 'bold',
  } as React.CSSProperties,
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #dee2e6',
  } as React.CSSProperties,
  tr: {
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  } as React.CSSProperties,
  exampleBox: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    marginTop: '1.5rem',
  } as React.CSSProperties,
  code: {
    padding: '1rem',
    backgroundColor: '#282c34',
    color: '#abb2bf',
    borderRadius: '4px',
    fontSize: '0.75rem',
    overflow: 'auto',
    margin: 0,
  } as React.CSSProperties,
};