// IPFS integration using Pinata
// Free tier: 1GB storage, 100MB/month bandwidth

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

/**
 * Upload file to IPFS via Pinata
 */
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'audio',
        uploadedAt: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result: PinataResponse = await response.json();
    return `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Get HTTP URL for IPFS content
 */
export function getIPFSUrl(ipfsUrl: string): string {
  const hash = ipfsUrl.replace('ipfs://', '');
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

/**
 * Upload multiple files to IPFS
 */
export async function uploadMultipleToIPFS(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadToIPFS(file));
  return Promise.all(uploadPromises);
}

/**
 * Mock IPFS upload for development (returns local blob URL)
 */
export function mockIPFSUpload(file: File): Promise<string> {
  return new Promise((resolve) => {
    const blobUrl = URL.createObjectURL(file);
    // Simulate upload delay
    setTimeout(() => {
      resolve(`mock-ipfs://${file.name}`);
    }, 1000);
  });
}

/**
 * Check if IPFS is configured
 */
export function isIPFSConfigured(): boolean {
  return !!(PINATA_API_KEY && PINATA_SECRET_KEY);
}