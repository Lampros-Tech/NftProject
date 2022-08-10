// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract StoreNft{


    address[] users;
    uint256[] tokenId;

    mapping(address=> uint256[]) public userdata;



    function storeNftData(uint256 _nfttoken) public{

          
        userdata[msg.sender].push(_nfttoken);
        tokenId.push(_nfttoken);
        
            
    }

    function getParticularUserStoreNftata() public view returns(uint[] memory){

        return userdata[msg.sender];

    }
    // function msgSender() public view returns(address){

    //     return msg.sender;
    // }

    function getAllNftData() public view returns(uint[] memory){
        return tokenId;
    }

}