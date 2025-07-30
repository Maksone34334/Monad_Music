// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*
 * PlaylistNFT.sol
 *
 * A simple ERC‑721 implementation that represents a playlist of music tracks.
 * Each token stores up to 12 songs (title and IPFS URI) in an on‑chain array.
 * Inspired by Pods (pods.media), which mints podcast episodes as NFTs【350488824664295†screenshot】.
 * In this music adaptation a user can upload 12 of their favourite songs, store
 * the audio files on IPFS and mint a single NFT representing the entire
 * playlist.  The token URI points to a JSON metadata document containing
 * additional information such as cover art and description.
 */

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlaylistNFT is ERC721URIStorage, Ownable {
    /// Counter used to assign token IDs.
    uint256 public tokenCounter;

    /// Maximum number of songs allowed in a playlist.
    uint8 public constant MAX_SONGS = 12;

    /// A song consists of a title and a URI pointing to the audio file on IPFS.
    struct Song {
        string title;
        string ipfsURI;
    }

    /// Mapping from token ID to an array of songs.
    /// We use a fixed‑length array because every playlist must contain exactly MAX_SONGS tracks.
    mapping(uint256 => Song[MAX_SONGS]) private playlistSongs;

    /**
     * Event emitted when a new playlist NFT is minted.
     * @param to Address receiving the NFT.
     * @param tokenId ID of the newly minted NFT.
     */
    event PlaylistMinted(address indexed to, uint256 indexed tokenId);

    /**
     * Construct the PlaylistNFT contract.
     */
    constructor() ERC721("PlaylistNFT", "PLNFT") {
        // Start token IDs at 1 for nicer UX
        tokenCounter = 1;
    }

    /**
     * Mint a new playlist NFT.
     * @param songs An array containing MAX_SONGS song structs (title and IPFS URI).
     * @param metadataURI URI pointing to off‑chain metadata for the playlist (cover art, description, etc.).
     *
     * Requirements:
     * - The caller must supply exactly MAX_SONGS songs.
     * - Each song must include a non‑empty title and IPFS URI.
     */
    function mintPlaylistNFT(Song[MAX_SONGS] calldata songs, string calldata metadataURI) external returns (uint256) {
        // Assign new token ID
        uint256 tokenId = tokenCounter;
        tokenCounter += 1;

        // Store songs on‑chain
        for (uint8 i = 0; i < MAX_SONGS; i++) {
            require(bytes(songs[i].title).length > 0, "Song title required");
            require(bytes(songs[i].ipfsURI).length > 0, "Song IPFS URI required");
            playlistSongs[tokenId][i] = songs[i];
        }

        // Mint the NFT to the caller
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit PlaylistMinted(msg.sender, tokenId);
        return tokenId;
    }

    /**
     * Get the songs for a given playlist.
     * @param tokenId The ID of the playlist NFT.
     * @return An array of Song structs containing titles and IPFS URIs.
     */
    function getSongs(uint256 tokenId) external view returns (Song[MAX_SONGS] memory) {
        require(_exists(tokenId), "PlaylistNFT: query for nonexistent token");
        return playlistSongs[tokenId];
    }
}
