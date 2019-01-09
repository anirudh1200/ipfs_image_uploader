pragma solidity 0.4.25;

contract SimpleStorage {

    struct hash{
        string ipfsHash;
        uint timestamp;
    }

    uint public totalHashes;
    hash[] hashList;

    constructor() public {
        totalHashes = 0;
    }

    function addHash(string ipfsUrl) public {
        hash memory newHash = hash({
           ipfsHash: ipfsUrl,
           timestamp: now
        });
        hashList.push(newHash);
        totalHashes++;
    }

    function getHash(uint index) public view returns(string, uint){
        return(
            hashList[index].ipfsHash,
            hashList[index].timestamp
        );
    }
}
