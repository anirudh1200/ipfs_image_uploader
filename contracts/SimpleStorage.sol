pragma solidity 0.4.25;

contract SimpleStorage {

    struct hash{
        string ipfsHash;
        string description;
        uint timestamp;
        string docType;
    }

    uint public totalHashes;
    hash[] hashList;
    address manager;

    constructor() public {
        totalHashes = 0;
        manager = msg.sender;
    }

    function addHash(string ipfsUrl, string desc, string _docType) public restrict {
        hash memory newHash = hash({
           ipfsHash: ipfsUrl,
           description: desc,
           docType: _docType,
           timestamp: now
        });
        hashList.push(newHash);
        totalHashes++;
    }

    function getHash(uint index) public view restrict returns(string, string, string, uint){
        return(
            hashList[index].ipfsHash,
            hashList[index].description,
            hashList[index].docType,
            hashList[index].timestamp
        );
    }

    modifier restrict(){
        require(msg.sender == manager);
        _;
    }
}
