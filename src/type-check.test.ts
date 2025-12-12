// 🧪 测试文件 - 验证 wagmi CLI 生成的类型是否正常工作
// 这个文件仅用于类型检查，不需要运行

import { useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi'
import { RED_PACKET_ABI, RED_PACKET_ADDRESS } from './contracts/RedPacket'

// ✅ 测试 1: functionName 应该有自动补全
const test1 = () => {
  useWriteContract({
    abi: RED_PACKET_ABI,
    functionName: 'createPacket' // 应该自动补全所有函数名
    //            ^ 在编辑器中输入时应该看到: 'createPacket' | 'claimPacket' | ...
  })
}

// ✅ 测试 2: args 参数类型应该被检查
const test2 = () => {
  useWriteContract({
    abi: RED_PACKET_ABI,
    functionName: 'createPacket',
    args: [BigInt(5), true] // ✅ 正确: [uint256, bool]
    // args: ['wrong'],  // ❌ 如果取消注释，应该报错
  })
}

// ✅ 测试 3: 读取合约应该推断返回值类型
const test3 = () => {
  const { data } = useReadContract({
    address: RED_PACKET_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'getTotalPackets'
  })
  // data 应该是 bigint | undefined
  const total: bigint | undefined = data
}

// ✅ 测试 4: 事件监听应该推断 log.args 类型
const test4 = () => {
  useWatchContractEvent({
    address: RED_PACKET_ADDRESS,
    abi: RED_PACKET_ABI,
    eventName: 'PacketClaimed', // 应该自动补全事件名
    onLogs(logs) {
      logs.forEach(log => {
        // 这些字段应该都有正确的类型
        const packetId: bigint = log.args.packetId
        const claimer: `0x${string}` = log.args.claimer
        const amount: bigint = log.args.amount
        const timestamp: bigint = log.args.timestamp
      })
    }
  })
}

export {}
