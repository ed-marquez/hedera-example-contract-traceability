// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface ICounter {
    function count() external view returns (uint);
    function increment() external;
}