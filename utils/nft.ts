import { ethers, ContractFactory } from "ethers";
import { getCapstoneContract } from "./contract";
import { getSigner } from "../utils/contract";
import { LocalStorageKeys } from "../enum";
import { IFish } from "../interfaces";

export async function createContractAddress(
  setContractAddress: (contractAddress: string) => void
): Promise<void> {
  const capstoneContract = getCapstoneContract();
  const signer = getSigner();
  const factory = new ContractFactory(
    capstoneContract.abi,
    capstoneContract.bytecode,
    signer
  );
  const contract = await factory.deploy();
  localStorage.setItem(LocalStorageKeys.CONTRACT_ADDRESS, contract.address);
  setContractAddress(contract.address);
}

export async function createAward(
  tokenURI: string,
  contractAddress: string,
  signer: ethers.providers.JsonRpcSigner
): Promise<void> {
  const contract = getCapstoneContract();
  if (contractAddress) {
    const capstoneContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
    await capstoneContract.mintItem(tokenURI);
  }
}

export async function getOwnerItems(
  setTotalFish: (totalFish: IFish[]) => void,
  contractAddress: string,
  signer: ethers.providers.JsonRpcSigner
): Promise<void> {
  const contract = getCapstoneContract();
  const capstoneContract = new ethers.Contract(
    contractAddress,
    contract.abi,
    signer
  );
  const balanceOf = await getBalanceOf(contractAddress, signer);
  const totalFish: IFish[] = await Promise.all(
    Array.from({ length: balanceOf }).map(async (_, index: number) => {
      return JSON.parse(await capstoneContract.tokenURI(index + 1));
    })
  );
  setTotalFish(totalFish);
}

export async function getBalanceOf(
  contractAddress: string,
  signer: ethers.providers.JsonRpcSigner
): Promise<number> {
  try {
    const contract = getCapstoneContract();
    const capstoneContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
    return (await capstoneContract.getBalanceOf()).toNumber();
  } catch (error) {
    return 0;
  }
}

export async function destroyItem(
  contractAddress: string,
  signer: ethers.providers.JsonRpcSigner,
  tokenId: number
): Promise<void> {
  const contract = getCapstoneContract();
  if (tokenId) {
    const capstoneContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
    await capstoneContract.destroyItem(tokenId);
  }
}

export async function changeItemOwner(
  contractAddress: string,
  signer: ethers.providers.JsonRpcSigner,
  to: string,
  tokenId: number
): Promise<void> {
  const contract = getCapstoneContract();
  if (tokenId) {
    const capstoneContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
    await capstoneContract.changeItemOwner(to, tokenId);
  }
}
