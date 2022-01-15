import { useEffect } from "react";
import { useSigner } from ".";
import { IFish } from "../interfaces";
import { getOwnerItems } from "../utils/nft";

export function useOwner(
  setTotalFish: (totalFish: IFish[]) => void,
  contractAddress: string
) {
  const { signer } = useSigner();

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    try {
      if (contractAddress && signer) {
        getOwnerItems(setTotalFish, contractAddress, signer);
      }

      setInterval(() => {
        if (contractAddress && signer) {
          getOwnerItems(setTotalFish, contractAddress, signer);
        }
      }, 5000);
    } catch (error) {
      console.log(error);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [contractAddress, signer]);
}
