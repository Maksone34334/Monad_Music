/*
 * create.js
 *
 * Handles the playlist creation and minting process.  This file generates
 * input fields for twelve songs and defines a mintPlaylist function that
 * packages the data and interacts with the PlaylistNFT smart contract.  The
 * current implementation uses placeholder logic for IPFS uploading and
 * contract interaction – integrate your preferred IPFS service and replace
 * the provider/signer logic to connect with MetaMask.
 */

const MAX_SONGS = 12;

// Replace with the address of your deployed PlaylistNFT contract
const playlistContractAddress = '0xYourContractAddressHere';

// The ABI defines the functions we need from the contract
const playlistAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: 'string', name: 'title', type: 'string' },
          { internalType: 'string', name: 'ipfsURI', type: 'string' }
        ],
        internalType: 'struct PlaylistNFT.Song[12]',
        name: 'songs',
        type: 'tuple[12]'
      },
      { internalType: 'string', name: 'metadataURI', type: 'string' }
    ],
    name: 'mintPlaylistNFT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Generate the input fields for songs
  const songFields = document.getElementById('songFields');
  for (let i = 0; i < MAX_SONGS; i++) {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label>Song ${i + 1} Title</label>
      <input type="text" name="title${i}" required />
      <label>Song ${i + 1} File</label>
      <input type="file" name="file${i}" accept="audio/*" required />
    `;
    songFields.appendChild(div);
  }

  const form = document.getElementById('playlistForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await mintPlaylist();
  });
});

async function mintPlaylist() {
  const status = document.getElementById('status');
  status.innerHTML = '';

  // Collect song data
  const songs = [];
  for (let i = 0; i < MAX_SONGS; i++) {
    const titleInput = document.querySelector(`input[name="title${i}"]`);
    const fileInput = document.querySelector(`input[name="file${i}"]`);
    const title = titleInput.value.trim();
    const file = fileInput.files[0];
    if (!title || !file) {
      status.textContent = 'Please provide a title and file for each song.';
      return;
    }
    songs.push({ title, file });
  }

  // In a real application you would upload each audio file to IPFS here
  // and receive a URI.  For demonstration we will pretend that
  // `ipfsURI` equals `file.name`.
  const ipfsSongs = songs.map((s) => ({ title: s.title, ipfsURI: s.file.name }));

  // Likewise, you would generate and upload a metadata JSON file to IPFS
  // containing information such as playlist title, description and cover art.
  // We will use a placeholder metadata URI here.
  const metadataURI = 'ipfs://placeholder-playlist-metadata.json';

  // Check for MetaMask provider
  if (typeof window.ethereum === 'undefined') {
    status.textContent = 'No Web3 wallet detected. Please install MetaMask.';
    return;
  }

  try {
    // Request the user to connect their wallet
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(playlistContractAddress, playlistAbi, signer);

    // Prepare the songs array in the format expected by the contract
    // The ABI expects a fixed‑length array of Song structs
    const formattedSongs = [];
    for (let i = 0; i < MAX_SONGS; i++) {
      formattedSongs.push({ title: ipfsSongs[i].title, ipfsURI: ipfsSongs[i].ipfsURI });
    }

    status.textContent = 'Minting your playlist… this may take a moment.';
    const tx = await contract.mintPlaylistNFT(formattedSongs, metadataURI);
    await tx.wait();
    status.textContent = `Success! Your playlist NFT has been minted. Transaction hash: ${tx.hash}`;
  } catch (err) {
    console.error(err);
    status.textContent = `Error: ${err.message || err}`;
  }
}
