const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PlaylistNFT to Monad testnet...");

  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy the PlaylistNFT contract
  const PlaylistNFT = await ethers.getContractFactory("PlaylistNFT");
  const playlistNFT = await PlaylistNFT.deploy();

  await playlistNFT.waitForDeployment();

  const contractAddress = await playlistNFT.getAddress();
  console.log("PlaylistNFT deployed to:", contractAddress);
  console.log("Transaction hash:", playlistNFT.deploymentTransaction().hash);
  
  // Save deployment info
  const deploymentInfo = {
    network: "monad",
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    transactionHash: playlistNFT.deploymentTransaction().hash,
    timestamp: new Date().toISOString()
  };
  
  console.log("\nDeployment completed successfully!");
  console.log("Contract details:", deploymentInfo);

  // Verify the contract
  console.log("\nStart verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [] // No constructor arguments for PlaylistNFT
    });
    console.log("Successfully verified contract.");
  } catch (error) {
    console.log("Verify contract failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });