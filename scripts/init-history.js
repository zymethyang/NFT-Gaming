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
  "0x6Ec1FE4a84bB67ab96141752c6d5D430381B7009",
  "0xc33F28a353038b17F49FdeD1B12686cAE881831d",
  "0xf02Ce1b62ccf9617890b560E80172827C88d8C02",
];

(async () => {
  for (let contractDetail of diamondContracts) {
    await initHistory(contractDetail);
  }
})();
