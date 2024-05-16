// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SingleStorage {
    string private storedHash;

    function store(string calldata hashToStore) public {
        storedHash = hashToStore;
    }

    function retrieve() public view returns (string memory) {
        return storedHash;
    }
}
