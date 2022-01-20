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
    "0xbad19E864cF8a4499cD289c3728CA1057bD64030",
    "0x5A10F0579D17039a3518D2F9e872BA436696E109",
    "0x8D58f9E80cDF3759Cc8B9dE56Ce5a512F963E6A5",
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
