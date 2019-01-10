pragma solidity 0.4.25;

contract SimpleStorage {

    struct hash{
        string ipfsHash;
        string description;
        uint timestamp;
    }

    uint public totalHashes;
    hash[] hashList;
    address manager;

    constructor() public {
        totalHashes = 0;
        manager = msg.sender;
    }

    function addHash(string ipfsUrl, string desc) public restrict {
        hash memory newHash = hash({
           ipfsHash: ipfsUrl,
           description: desc,
           timestamp: now
        });
        hashList.push(newHash);
        totalHashes++;
    }

    function getHash(uint index) public view restrict returns(string, string, uint){
        return(
            hashList[index].ipfsHash,
            hashList[index].description,
            hashList[index].timestamp
        );
    }

    modifier restrict(){
        require(msg.sender == manager);
        _;
    }
}
