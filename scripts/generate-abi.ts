#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * 自动从 artifacts 生成带 as const 的 ABI TypeScript 文件
 * 这样既能保持单一数据源，又能获得完整的类型推断
 */

const ARTIFACT_PATH = 'artifacts/contracts/RedPacket.sol/RedPacket.json'
const OUTPUT_PATH = 'src/contracts/RedPacket.ts'
const CONTRACT_ADDRESS = '0x6Ee4af33A25320f03393b421CF3Ef101478423a6'

try {
  // 读取 artifact JSON
  const artifactContent = readFileSync(ARTIFACT_PATH, 'utf-8')
  const artifact = JSON.parse(artifactContent)

  // 生成 TypeScript 文件内容
  const outputContent = `// 🤖 此文件由 scripts/generate-abi.ts 自动生成
// ⚠️ 请勿手动编辑，运行 npm run generate:abi 重新生成

export const RED_PACKET_ADDRESS = '${CONTRACT_ADDRESS}' as const

export const RED_PACKET_ABI = ${JSON.stringify(artifact.abi, null, 2)} as const
`

  // 写入文件
  writeFileSync(OUTPUT_PATH, outputContent, 'utf-8')

  console.log('✅ ABI 文件生成成功！')
  console.log(`📄 输出位置: ${OUTPUT_PATH}`)
  console.log(`📦 从 ${ARTIFACT_PATH} 提取`)
} catch (error) {
  console.error('❌ 生成 ABI 文件失败:', error)
  process.exit(1)
}
