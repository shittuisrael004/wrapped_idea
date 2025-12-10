// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RecapNFT is ERC721URIStorage, Ownable, ReentrancyGuard {

    // NFT ID counter
    uint256 private tokenIdCounter;

    // declaring mint fee variable
    uint256 public mintFee = 0.0001 ether; // 100_000_000_000_000 wei

    // set public mint function on or off
    bool public enablePublicMint;

    // events
    event Minted(address indexed minter, uint256 indexed tokenId, string tokenURI);
    event EnablePublicMintUpdated(bool enabled);
    event MintFeeUpdated(uint256 newPrice);
    event Withdrawal(address indexed to, uint256 amount);

    constructor (
        string memory name_, 
        string memory symbol_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {

    }

    function mintNft(string calldata tokenUri_) public nonReentrant payable returns (uint256) {
        // checks
        require(enablePublicMint, "Public minting is disabled");
        require(msg.value >= mintFee, "Insufficient payment for mint");

        // mint
        tokenIdCounter += 1;
        uint256 tokenId = tokenIdCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri_);

        // emit Minted event
        emit Minted(msg.sender, tokenId, tokenUri_);

        return tokenId;
    }

    function withdraw(address payable to_) public onlyOwner {
        // checks
        uint256 balance =  address(this).balance;
        require(balance > 0, "Account balance is empty");
        
        // send ether
        (bool sent, ) = to_.call{value: balance}("");
        require(sent, "Withdrawal failed!");

        // emit withdrawal event
        emit Withdrawal(to_, balance);
    }

    // Change Mint Fee
    function changeMintPrice(uint256 newFee) public onlyOwner {
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