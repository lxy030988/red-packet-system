import { useState } from 'react';
import { WalletHeader } from './components/WalletHeader';
import { DirectTransfer } from './components/DirectTransfer';
import { ReadChainData } from './components/ReadChainData';
import { DataStorageContract } from './components/DataStorageContract';
import { TheGraphQuery } from './components/TheGraphQuery';
import { RedPacketSystem } from './components/RedPacketSystem';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'saturday' | 'sunday'>('saturday');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <WalletHeader />

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem 0 1rem 0',
      }}>
        <button
          onClick={() => setActiveTab('saturday')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: activeTab === 'saturday' ? '#007bff' : '#fff',
            color: activeTab === 'saturday' ? '#fff' : '#333',
            border: '2px solid #007bff',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          周六作业：数据上链
        </button>
        <button
          onClick={() => setActiveTab('sunday')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: activeTab === 'sunday' ? '#dc3545' : '#fff',
            color: activeTab === 'sunday' ? '#fff' : '#333',
            border: '2px solid #dc3545',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          周日作业：红包系统
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem 2rem 1rem',
      }}>
        {activeTab === 'saturday' ? (
          <>
            <DirectTransfer />
            <ReadChainData />
            <DataStorageContract />
            <TheGraphQuery />
          </>
        ) : (
          <RedPacketSystem />
        )}
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
        fontSize: '0.875rem',
      }}>
        <p style={{ margin: 0 }}>
          Made with React + Wagmi + Viem | Solidity Smart Contracts
        </p>
      </footer>
    </div>
  );
}

export default App;
