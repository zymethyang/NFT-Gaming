import { useEffect } from "react";
import { useSigner } from ".";
import { IFish } from "../interfaces";
import { getOwnerItems } from "../utils/nft";

export function useOwner(
  setTotalFish: (totalFish: IFish[]) => void,
  contractAddress: string,
  walletAddress: string
) {
  const { signer } = useSigner();

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    try {
      if (contractAddress && signer && walletAddress) {
        getOwnerItems(setTotalFish, contractAddress, walletAddress, signer);
      }

      setInterval(() => {
        if (contractAddress && signer && walletAddress) {
          getOwnerItems(setTotalFish, contractAddress, walletAddress, signer);
        }
      }, 5000);
    } catch (error) {
      console.log(error);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [contractAddress, walletAddress, signer]);
}
