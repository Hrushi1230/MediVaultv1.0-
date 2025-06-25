// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DoctorID is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public hasMinted;

    event DoctorRegistered(address indexed doctor, uint256 tokenId);
    event DoctorURIUpdated(
        address indexed doctor,
        uint256 tokenId,
        string newURI
    );

    constructor() ERC721("DoctorID", "DID") Ownable(msg.sender) {}

    function mint(address to, string memory uri) external onlyOwner {
        require(!hasMinted[to], "Already minted");
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        hasMinted[to] = true;
        emit DoctorRegistered(to, tokenId);
    }

    function updateURI(
        uint256 tokenId,
        string memory newURI
    ) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, newURI);
        emit DoctorURIUpdated(ownerOf(tokenId), tokenId, newURI);
    }

    // ✅ Override the new _update method in OZ v5 to make it soulbound
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("Soulbound: non-transferable");
        }
        return super._update(to, tokenId, auth);
    }
}
