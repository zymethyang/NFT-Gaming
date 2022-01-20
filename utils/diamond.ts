import { ethers } from "ethers";
import { IDiamond, IReceipt } from "../interfaces";
import { CommonError } from "../types";
import { getDiamondContract } from "./contract";

export async function createReceipt(
  contractAddress: string,
  clientName: string,
  price: string,
  signer: ethers.providers.JsonRpcSigner
): Promise<void> {
  const contract = getDiamondContract();
  if (contractAddress && signer) {
    const diamondContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
    return await diamondContract.upsertReceipt(
      clientName,
      ethers.utils.parseEther(price)
    );
  }
  return;
}

export async function checkoutPayment(
  contractAddress: string,
  price: string,
  signer: ethers.providers.JsonRpcSigner
): Promise<void> {
  const contract = getDiamondContract();
  if (contractAddress) {
    const diamondContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
    return await diamondContract.checkoutPayment({
      gasLimit: 10000000,
      value: price,
    });
  }
  return;
}

export async function lookupReceipts(
  contractAddress: string,
  signer: ethers.providers.JsonRpcSigner
) {
  const contract = getDiamondContract();
  if (contractAddress) {
    const diamondContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
    return await diamondContract.lookupReceipts();
  }
  return;
}

export async function lookupHistories(
  contractAddress: string,
  signer: ethers.providers.JsonRpcSigner
) {
  const contract = getDiamondContract();
  if (contractAddress) {
    const diamondContract = new ethers.Contract(
      contractAddress,
      contract.abi,
      signer
    );
    return await diamondContract.lookupHistories();
  }
  return;
}

export async function getDiamonds(
  setDiamondContracts: (diamondContracts: IDiamond[]) => void,
  signer: ethers.providers.JsonRpcSigner
): Promise<void> {
  const contract = getDiamondContract();

  const diamondIds: string[] = [
    "0x2ba6D85A6bD931114A6756baa630639e46D67C02",
    "0xC03D13b5126049a0aadfe05f88EF9a661715CC38",
    "0xe6F23d137E824e3F5c09DD9040E9AE5575eC40d3",
  ];

  try {
    const diamondContracts: IDiamond[] = await Promise.all(
      diamondIds?.map((diamondId: string) => {
        const diamondContract = new ethers.Contract(
          diamondId,
          contract.abi,
          signer
        );
        return diamondContract
          .lookupDiamondData()
          .then((diamond: [IDiamond, string]) => {
            const diamondDetail: IDiamond = {
              company: diamond[0]?.company,
              image: `${diamond[0]?.image}.jpeg`,
              name: diamond[0]?.name,
              diamondId: diamond[0]?.diamondId,
              owner: diamond[1],
            };
            return diamondDetail;
          });
      })
    );

    setDiamondContracts(diamondContracts);
  } catch (error) {
    if (!(error as CommonError)?.message?.includes("unknown account")) {
      throw error;
    }
  }
}
