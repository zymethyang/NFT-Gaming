import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getSigner } from "../utils/contract";

export function useSigner() {
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();

  useEffect(() => {
    const newSigner = getSigner();
    setSigner(newSigner);
  }, []);

  return { signer };
}
