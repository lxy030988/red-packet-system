import { useState, useEffect } from 'react'
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  usePublicClient
} from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { RED_PACKET_ADDRESS, RED_PACKET_ABI } from '../contracts/RedPacket'

// 领取记录接口
interface ClaimRecord {
  claimer: string
  amount: bigint
  timestamp: bigint
}

export function RedPacketSystem() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [amount, setAmount] = useState('')
  const [count, setCount] = useState('')
  const [isRandom, setIsRandom] = useState(true)
  const [packetId, setPacketId] = useState('')
  const [notifications, setNotifications] = useState<string[]>([])
  const [claimRecords, setClaimRecords] = useState<Map<string, ClaimRecord[]>>(new Map())
  const [loadedPackets, setLoadedPackets] = useState<Set<string>>(new Set())

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  // 读取红包总数
  const { data: totalPackets, refetch: refetchTotal } = useReadContract({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    functionName: 'getTotalPackets'
  })

  // 读取用户创建的红包
  const { data: myPackets, refetch: refetchMyPackets } = useReadContract({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    functionName: 'getCreatorPackets',
    args: address ? [address] : undefined
  })

  // 读取用户领取的红包
  const { data: claimedPackets, refetch: refetchClaimedPackets } = useReadContract({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    functionName: 'getUserClaimedPackets',
    args: address ? [address] : undefined
  })

  // 检查当前用户是否已领取指定红包
  const { data: hasClaimedCurrent, refetch: refetchHasClaimed } = useReadContract({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    functionName: 'hasClaimed',
    args: packetId && address ? [BigInt(packetId), address] : undefined
  })

  // 监听红包创建事件
  useWatchContractEvent({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    eventName: 'PacketCreated',
    onLogs(logs) {
      logs.forEach((log: any) => {
        addNotification(`🎉 新红包创建！ID: ${log.args.packetId}, 金额: ${formatEther(log.args.totalAmount)} ETH`)
      })
    }
  })

  // 监听红包领取事件
  useWatchContractEvent({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    eventName: 'PacketClaimed',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const packetIdStr = log.args.packetId.toString()
        addNotification(
          `💰 红包被领取！ID: ${log.args.packetId}, 领取人: ${log.args.claimer.slice(0, 6)}...${log.args.claimer.slice(-4)}, 金额: ${formatEther(log.args.amount)} ETH`
        )

        // 添加到领取记录
        const record: ClaimRecord = {
          claimer: log.args.claimer,
          amount: log.args.amount,
          timestamp: log.args.timestamp || BigInt(Math.floor(Date.now() / 1000))
        }

        setClaimRecords(prev => {
          const newMap = new Map(prev)
          const existing = newMap.get(packetIdStr) || []
          newMap.set(packetIdStr, [...existing, record])
          return newMap
        })
      })
    }
  })

  // 监听红包抢完事件
  useWatchContractEvent({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    eventName: 'PacketFinished',
    onLogs(logs) {
      logs.forEach((log: any) => {
        addNotification(`🎊 红包已抢完！ID: ${log.args.packetId}`)
      })
    }
  })

  // 监听已领取事件
  useWatchContractEvent({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    eventName: 'AlreadyClaimed',
    onLogs(logs) {
      logs.forEach((log: any) => {
        addNotification(`⚠️ 你已经领取过这个红包了！ID: ${log.args.packetId}`)
      })
    }
  })

  // 手动加载特定红包的历史领取记录
  const loadClaimHistory = async (packetIdToLoad: bigint, showNotification = true) => {
    if (!publicClient) {
      console.log('❌ publicClient 未就绪')
      if (showNotification) addNotification('⚠️ 网络未就绪，请稍后重试')
      return
    }

    try {
      console.log(`🔍 开始加载红包 #${packetIdToLoad} 的历史记录...`)
      if (showNotification) addNotification(`🔍 正在加载红包 #${packetIdToLoad} 的领取记录...`)

      // 获取 PacketClaimed 事件的历史日志
      const logs = await publicClient.getLogs({
        address: RED_PACKET_ADDRESS as `0x${string}`,
        event: {
          type: 'event',
          name: 'PacketClaimed',
          inputs: [
            { type: 'uint256', name: 'packetId', indexed: true },
            { type: 'address', name: 'claimer', indexed: true },
            { type: 'uint256', name: 'amount', indexed: false },
            { type: 'uint256', name: 'timestamp', indexed: false }
          ]
        },
        args: {
          packetId: packetIdToLoad
        },
        fromBlock: 'earliest' as unknown as bigint,
        toBlock: 'latest' as unknown as bigint
      })

      console.log(`✅ 找到 ${logs.length} 条领取记录`)

      // 处理日志并更新 claimRecords
      const records: ClaimRecord[] = logs.map((log: any) => ({
        claimer: log.args.claimer,
        amount: log.args.amount,
        timestamp: log.args.timestamp || BigInt(0)
      }))

      setClaimRecords(prev => {
        const newMap = new Map(prev)
        newMap.set(packetIdToLoad.toString(), records)
        return newMap
      })

      // 标记为已加载
      setLoadedPackets(prev => new Set(prev).add(packetIdToLoad.toString()))

      if (showNotification) {
        if (records.length > 0) {
          console.log(`💾 保存 ${records.length} 条记录到状态`)
          addNotification(`✅ 红包 #${packetIdToLoad} 加载完成: ${records.length} 条记录`)
        } else {
          console.log('⚠️ 没有找到领取记录')
          addNotification(`✅ 红包 #${packetIdToLoad} 加载完成: 暂无领取记录`)
        }
      }
    } catch (error: any) {
      console.error('❌ 加载历史记录失败:', error)
      if (showNotification) addNotification(`❌ 加载失败: ${error.message || '网络错误'}`)
    }
  }

  // 自动加载历史记录（仅在页面首次加载或有新红包时触发一次）
  useEffect(() => {
    if (myPackets && myPackets.length > 0 && publicClient) {
      // 检查是否有未加载的红包
      const unloadedPackets = myPackets.filter(id => {
        const idStr = id.toString()
        // 只检查 loadedPackets 标记
        return !loadedPackets.has(idStr)
      })

      if (unloadedPackets.length > 0) {
        console.log(`🚀 检测到 ${unloadedPackets.length} 个未加载的红包，开始加载历史记录`)

        // 异步加载，不阻塞渲染，不显示通知
        const loadAll = async () => {
          for (const id of unloadedPackets) {
            await loadClaimHistory(id, false) // 自动加载不显示通知
            await new Promise(resolve => setTimeout(resolve, 200))
          }
        }

        loadAll()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPackets, publicClient])

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev].slice(0, 10))
  }

  const handleCreatePacket = async () => {
    if (!amount || !count) {
      alert('请输入金额和数量')
      return
    }

    try {
      writeContract({
        address: RED_PACKET_ADDRESS as `0x${string}`,
        abi: RED_PACKET_ABI,
        functionName: 'createPacket',
        args: [BigInt(count), isRandom],
        value: parseEther(amount)
      })
    } catch (error) {
      console.error('创建失败:', error)
      alert('创建失败: ' + (error as Error).message)
    }
  }

  const handleClaimPacket = async () => {
    if (!packetId) {
      alert('请输入红包ID')
      return
    }

    // 前端检查是否已领取
    if (hasClaimedCurrent) {
      const confirmClaim = window.confirm(
        '⚠️ 检测到你已经领取过这个红包了！\n\n如果继续尝试领取，交易会失败并消耗 Gas 费。\n\n是否仍要继续？'
      )
      if (!confirmClaim) {
        return
      }
    }

    try {
      writeContract({
        address: RED_PACKET_ADDRESS as `0x${string}`,
        abi: RED_PACKET_ABI,
        functionName: 'claimPacket',
        args: [BigInt(packetId)]
      })
    } catch (error) {
      console.error('领取失败:', error)
      alert('领取失败: ' + (error as Error).message)
    }
  }

  // 交易成功后自动刷新
  useEffect(() => {
    if (isSuccess && hash) {
      // 清空表单
      setAmount('')
      setCount('')
      setPacketId('')

      // 延迟刷新，等待区块确认和事件触发
      const timer = setTimeout(async () => {
        console.log('🔄 交易成功，开始刷新所有数据...')

        // 刷新所有合约读取数据
        await Promise.all([
          refetchTotal(),
          refetchMyPackets(),
          refetchClaimedPackets(),
          refetchHasClaimed()
        ])

        console.log('✅ 数据刷新完成')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isSuccess, hash, refetchTotal, refetchMyPackets, refetchClaimedPackets, refetchHasClaimed])

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <h2>红包系统</h2>
        <p style={{ color: '#666' }}>请先连接钱包</p>
      </div>
    )
  }

  return (
    <div>
      <div style={styles.container}>
        <h2>周日作业: 链上红包系统</h2>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
          发红包、抢红包，所有操作都在链上完成
        </p>

        <div style={styles.statsBox}>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>合约地址</div>
            <div style={styles.statValue}>
              {`${RED_PACKET_ADDRESS.slice(0, 8)}...${RED_PACKET_ADDRESS.slice(-6)}`}
            </div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>红包总数</div>
            <div style={styles.statValue}>{totalPackets?.toString() || '0'}</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>我创建的</div>
            <div style={styles.statValue}>{myPackets?.length || 0}</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>我领取的</div>
            <div style={styles.statValue}>{claimedPackets?.length || 0}</div>
          </div>
        </div>

        <div style={styles.grid}>
          {/* 发红包 */}
          <div style={styles.card}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#dc3545' }}>发红包</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>总金额 (ETH):</label>
              <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.01"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>红包数量:</label>
              <input
                type="number"
                value={count}
                onChange={e => setCount(e.target.value)}
                placeholder="3"
                min="1"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={isRandom} onChange={e => setIsRandom(e.target.checked)} />
                随机红包
              </label>
              <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.5rem 0 0 1.5rem' }}>
                {isRandom ? '每个红包金额随机' : '每个红包金额平均'}
              </p>
            </div>

            <button
              onClick={handleCreatePacket}
              disabled={isPending || isConfirming}
              style={{
                ...styles.button,
                backgroundColor: '#dc3545',
                opacity: isPending || isConfirming ? 0.5 : 1
              }}
            >
              {isPending ? '等待确认...' : isConfirming ? '创建中...' : '发红包'}
            </button>
          </div>

          {/* 抢红包 */}
          <div style={styles.card}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#28a745' }}>抢红包</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>红包ID:</label>
              <input
                type="number"
                value={packetId}
                onChange={e => setPacketId(e.target.value)}
                placeholder="0"
                min="0"
                style={styles.input}
              />
            </div>

            {/* 显示是否已领取 */}
            {packetId && hasClaimedCurrent !== undefined && (
              <div
                style={{
                  padding: '0.5rem',
                  marginBottom: '1rem',
                  backgroundColor: hasClaimedCurrent ? '#fff3cd' : '#d1ecf1',
                  border: `1px solid ${hasClaimedCurrent ? '#ffc107' : '#bee5eb'}`,
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              >
                {hasClaimedCurrent ? (
                  <span style={{ color: '#856404' }}>⚠️ 你已经领取过这个红包了</span>
                ) : (
                  <span style={{ color: '#0c5460' }}>✓ 可以领取</span>
                )}
              </div>
            )}

            <button
              onClick={handleClaimPacket}
              disabled={isPending || isConfirming}
              style={{
                ...styles.button,
                backgroundColor: '#28a745',
                opacity: isPending || isConfirming ? 0.5 : 1
              }}
            >
              {isPending ? '等待确认...' : isConfirming ? '领取中...' : '抢红包'}
            </button>

            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#666' }}>
              <p style={{ margin: '0.25rem 0' }}>
                最新红包ID: {totalPackets ? (Number(totalPackets) - 1).toString() : '0'}
              </p>
              <p style={{ margin: '0.25rem 0' }}>提示: 红包ID从0开始</p>
            </div>
          </div>
        </div>

        {hash && (
          <div style={styles.statusBox}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              <strong>交易哈希:</strong>
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', wordBreak: 'break-all' }}>{hash}</p>
            {isSuccess && <p style={{ margin: '0.5rem 0 0 0', color: '#28a745' }}>✓ 操作成功！</p>}
          </div>
        )}
      </div>

      {/* 通知面板 */}
      {notifications.length > 0 && (
        <div style={styles.container}>
          <h3 style={{ margin: '0 0 1rem 0' }}>实时通知 (事件监听)</h3>
          <div style={styles.notificationsBox}>
            {notifications.map((notif, index) => (
              <div key={index} style={styles.notification}>
                {notif}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 我的红包列表 */}
      {myPackets && myPackets.length > 0 && (
        <div style={styles.container}>
          <h3 style={{ margin: '0 0 1rem 0' }}>我创建的红包</h3>
          <div style={styles.packetList}>
            {myPackets.map((id: bigint) => (
              <PacketCard
                key={id.toString()}
                packetId={id}
                claimRecords={claimRecords.get(id.toString()) || []}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 红包卡片组件
function PacketCard({
  packetId,
  claimRecords
}: {
  packetId: bigint
  claimRecords: ClaimRecord[]
}) {
  const [showDetails, setShowDetails] = useState(false)

  const { data: packetInfo } = useReadContract({
    address: RED_PACKET_ADDRESS as `0x${string}`,
    abi: RED_PACKET_ABI,
    functionName: 'getPacketInfo',
    args: [packetId]
  })

  if (!packetInfo) return null

  const [, totalAmount, remainingAmount, totalCount, remainingCount, , isRandom] = packetInfo
  const progress = Number(remainingCount) / Number(totalCount)
  const claimedCount = Number(totalCount) - Number(remainingCount)

  return (
    <div style={styles.packetCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 'bold' }}>红包 #{packetId.toString()}</span>
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: isRandom ? '#ffc107' : '#17a2b8',
            color: '#fff',
            borderRadius: '4px'
          }}
        >
          {isRandom ? '随机' : '平均'}
        </span>
      </div>

      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
        <p style={{ margin: '0.25rem 0' }}>总金额: {formatEther(totalAmount)} ETH</p>
        <p style={{ margin: '0.25rem 0' }}>剩余: {formatEther(remainingAmount)} ETH</p>
        <p style={{ margin: '0.25rem 0' }}>
          个数: {remainingCount.toString()}/{totalCount.toString()}
        </p>
        <p style={{ margin: '0.25rem 0' }}>已领取: {claimedCount}</p>
      </div>

      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '0.75rem'
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: progress > 0.5 ? '#28a745' : progress > 0.2 ? '#ffc107' : '#dc3545',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* 查看详情按钮 */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          width: '100%',
          padding: '0.5rem',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: 'pointer',
          color: '#495057'
        }}
      >
        {showDetails ? '▲ 收起详情' : `▼ 查看领取记录 (${claimRecords.length})`}
      </button>

      {/* 领取记录详情 */}
      {showDetails && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>领取记录</h4>
          {claimRecords.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>暂无领取记录</p>
          ) : (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {claimRecords.map((record, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#495057' }}>第 {index + 1} 个</span>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                      {formatEther(record.amount)} ETH
                    </span>
                  </div>
                  <div style={{ color: '#6c757d' }}>
                    {record.claimer.slice(0, 10)}...{record.claimer.slice(-8)}
                  </div>
                  <div style={{ color: '#adb5bd', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                    {new Date(Number(record.timestamp) * 1000).toLocaleString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem'
  } as React.CSSProperties,
  statsBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem'
  } as React.CSSProperties,
  statItem: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    textAlign: 'center'
  } as React.CSSProperties,
  statLabel: {
    fontSize: '0.75rem',
    color: '#666',
    marginBottom: '0.5rem'
  } as React.CSSProperties,
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333'
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  } as React.CSSProperties,
  card: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  } as React.CSSProperties,
  formGroup: {
    marginBottom: '1rem'
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    fontSize: '0.875rem'
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  } as React.CSSProperties,
  button: {
    padding: '0.75rem 1.5rem',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
  } as React.CSSProperties,
  statusBox: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6'
  } as React.CSSProperties,
  notificationsBox: {
    maxHeight: '300px',
    overflowY: 'auto'
  } as React.CSSProperties,
  notification: {
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    border: '1px solid #dee2e6'
  } as React.CSSProperties,
  packetList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem'
  } as React.CSSProperties,
  packetCard: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  } as React.CSSProperties
}
