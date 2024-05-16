// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./structs/Hash.sol";

contract StructStorage {
    Hash private storedHash;

    function store(Hash calldata hashToStore) public {
        storedHash = hashToStore;
    }

    function retrieve() public view returns (Hash memory) {
        return storedHash;
    }
}
