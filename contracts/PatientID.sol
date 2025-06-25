// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PatientID is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public hasMinted;

    event PatientRegistered(address indexed patient, uint256 tokenId);
    event PatientURIUpdated(
        address indexed patient,
        uint256 tokenId,
        string newURI
    );

    constructor() ERC721("PatientID", "PID") Ownable(msg.sender) {}

    function mint(address to, string memory uri) external onlyOwner {
        require(!hasMinted[to], "Already minted");
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        hasMinted[to] = true;
        emit PatientRegistered(to, tokenId);
    }

    function updateURI(
        uint256 tokenId,
        string memory newURI
    ) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, newURI);
        emit PatientURIUpdated(ownerOf(tokenId), tokenId, newURI);
    }

    // Soulbound enforcement
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }
}
