import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';
import { DATA_STORAGE_ADDRESS, DATA_STORAGE_ABI } from '../contracts/DataStorage';

export function DataStorageContract() {
  const { address, isConnected } = useAccount();
  const [content, setContent] = useState('');
  const [value, setValue] = useState('');
  const [events, setEvents] = useState<any[]>([]);

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // 读取合约数据
  const { data: dataCount } = useReadContract({
    address: DATA_STORAGE_ADDRESS as `0x${string}`,
    abi: DATA_STORAGE_ABI,
    functionName: 'getAllDataCount',
  });

  const { data: contractBalance } = useReadContract({
    address: DATA_STORAGE_ADDRESS as `0x${string}`,
    abi: DATA_STORAGE_ABI,
    functionName: 'getBalance',
  });

  // 监听事件
  useWatchContractEvent({
    address: DATA_STORAGE_ADDRESS as `0x${string}`,
    abi: DATA_STORAGE_ABI,
    eventName: 'DataWritten',
    onLogs(logs) {
      console.log('新事件:', logs);
      setEvents((prev) => [...logs.reverse(), ...prev]);
    },
  });

  const handleWriteData = async () => {
    if (!content) {
      alert('请输入要存储的内容');
      return;
    }

    try {
      writeContract({
        address: DATA_STORAGE_ADDRESS as `0x${string}`,
        abi: DATA_STORAGE_ABI,
        functionName: 'writeData',
        args: [content],
        value: value ? parseEther(value) : BigInt(0),
      });
    } catch (error) {
      console.error('写入失败:', error);
      alert('写入失败: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setContent('');
      setValue('');
    }
  }, [isSuccess]);

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <h2>合约数据存储</h2>
        <p style={{ color: '#666' }}>请先连接钱包</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>周六作业2: 通过合约日志方式存储数据</h2>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
        将数据写入智能合约，通过事件日志的形式记录在链上
      </p>

      <div style={styles.statsBox}>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>合约地址</div>
          <div style={styles.statValue}>
            {DATA_STORAGE_ADDRESS === '0x...'
              ? '未部署'
              : `${DATA_STORAGE_ADDRESS.slice(0, 8)}...${DATA_STORAGE_ADDRESS.slice(-6)}`}
          </div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>数据总数</div>
          <div style={styles.statValue}>{dataCount?.toString() || '0'}</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>合约余额</div>
          <div style={styles.statValue}>
            {contractBalance ? `${Number(contractBalance) / 1e18} ETH` : '0 ETH'}
          </div>
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>存储内容:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入要存储在链上的内容..."
          style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>附带金额 (ETH, 可选):</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0.0 (留空表示不转账)"
          style={styles.input}
        />
      </div>

      <button
        onClick={handleWriteData}
        disabled={isPending || isConfirming || DATA_STORAGE_ADDRESS === '0x...'}
        style={{
          ...styles.button,
          opacity: isPending || isConfirming || DATA_STORAGE_ADDRESS === '0x...' ? 0.5 : 1,
        }}
      >
        {DATA_STORAGE_ADDRESS === '0x...'
          ? '请先部署合约'
          : isPending
          ? '等待钱包确认...'
          : isConfirming
          ? '交易确认中...'
          : '写入数据'}
      </button>

      {hash && (
        <div style={styles.statusBox}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>交易哈希:</strong>
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', wordBreak: 'break-all' }}>
            {hash}
          </p>
          {isSuccess && (
            <p style={{ margin: '0.5rem 0 0 0', color: '#28a745' }}>
              ✓ 数据写入成功！
            </p>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div style={styles.eventsBox}>
          <h3 style={{ margin: '0 0 1rem 0' }}>最新事件 (实时监听):</h3>
          {events.slice(0, 5).map((event: any, index: number) => (
            <div key={index} style={styles.eventItem}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                <strong>发送者:</strong> {event.args?.sender?.slice(0, 10)}...
              </p>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                <strong>内容:</strong> {event.args?.content}
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>
                数据ID: {event.args?.dataId?.toString()} | 金额:{' '}
                {Number(event.args?.value || 0) / 1e18} ETH
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...styles.statusBox, marginTop: '1rem', backgroundColor: '#d1ecf1', borderColor: '#bee5eb' }}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          <strong>The Graph 集成说明:</strong>
          <br />
          部署合约后，可以使用 The Graph 创建子图来索引和查询事件日志。
          <br />
          1. 在 TheGraph Studio 创建子图
          <br />
          2. 配置 schema.graphql 定义数据模型
          <br />
          3. 编写 mapping.ts 处理 DataWritten 事件
          <br />
          4. 部署子图后即可通过 GraphQL 查询数据
        </p>
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
  statsBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  statItem: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    textAlign: 'center',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '0.75rem',
    color: '#666',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333',
  } as React.CSSProperties,
  formGroup: {
    marginBottom: '1rem',
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6f42c1',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  } as React.CSSProperties,
  statusBox: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
  } as React.CSSProperties,
  eventsBox: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
  } as React.CSSProperties,
  eventItem: {
    padding: '0.75rem',
    backgroundColor: '#fff',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    border: '1px solid #e9ecef',
  } as React.CSSProperties,
};
