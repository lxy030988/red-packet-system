import { useState } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

export function DirectTransfer() {
  const { address, isConnected } = useAccount();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

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

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <h2>直接转账</h2>
        <p style={{ color: '#666' }}>请先连接钱包</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>周六作业1: 直接转账方式数据上链</h2>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
        通过直接转账的方式将交易记录在链上
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>接收地址:</label>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="0x..."
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>金额 (ETH):</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.01"
          style={styles.input}
        />
      </div>

      <button
        onClick={handleTransfer}
        disabled={isPending || isConfirming}
        style={{
          ...styles.button,
          opacity: isPending || isConfirming ? 0.5 : 1,
        }}
      >
        {isPending ? '等待钱包确认...' : isConfirming ? '交易确认中...' : '发送转账'}
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
              ✓ 转账成功！
            </p>
          )}
        </div>
      )}
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
    backgroundColor: '#007bff',
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
};
