// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RedPacket
 * @dev 链上红包系统合约
 * 功能：发红包、抢红包、查询红包状态
 */
contract RedPacket {
    // 红包结构体
    struct Packet {
        uint256 id;                         // 红包ID
        address creator;                    // 创建者地址
        uint256 totalAmount;                // 红包总金额（wei）
        uint256 remainingAmount;            // 剩余金额（wei）
        uint256 totalCount;                 // 红包总个数
        uint256 remainingCount;             // 剩余个数
        uint256 createdAt;                  // 创建时间戳
        bool isRandom;                      // 是否随机红包（true=随机，false=平均）
        mapping(address => bool) claimed;   // 地址领取记录（防止重复领取）
    }

    // 红包ID计数器（自增，用于生成唯一ID）
    uint256 public packetIdCounter;

    // 红包映射：红包ID => 红包数据
    mapping(uint256 => Packet) public packets;

    // 用户创建的红包列表：创建者地址 => 红包ID数组
    mapping(address => uint256[]) public creatorPackets;

    // 用户领取的红包记录：用户地址 => 已领取的红包ID数组
    mapping(address => uint256[]) public userClaimedPackets;

    // 事件：红包创建成功
    event PacketCreated(
        uint256 indexed packetId,       // 红包ID（索引）
        address indexed creator,        // 创建者地址（索引）
        uint256 totalAmount,            // 总金额
        uint256 count,                  // 红包个数
        bool isRandom,                  // 是否随机
        uint256 timestamp               // 创建时间戳
    );

    // 事件：红包被成功领取
    event PacketClaimed(
        uint256 indexed packetId,       // 红包ID（索引）
        address indexed claimer,        // 领取者地址（索引）
        uint256 amount,                 // 领取金额
        uint256 timestamp               // 领取时间戳
    );

    // 事件：红包已全部领完
    event PacketFinished(
        uint256 indexed packetId,       // 红包ID（索引）
        uint256 timestamp               // 抢完时间戳
    );

    // 事件：用户重复领取（触发失败）
    event AlreadyClaimed(
        uint256 indexed packetId,       // 红包ID（索引）
        address indexed claimer,        // 尝试领取者地址（索引）
        uint256 timestamp               // 尝试时间戳
    );

    /**
     * @dev 创建红包
     * @param _count 红包数量（必须大于0）
     * @param _isRandom 是否随机红包（true=随机分配，false=平均分配）
     * @notice 需要发送 ETH 作为红包金额（msg.value）
     */
    function createPacket(uint256 _count, bool _isRandom) public payable {
        require(msg.value > 0, "Amount must be greater than 0");              // 金额必须大于0
        require(_count > 0, "Count must be greater than 0");                  // 数量必须大于0
        require(msg.value >= _count, "Amount too small for count");           // 金额必须至少能分配给每个红包1 wei

        uint256 packetId = packetIdCounter++;                                 // 生成新的红包ID并自增

        Packet storage newPacket = packets[packetId];                         // 创建新红包
        newPacket.id = packetId;                                              // 设置ID
        newPacket.creator = msg.sender;                                       // 设置创建者
        newPacket.totalAmount = msg.value;                                    // 设置总金额
        newPacket.remainingAmount = msg.value;                                // 初始剩余金额等于总金额
        newPacket.totalCount = _count;                                        // 设置总个数
        newPacket.remainingCount = _count;                                    // 初始剩余个数等于总个数
        newPacket.createdAt = block.timestamp;                                // 记录创建时间
        newPacket.isRandom = _isRandom;                                       // 设置分配模式

        creatorPackets[msg.sender].push(packetId);                            // 将红包ID添加到创建者的列表

        emit PacketCreated(                                                   // 触发创建事件
            packetId,
            msg.sender,
            msg.value,
            _count,
            _isRandom,
            block.timestamp
        );
    }

    /**
     * @dev 抢红包（领取红包）
     * @param _packetId 要领取的红包ID
     * @notice 每个地址只能领取一次，领取成功后 ETH 会自动转入调用者账户
     */
    function claimPacket(uint256 _packetId) public {
        Packet storage packet = packets[_packetId];                           // 获取红包数据

        // 检查红包是否存在
        require(packet.totalAmount > 0, "Packet does not exist");             // 通过总金额判断红包是否存在

        // 检查是否已经领取过
        if (packet.claimed[msg.sender]) {                                     // 检查领取记录
            emit AlreadyClaimed(_packetId, msg.sender, block.timestamp);      // 触发重复领取事件
            revert("You have already claimed this packet");                   // 回滚交易
        }

        // 检查红包是否已经抢完
        if (packet.remainingCount == 0) {                                     // 检查剩余个数
            emit PacketFinished(_packetId, block.timestamp);                  // 触发抢完事件
            revert("Packet is finished");                                     // 回滚交易
        }

        // 标记为已领取
        packet.claimed[msg.sender] = true;                                    // 防止重复领取

        // 计算本次领取金额
        uint256 amount;
        if (packet.remainingCount == 1) {                                     // 如果是最后一个红包
            amount = packet.remainingAmount;                                  // 把剩余的全部给出（避免精度损失）
        } else if (packet.isRandom) {                                         // 如果是随机红包
            amount = getRandomAmount(packet.remainingAmount, packet.remainingCount);  // 随机分配金额
        } else {                                                              // 如果是平均红包
            amount = packet.remainingAmount / packet.remainingCount;          // 平均分配
        }

        // 更新红包状态
        packet.remainingAmount -= amount;                                     // 减少剩余金额
        packet.remainingCount -= 1;                                           // 减少剩余个数

        // 记录用户领取历史
        userClaimedPackets[msg.sender].push(_packetId);                       // 添加到用户的领取列表

        // 转账给领取者
        payable(msg.sender).transfer(amount);                                 // 将 ETH 转给领取者

        emit PacketClaimed(_packetId, msg.sender, amount, block.timestamp);   // 触发领取成功事件

        // 如果红包已经全部领完
        if (packet.remainingCount == 0) {                                     // 检查是否抢完
            emit PacketFinished(_packetId, block.timestamp);                  // 触发抢完事件
        }
    }

    /**
     * @dev 生成随机金额（简单实现，生产环境建议使用 Chainlink VRF）
     * @param _remaining 剩余总金额
     * @param _count 剩余红包个数
     * @return 本次分配的随机金额
     * @notice 算法保证每个红包至少 1 wei，且不会超出剩余金额
     */
    function getRandomAmount(uint256 _remaining, uint256 _count) private view returns (uint256) {
        if (_count == 1) {                                                    // 如果只剩1个红包
            return _remaining;                                                // 返回全部剩余金额
        }

        // 计算最大可分配金额（平均值的2倍）
        uint256 max = (_remaining / _count) * 2;                              // 最大不超过平均值的2倍
        if (max > _remaining - (_count - 1)) {                                // 确保剩余红包至少能分到1 wei
            max = _remaining - (_count - 1);                                  // 调整最大值
        }

        // 生成伪随机数（使用区块信息和交易信息）
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,                                          // 区块时间戳
                    block.prevrandao,                                         // 区块随机数（PoS）
                    msg.sender,                                               // 领取者地址
                    _remaining,                                               // 剩余金额
                    _count                                                    // 剩余个数
                )
            )
        ) % max;                                                              // 取模得到随机值

        return random > 0 ? random : 1;                                       // 保证至少返回 1 wei
    }

    /**
     * @dev 检查指定用户是否已领取指定红包
     * @param _packetId 红包ID
     * @param _user 用户地址
     * @return 是否已领取（true=已领取，false=未领取）
     */
    function hasClaimed(uint256 _packetId, address _user) public view returns (bool) {
        return packets[_packetId].claimed[_user];                             // 查询领取记录
    }

    /**
     * @dev 获取红包的详细信息
     * @param _packetId 红包ID
     * @return creator 创建者地址
     * @return totalAmount 红包总金额
     * @return remainingAmount 剩余金额
     * @return totalCount 红包总个数
     * @return remainingCount 剩余个数
     * @return createdAt 创建时间戳
     * @return isRandom 是否随机红包
     */
    function getPacketInfo(uint256 _packetId) public view returns (
        address creator,
        uint256 totalAmount,
        uint256 remainingAmount,
        uint256 totalCount,
        uint256 remainingCount,
        uint256 createdAt,
        bool isRandom
    ) {
        Packet storage packet = packets[_packetId];                           // 获取红包数据
        return (
            packet.creator,                                                   // 返回创建者
            packet.totalAmount,                                               // 返回总金额
            packet.remainingAmount,                                           // 返回剩余金额
            packet.totalCount,                                                // 返回总个数
            packet.remainingCount,                                            // 返回剩余个数
            packet.createdAt,                                                 // 返回创建时间
            packet.isRandom                                                   // 返回分配模式
        );
    }

    /**
     * @dev 获取指定用户创建的所有红包ID列表
     * @param _creator 创建者地址
     * @return 红包ID数组
     */
    function getCreatorPackets(address _creator) public view returns (uint256[] memory) {
        return creatorPackets[_creator];                                      // 返回创建者的红包列表
    }

    /**
     * @dev 获取指定用户领取过的所有红包ID列表
     * @param _user 用户地址
     * @return 红包ID数组
     */
    function getUserClaimedPackets(address _user) public view returns (uint256[] memory) {
        return userClaimedPackets[_user];                                     // 返回用户的领取记录
    }

    /**
     * @dev 获取系统中红包的总数量
     * @return 红包总数（等于下一个将要创建的红包ID）
     */
    function getTotalPackets() public view returns (uint256) {
        return packetIdCounter;                                               // 返回计数器值
    }
}
