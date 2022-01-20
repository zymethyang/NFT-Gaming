import { ethers } from "ethers";
declare const window: any;

export function getCapstoneContract() {
  const contract = require("../artifacts/contracts/Capstone.sol/Capstone.json");
  return contract;
}

export function getDiamondContract() {
  const contract = require("../artifacts/contracts/Diamond.sol/Diamond.json");
  return contract;
}

export function getSigner(): ethers.providers.JsonRpcSigner {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  return signer;
}
