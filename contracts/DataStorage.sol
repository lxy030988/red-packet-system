// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DataStorage
 * @dev 数据上链合约 - 通过事件日志的形式存储数据
 * 用于周六作业：写一个合约专门来写链上的数据通过日志的形式
 */
contract DataStorage {
    // 数据结构
    struct Data {
        address sender;
        string content;
        uint256 timestamp;
        uint256 value; // 如果附带转账金额
    }

    // 存储所有数据
    Data[] public allData;

    // 用户数据映射
    mapping(address => Data[]) public userDataMap;

    // 事件：数据写入
    event DataWritten(
        address indexed sender,
        string content,
        uint256 value,
        uint256 timestamp,
        uint256 dataId
    );

    // 事件：直接转账
    event DirectTransfer(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev 写入数据（可以附带转账）
     * @param _content 要存储的内容
     */
    function writeData(string memory _content) public payable {
        Data memory newData = Data({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            value: msg.value
        });

        allData.push(newData);
        userDataMap[msg.sender].push(newData);

        emit DataWritten(
            msg.sender,
            _content,
            msg.value,
            block.timestamp,
            allData.length - 1
        );
    }

    /**
     * @dev 直接转账到合约
     */
    function directTransfer() public payable {
        require(msg.value > 0, "Transfer amount must be greater than 0");

        emit DirectTransfer(
            msg.sender,
            address(this),
            msg.value,
            block.timestamp
        );
    }

    /**
     * @dev 获取所有数据数量
     */
    function getAllDataCount() public view returns (uint256) {
        return allData.length;
    }

    /**
     * @dev 获取用户数据数量
     */
    function getUserDataCount(address _user) public view returns (uint256) {
        return userDataMap[_user].length;
    }

    /**
     * @dev 获取指定索引的数据
     */
    function getDataByIndex(uint256 _index) public view returns (
        address sender,
        string memory content,
        uint256 timestamp,
        uint256 value
    ) {
        require(_index < allData.length, "Index out of bounds");
        Data memory data = allData[_index];
        return (data.sender, data.content, data.timestamp, data.value);
    }

    /**
     * @dev 获取合约余额
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // 接收 ETH
    receive() external payable {
        emit DirectTransfer(
            msg.sender,
            address(this),
            msg.value,
            block.timestamp
        );
    }
}
