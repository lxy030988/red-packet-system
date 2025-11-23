export const RED_PACKET_ADDRESS = '0x6Ee4af33A25320f03393b421CF3Ef101478423a6' // 部署后填入合约地址

export const RED_PACKET_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'packetId', type: 'uint256' },
      { indexed: true, name: 'claimer', type: 'address' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'AlreadyClaimed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'packetId', type: 'uint256' },
      { indexed: true, name: 'claimer', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'PacketClaimed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'packetId', type: 'uint256' },
      { indexed: true, name: 'creator', type: 'address' },
      { indexed: false, name: 'totalAmount', type: 'uint256' },
      { indexed: false, name: 'count', type: 'uint256' },
      { indexed: false, name: 'isRandom', type: 'bool' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'PacketCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'packetId', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'PacketFinished',
    type: 'event'
  },
  {
    inputs: [{ name: '_packetId', type: 'uint256' }],
    name: 'claimPacket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: '_count', type: 'uint256' },
      { name: '_isRandom', type: 'bool' }
    ],
    name: 'createPacket',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ name: '_creator', type: 'address' }],
    name: 'getCreatorPackets',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_packetId', type: 'uint256' }],
    name: 'getPacketInfo',
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'totalAmount', type: 'uint256' },
      { name: 'remainingAmount', type: 'uint256' },
      { name: 'totalCount', type: 'uint256' },
      { name: 'remainingCount', type: 'uint256' },
      { name: 'createdAt', type: 'uint256' },
      { name: 'isRandom', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalPackets',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_user', type: 'address' }],
    name: 'getUserClaimedPackets',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_packetId', type: 'uint256' },
      { name: '_user', type: 'address' }
    ],
    name: 'hasClaimed',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'packetIdCounter',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
