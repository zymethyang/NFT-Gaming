require("dotenv").config();
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const REACT_APP_PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const REACT_APP_PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(REACT_APP_API_URL);

const contract = require("../artifacts/contracts/Diamond.sol/Diamond.json");

async function initHistory(contractAddress) {
  const diamondContract = new web3.eth.Contract(contract.abi, contractAddress);

  const initDiamondPrice = 100;
  const nonce = await web3.eth.getTransactionCount(
    REACT_APP_PUBLIC_KEY,
    "latest"
  );
  const tx = {
    from: REACT_APP_PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    maxPriorityFeePerGas: 1999999987,
    data: diamondContract.methods
      .updateHistory(REACT_APP_PUBLIC_KEY, initDiamondPrice)
      .encodeABI(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    tx,
    REACT_APP_PRIVATE_KEY
  );
  const transactionReceipt = await web3.eth.sendSignedTransaction(
    signedTx.rawTransaction
  );

  console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}

const diamondContracts = [
  "0x2ba6D85A6bD931114A6756baa630639e46D67C02",
  "0xC03D13b5126049a0aadfe05f88EF9a661715CC38",
  "0xe6F23d137E824e3F5c09DD9040E9AE5575eC40d3",
];

(async () => {
  for (let contractDetail of diamondContracts) {
    await initHistory(contractDetail);
  }
})();
