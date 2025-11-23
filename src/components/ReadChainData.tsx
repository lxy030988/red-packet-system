import { useState } from 'react';
import { ethers } from 'ethers';

export function ReadChainData() {
  const [provider, setProvider] = useState<'infura' | 'alchemy'>('infura');
  const [apiKey, setApiKey] = useState('');
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string>('');
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleReadData = async () => {
    if (!apiKey) {
      alert('请输入 API Key');
      return;
    }

    setLoading(true);
    try {
      // 创建 provider
      let rpcUrl = '';
      if (provider === 'infura') {
        rpcUrl = `https://sepolia.infura.io/v3/${apiKey}`;
      } else {
        rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;
      }

      const ethersProvider = new ethers.JsonRpcProvider(rpcUrl);

      // 获取最新区块号
      const currentBlock = await ethersProvider.getBlockNumber();
      setBlockNumber(currentBlock);

      // 如果输入了地址，获取余额
      if (address) {
        const bal = await ethersProvider.getBalance(address);
        setBalance(ethers.formatEther(bal));
      }

      alert('数据读取成功！');
    } catch (error) {
      console.error('读取失败:', error);
      alert('读取失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>周六作业1-1: 使用 Ethers.js 读取链上数据</h2>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
        通过 Infura 或 Alchemy 读取以太坊测试网数据
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>选择 Provider:</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              value="infura"
              checked={provider === 'infura'}
              onChange={(e) => setProvider(e.target.value as 'infura')}
            />
            Infura
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              value="alchemy"
              checked={provider === 'alchemy'}
              onChange={(e) => setProvider(e.target.value as 'alchemy')}
            />
            Alchemy
          </label>
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>API Key:</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={
            provider === 'infura'
              ? '在 infura.io 获取 API Key'
              : '在 alchemy.com 获取 API Key'
          }
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>查询地址 (可选):</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x... (留空则只查询区块号)"
          style={styles.input}
        />
      </div>

      <button
        onClick={handleReadData}
        disabled={loading}
        style={{
          ...styles.button,
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? '读取中...' : '读取数据'}
      </button>

      {blockNumber > 0 && (
        <div style={styles.resultBox}>
          <h3 style={{ margin: '0 0 1rem 0' }}>读取结果:</h3>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>当前区块号:</strong> {blockNumber}
          </p>
          {balance && (
            <p style={{ margin: '0.5rem 0' }}>
              <strong>地址余额:</strong> {balance} ETH
            </p>
          )}
          {address && (
            <p style={{ margin: '0.5rem 0', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              <strong>查询地址:</strong> {address}
            </p>
          )}
        </div>
      )}

      <div style={{ ...styles.resultBox, marginTop: '1rem', backgroundColor: '#fff3cd' }}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          <strong>提示:</strong>
          <br />
          1. 在 <a href="https://www.infura.io/zh" target="_blank" rel="noopener noreferrer">infura.io</a> 或{' '}
          <a href="https://www.alchemy.com" target="_blank" rel="noopener noreferrer">alchemy.com</a> 注册并获取免费 API Key
          <br />
          2. 本示例使用 Sepolia 测试网
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
  } as React.CSSProperties,
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  } as React.CSSProperties,
  resultBox: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
  } as React.CSSProperties,
};
