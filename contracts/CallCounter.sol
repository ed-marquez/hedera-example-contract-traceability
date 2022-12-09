// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ICounter.sol";

contract CallCounter {
    address counterAddr;

    constructor (address _counter) {
       counterAddr = _counter;
    }

    function counterIncrement() external {
        return ICounter(counterAddr).increment();
    }

    function getCount() external view returns (uint) {
        return ICounter(counterAddr).count();
    }

}