//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RedPacket
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const redPacketAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'packetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AlreadyClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'packetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PacketClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'packetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'count',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'isRandom', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PacketCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'packetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PacketFinished',
  },
  {
    type: 'function',
    inputs: [{ name: '_packetId', internalType: 'uint256', type: 'uint256' }],
    name: 'claimPacket',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_count', internalType: 'uint256', type: 'uint256' },
      { name: '_isRandom', internalType: 'bool', type: 'bool' },
    ],
    name: 'createPacket',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'creatorPackets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_creator', internalType: 'address', type: 'address' }],
    name: 'getCreatorPackets',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_packetId', internalType: 'uint256', type: 'uint256' }],
    name: 'getPacketInfo',
    outputs: [
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'remainingAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'totalCount', internalType: 'uint256', type: 'uint256' },
      { name: 'remainingCount', internalType: 'uint256', type: 'uint256' },
      { name: 'createdAt', internalType: 'uint256', type: 'uint256' },
      { name: 'isRandom', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalPackets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'getUserClaimedPackets',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_packetId', internalType: 'uint256', type: 'uint256' },
      { name: '_user', internalType: 'address', type: 'address' },
    ],
    name: 'hasClaimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'packetIdCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'packets',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'remainingAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'totalCount', internalType: 'uint256', type: 'uint256' },
      { name: 'remainingCount', internalType: 'uint256', type: 'uint256' },
      { name: 'createdAt', internalType: 'uint256', type: 'uint256' },
      { name: 'isRandom', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'userClaimedPackets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

/**
 *
 */
export const redPacketAddress = {
  31337: '0x6Ee4af33A25320f03393b421CF3Ef101478423a6',
} as const

/**
 *
 */
export const redPacketConfig = {
  address: redPacketAddress,
  abi: redPacketAbi,
} as const
