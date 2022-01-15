require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { REACT_APP_API_URL, REACT_APP_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {},
    rinkeby: {
      url: REACT_APP_API_URL,
      accounts: [`${REACT_APP_PRIVATE_KEY}`],
    },
  },
};
