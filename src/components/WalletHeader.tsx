import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useEnsAvatar,
  useBalance,
  useSwitchChain,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { sepolia, mainnet } from 'wagmi/chains';
import { formatEther } from 'viem';

export function WalletHeader() {
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined, chainId: mainnet.id });
  const { data: balance } = useBalance({ address });
  const [showChainMenu, setShowChainMenu] = useState(false);

  const handleConnect = async () => {
    try {
      await connect({
        connector: injected(),
        chainId: sepolia.id // 默认连接到 Sepolia 测试链
      });
    } catch (error) {
      console.error('连接失败:', error);
    }
  };

  const handleSwitchChain = (targetChainId: number) => {
    switchChain({ chainId: targetChainId });
    setShowChainMenu(false);
  };

  const getChainName = (chainId?: number) => {
    switch (chainId) {
      case sepolia.id:
        return 'Sepolia';
      case mainnet.id:
        return 'Mainnet';
      default:
        return 'Unknown';
    }
  };

  const getChainColor = (chainId?: number) => {
    switch (chainId) {
      case sepolia.id:
        return '#9b59b6'; // 紫色
      case mainnet.id:
        return '#3498db'; // 蓝色
      default:
        return '#95a5a6'; // 灰色
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #dee2e6'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
          红包系统 & 数据上链
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#666' }}>
          Red Packet & Data Storage System
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isConnected && address ? (
          <>
            {/* 网络切换 */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowChainMenu(!showChainMenu)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: getChainColor(chain?.id),
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'inline-block',
                }} />
                {getChainName(chain?.id)}
                <span style={{ fontSize: '0.75rem' }}>▼</span>
              </button>

              {showChainMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  minWidth: '150px',
                }}>
                  <button
                    onClick={() => handleSwitchChain(sepolia.id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: chain?.id === sepolia.id ? '#f8f9fa' : '#fff',
                      border: 'none',
                      borderBottom: '1px solid #dee2e6',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getChainColor(sepolia.id),
                      display: 'inline-block',
                    }} />
                    Sepolia
                    {chain?.id === sepolia.id && <span style={{ marginLeft: 'auto' }}>✓</span>}
                  </button>
                  <button
                    onClick={() => handleSwitchChain(mainnet.id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: chain?.id === mainnet.id ? '#f8f9fa' : '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      borderRadius: '0 0 8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getChainColor(mainnet.id),
                      display: 'inline-block',
                    }} />
                    Mainnet
                    {chain?.id === mainnet.id && <span style={{ marginLeft: 'auto' }}>✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* 账户信息 */}
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#fff',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              textAlign: 'right',
            }}>
              {/* ENS Name */}
              {ensName && (
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: '#0066cc',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  {ensAvatar && (
                    <img
                      src={ensAvatar}
                      alt="ENS Avatar"
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                      }}
                    />
                  )}
                  {ensName}
                </div>
              )}

              {/* 地址 */}
              <div style={{
                fontSize: '0.75rem',
                color: '#666',
                marginBottom: '0.25rem',
              }}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>

              {/* 余额 */}
              {balance && (
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: '#28a745',
                  marginTop: '0.25rem',
                }}>
                  {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
                </div>
              )}
            </div>

            {/* 断开连接按钮 */}
            <button
              onClick={() => disconnect()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              断开连接
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            连接 MetaMask (Sepolia)
          </button>
        )}
      </div>
    </header>
  );
}