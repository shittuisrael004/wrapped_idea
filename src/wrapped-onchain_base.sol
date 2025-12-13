// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RecapNFT is ERC721URIStorage, Ownable {
    // NFT ID counter
    uint256 private tokenIdCounter;
    
    // declaring mint fee variable
    uint256 public mintFee = 0.0001 ether; // 100_000_000_000_000 wei
    
    // set public mint function on or off
    bool public enablePublicMint;
    
    // events
    event Minted(address indexed minter, uint256 indexed tokenId);
    event TokenURISet(uint256 indexed tokenId, string tokenURI);
    event EnablePublicMintUpdated(bool enabled);
    event MintFeeUpdated(uint256 newFee);
    event Withdrawal(address indexed to, uint256 amount);
    
    constructor (
        string memory name_, 
        string memory symbol_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
    }
    
    function mintNft() public payable returns (uint256) {
        // checks
        require(enablePublicMint, "Public minting is disabled");
        require(msg.value >= mintFee, "Insufficient payment for mint");
        
        // mint
        tokenIdCounter += 1;
        uint256 tokenId = tokenIdCounter;
        _safeMint(msg.sender, tokenId);
        
        // emit Minted event
        emit Minted(msg.sender, tokenId);
        return tokenId;
    }
    
    // Owner sets token URI after minting
    function setTokenURI(uint256 tokenId, string calldata tokenURI) public onlyOwner {
        _setTokenURI(tokenId, tokenURI);
        emit TokenURISet(tokenId, tokenURI);
    }
    
    // Batch set token URIs for efficiency
    function batchSetTokenURI(uint256[] calldata tokenIds, string[] calldata tokenURIs) public onlyOwner {
        require(tokenIds.length == tokenURIs.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _setTokenURI(tokenIds[i], tokenURIs[i]);
            emit TokenURISet(tokenIds[i], tokenURIs[i]);
        }
    }
    
    function withdraw(address payable to) public onlyOwner {
        // checks
        uint256 balance = address(this).balance;
        require(balance > 0, "Account balance is empty");
        
        // send ether
        (bool sent, ) = to.call{value: balance}("");
        require(sent, "Withdrawal failed!");
        
        // emit withdrawal event
        emit Withdrawal(to, balance);
    }
    
    // Change Mint Fee
    function changeMintFee(uint256 newFee) public onlyOwner {
        mintFee = newFee;
        emit MintFeeUpdated(newFee);
    }
    
    function togglePublicMint() public onlyOwner {
        enablePublicMint = !enablePublicMint;
        emit EnablePublicMintUpdated(enablePublicMint);
    }
    
    // getter functions
    function totalNftMinted() public view returns(uint256) {
        return tokenIdCounter;
    }
    
    //optional
    // receive and fallback to accept native ether transfers.
    receive() external payable {}
    fallback() external payable {}
}
