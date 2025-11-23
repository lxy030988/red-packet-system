// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RedPacket
 * @dev 链上红包系统合约
 * 功能：发红包、抢红包、查询红包状态
 */
contract RedPacket {
    // 红包结构
    struct Packet {
        uint256 id;
        address creator;
        uint256 totalAmount;
        uint256 remainingAmount;
        uint256 totalCount;
        uint256 remainingCount;
        uint256 createdAt;
        bool isRandom; // 是否随机红包
        mapping(address => bool) claimed; // 已领取记录
    }

    // 红包ID计数器
    uint256 public packetIdCounter;

    // 红包映射
    mapping(uint256 => Packet) public packets;

    // 用户创建的红包列表
    mapping(address => uint256[]) public creatorPackets;

    // 用户领取的红包记录
    mapping(address => uint256[]) public userClaimedPackets;

    // 事件：红包创建
    event PacketCreated(
        uint256 indexed packetId,
        address indexed creator,
        uint256 totalAmount,
        uint256 count,
        bool isRandom,
        uint256 timestamp
    );

    // 事件：红包领取
    event PacketClaimed(
        uint256 indexed packetId,
        address indexed claimer,
        uint256 amount,
        uint256 timestamp
    );

    // 事件：红包已抢完
    event PacketFinished(
        uint256 indexed packetId,
        uint256 timestamp
    );

    // 事件：已经领取过
    event AlreadyClaimed(
        uint256 indexed packetId,
        address indexed claimer,
        uint256 timestamp
    );

    /**
     * @dev 创建红包
     * @param _count 红包数量
     * @param _isRandom 是否随机红包
     */
    function createPacket(uint256 _count, bool _isRandom) public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_count > 0, "Count must be greater than 0");
        require(msg.value >= _count, "Amount too small for count");

        uint256 packetId = packetIdCounter++;

        Packet storage newPacket = packets[packetId];
        newPacket.id = packetId;
        newPacket.creator = msg.sender;
        newPacket.totalAmount = msg.value;
        newPacket.remainingAmount = msg.value;
        newPacket.totalCount = _count;
        newPacket.remainingCount = _count;
        newPacket.createdAt = block.timestamp;
        newPacket.isRandom = _isRandom;

        creatorPackets[msg.sender].push(packetId);

        emit PacketCreated(
            packetId,
            msg.sender,
            msg.value,
            _count,
            _isRandom,
            block.timestamp
        );
    }

    /**
     * @dev 抢红包
     * @param _packetId 红包ID
     */
    function claimPacket(uint256 _packetId) public {
        Packet storage packet = packets[_packetId];

        // 检查红包是否存在
        require(packet.totalAmount > 0, "Packet does not exist");

        // 检查是否已经抢过
        if (packet.claimed[msg.sender]) {
            emit AlreadyClaimed(_packetId, msg.sender, block.timestamp);
            revert("You have already claimed this packet");
        }

        // 检查红包是否已经抢完
        if (packet.remainingCount == 0) {
            emit PacketFinished(_packetId, block.timestamp);
            revert("Packet is finished");
        }

        // 标记已领取
        packet.claimed[msg.sender] = true;

        // 计算领取金额
        uint256 amount;
        if (packet.remainingCount == 1) {
            // 最后一个红包，把剩余的全部给出
            amount = packet.remainingAmount;
        } else if (packet.isRandom) {
            // 随机红包
            amount = getRandomAmount(packet.remainingAmount, packet.remainingCount);
        } else {
            // 平均红包
            amount = packet.remainingAmount / packet.remainingCount;
        }

        // 更新红包状态
        packet.remainingAmount -= amount;
        packet.remainingCount -= 1;

        // 记录用户领取
        userClaimedPackets[msg.sender].push(_packetId);

        // 转账
        payable(msg.sender).transfer(amount);

        emit PacketClaimed(_packetId, msg.sender, amount, block.timestamp);

        // 如果红包已经抢完
        if (packet.remainingCount == 0) {
            emit PacketFinished(_packetId, block.timestamp);
        }
    }

    /**
     * @dev 生成随机金额（简单实现，生产环境建议使用 Chainlink VRF）
     */
    function getRandomAmount(uint256 _remaining, uint256 _count) private view returns (uint256) {
        if (_count == 1) {
            return _remaining;
        }

        // 保证每个红包至少 1 wei
        uint256 max = (_remaining / _count) * 2;
        if (max > _remaining - (_count - 1)) {
            max = _remaining - (_count - 1);
        }

        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    _remaining,
                    _count
                )
            )
        ) % max;

        return random > 0 ? random : 1;
    }

    /**
     * @dev 检查用户是否已领取
     */
    function hasClaimed(uint256 _packetId, address _user) public view returns (bool) {
        return packets[_packetId].claimed[_user];
    }

    /**
     * @dev 获取红包基本信息
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
        Packet storage packet = packets[_packetId];
        return (
            packet.creator,
            packet.totalAmount,
            packet.remainingAmount,
            packet.totalCount,
            packet.remainingCount,
            packet.createdAt,
            packet.isRandom
        );
    }

    /**
     * @dev 获取用户创建的红包列表
     */
    function getCreatorPackets(address _creator) public view returns (uint256[] memory) {
        return creatorPackets[_creator];
    }

    /**
     * @dev 获取用户领取的红包列表
     */
    function getUserClaimedPackets(address _user) public view returns (uint256[] memory) {
        return userClaimedPackets[_user];
    }

    /**
     * @dev 获取红包总数
     */
    function getTotalPackets() public view returns (uint256) {
        return packetIdCounter;
    }
}
