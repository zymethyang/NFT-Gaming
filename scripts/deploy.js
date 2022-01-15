const { ethers } = require("hardhat");

async function main() {
  // Grab the contract factory
  const Capstone = await ethers.getContractFactory("Capstone");

  // Start deployment, returning a promise that resolves to a contract object
  const capstone = await Capstone.deploy(); // Instance of the contract
  console.log("Contract deployed to address:", capstone.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
