const { ethers } = require("hardhat");

async function main() {
  const DiamondContract = await ethers.getContractFactory("Diamond");
  const diamonds = [
    {
      name: "5 Carat diamond",
      image: "5-carat-diamond",
      company: "1st century diamond",
    },
    {
      name: "7 Carat diamond",
      image: "7-carat-diamond",
      company: "1st century diamond",
    },
    {
      name: "Blue diamond",
      image: "blue-diamond",
      company: "1st century diamond",
    },
  ];
  for (let diamond of diamonds) {
    const diamondContract = await DiamondContract.deploy(
      diamond.image,
      diamond.name,
      diamond.company
    );
    console.log("Diamond contract address:", diamondContract.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
