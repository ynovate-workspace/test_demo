/* scripts/deploy.js */
const hre = require("hardhat");
const fs = require('fs');
const { verify } = require('../utils/verify')

const LOCAL_NETWORKS = ["localhost", "ganache"]

async function main() {
  const NFT_Name = "SupDucks Painter"
  const NFT_Symbol = "SUPDP"
  const FEE = "0.001"
  const MINT_FEE = hre.ethers.utils.parseEther(FEE, "ether")
  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS

  const NFTMinter = await hre.ethers.getContractFactory("NFTMinter")
  const nftContract = await NFTMinter.deploy(NFT_Name, NFT_Symbol, MINT_FEE, TREASURY_ADDRESS)

  await nftContract.deployed();
  console.log("nft contract deployed to:", nftContract.address);

  /* this code writes the contract addresses and network deployed in to a local */
  /* file named config.js that we can use in the app */
  fs.writeFileSync('../src/utils/contracts-config.js', `
  export const contractAddress = "${nftContract.address}"
  export const ownerAddress = "${nftContract.signer.address}"
  export const networkDeployedTo = "${hre.network.config.chainId}"
  `)

  if (!LOCAL_NETWORKS.includes(hre.network.name) && hre.config.etherscan.apiKey !== "") {
    await nftContract.deployTransaction.wait(6)
    await verify(nftContract.address, [NFT_Name, NFT_Symbol, MINT_FEE, TREASURY_ADDRESS])
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
