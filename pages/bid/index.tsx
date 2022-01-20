import { ReactNode, useEffect, useState } from "react";
import { useSigner } from "../../hooks";
import { IDiamond, IDiamondHistory } from "../../interfaces";
import { connectWallet, getCurrentWalletConnected } from "../../utils";
import DiamondItem from "../../components/DiamondItem";
import styles from "./bid.module.scss";
import {
  createReceipt,
  lookupReceipts,
  lookupHistories,
  checkoutPayment,
  getDiamonds,
} from "../../utils/diamond";
import { CommonError } from "../../types";
import { ethers } from "ethers";

const CheckoutPage = () => {
  const [walletAddress, setWallet] = useState<string>("");
  const [diamondContracts, setDiamondContracts] = useState<IDiamond[]>([]);
  const [status, setStatus] = useState<string | ReactNode>("");
  const { signer } = useSigner();

  async function onPressConnectWallet(): Promise<void> {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  }

  async function fetchWallet(): Promise<void> {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
  }

  async function handleCreateReceipt(contractAddress: string): Promise<void> {
    if (signer) {
      const clientName = prompt("Enter you name?");
      if (clientName) {
        const price = prompt("Enter your price in ETH");
        if (price) {
          await createReceipt(contractAddress, clientName, price, signer);
        }
      }
    }
  }

  async function handleViewReceipt(contractAddress: string): Promise<void> {
    if (signer) {
      try {
        const receipt = await lookupReceipts(contractAddress, signer);
        const receiptDetail = {
          clientName: receipt?.clientName,
          clientWallet: receipt?.clientWallet,
          diamondId: receipt?.diamondId,
          price: `${ethers.utils.formatEther(receipt?.price?.toString())} ETH`,
          status: receipt?.status,
        };
        alert(JSON.stringify(receiptDetail));
      } catch (error: CommonError) {
        if (error?.message?.includes("Not found")) {
          alert("Not found!");
        }
      }
    }
  }

  async function handleViewHistory(contractAddress: string): Promise<void> {
    if (signer) {
      const histories = await lookupHistories(contractAddress, signer);
      const history: IDiamondHistory[] = histories?.map((history: any) => ({
        ownerAddress: history?.ownerAddress,
        price: `${ethers.utils.formatEther(history?.price?.toString())} ETH`,
      }));
      alert(JSON.stringify(history));
    }
  }

  async function handleCheckoutPayment(contractAddress: string): Promise<void> {
    if (signer) {
      const receipt = await lookupReceipts(contractAddress, signer);
      await checkoutPayment(
        contractAddress,
        receipt?.price?.toString(),
        signer
      );
    }
  }

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    let syncTimer: NodeJS.Timeout;

    if (signer) {
      getDiamonds(setDiamondContracts, signer);
      syncTimer = setInterval(() => {
        getDiamonds(setDiamondContracts, signer);
      }, 3000);
    }

    return () => {
      clearInterval(syncTimer);
    };
  }, [signer]);

  return (
    <div className={styles.container} id="container">
      <div className={styles.layout}>
        <button id="walletButton" onClick={onPressConnectWallet}>
          {walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
        <div className={styles.walletStatus}>{status}</div>
        <div className={styles.title}>Selling diamond</div>
        <div className={styles.fishWrapper}>
          {Array.isArray(diamondContracts) &&
            diamondContracts.map(
              (diamond: IDiamond, index: number) =>
                diamond?.owner?.toUpperCase() !==
                  walletAddress?.toUpperCase() && (
                  <DiamondItem
                    onClickCreateReceipt={() =>
                      handleCreateReceipt(diamond.diamondId)
                    }
                    onClickViewReceipt={() =>
                      handleViewReceipt(diamond.diamondId)
                    }
                    onClickViewHistory={() =>
                      handleViewHistory(diamond.diamondId)
                    }
                    onClickCheckoutPayment={() =>
                      handleCheckoutPayment(diamond.diamondId)
                    }
                    diamond={diamond}
                    order={index + 1}
                    key={index}
                  />
                )
            )}
        </div>
        <div className={styles.title}>Owner diamond</div>
        <div className={styles.fishWrapper}>
          {Array.isArray(diamondContracts) &&
            diamondContracts.map(
              (diamond: IDiamond, index: number) =>
                diamond?.owner?.toUpperCase() ===
                  walletAddress?.toUpperCase() && (
                  <DiamondItem
                    isDisableCheckout
                    isDisableReceipt
                    onClickCreateReceipt={() =>
                      handleCreateReceipt(diamond.diamondId)
                    }
                    onClickViewReceipt={() =>
                      handleViewReceipt(diamond.diamondId)
                    }
                    onClickViewHistory={() =>
                      handleViewHistory(diamond.diamondId)
                    }
                    onClickCheckoutPayment={() =>
                      handleCheckoutPayment(diamond.diamondId)
                    }
                    diamond={diamond}
                    order={index + 1}
                    key={index}
                  />
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
