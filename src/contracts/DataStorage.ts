export const DATA_STORAGE_ADDRESS = '0x05D91507E12D790B71bdc34e85745Db2f2826371' // 部署后填入合约地址

export const DATA_STORAGE_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'sender', type: 'address' },
      { indexed: false, name: 'content', type: 'string' },
      { indexed: false, name: 'value', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
      { indexed: false, name: 'dataId', type: 'uint256' }
    ],
    name: 'DataWritten',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'DirectTransfer',
    type: 'event'
  },
  {
    inputs: [],
    name: 'directTransfer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ name: '_content', type: 'string' }],
    name: 'writeData',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAllDataCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_user', type: 'address' }],
    name: 'getUserDataCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_index', type: 'uint256' }],
    name: 'getDataByIndex',
    outputs: [
      { name: 'sender', type: 'address' },
      { name: 'content', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'value', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'allData',
    outputs: [
      { name: 'sender', type: 'address' },
      { name: 'content', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'value', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
] as const
