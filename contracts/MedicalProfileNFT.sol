// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MedicalProfileNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    event MedicalProfileMinted(
        address indexed patient,
        uint256 tokenId,
        string uri
    );
    event MedicalProfileUpdated(
        address indexed patient,
        uint256 tokenId,
        string newURI
    );

    constructor() ERC721("MedicalProfileNFT", "MPN") Ownable(msg.sender) {}

    function mint(address patient, string memory uri) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        _safeMint(patient, tokenId);
        _setTokenURI(tokenId, uri);
        emit MedicalProfileMinted(patient, tokenId, uri);
    }

    function updateURI(
        uint256 tokenId,
        string memory newURI
    ) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, newURI);
        emit MedicalProfileUpdated(ownerOf(tokenId), tokenId, newURI);
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
