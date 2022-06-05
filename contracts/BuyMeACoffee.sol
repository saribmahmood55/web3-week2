//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//Deployed to Goerli at
// 1) 0x99993870836d49f5b75AE51AdA38aF4D5a9bdB62
// 2) 0x0aD7fa6d62871d385b9dABac73b309c4A1a979dE (updated one)

import "hardhat/console.sol";

contract BuyMeACoffee {
    //Event to emit when memo is created
    event NewMemo(
        address indexed from,
        uint timestamp,
        string name,
        string message
    );

    //Memo struct
    struct Memo {
        address from;
        uint timestamp;
        string name;
        string message;
    }

    //owner of the contract
    address payable owner;

    //List of all the memos
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
    * @dev buy a coffee for contract owner
    * @param _name name of the coffee buyer
    * @param _message message from the buyer
    */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy coffee with 0 eth");

        memos.push(
            Memo(
                msg.sender,
                block.timestamp,
                _name,
                _message
            )
        );

        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    function updateOwner(address newOwner) public {
        require(msg.sender == owner);
        owner = payable(newOwner);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
}
