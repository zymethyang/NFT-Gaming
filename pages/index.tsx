import { ReactNode, useEffect, useState } from "react";
import { getRandomFishData } from "../constants";
import { LocalStorageKeys } from "../enum";
import { useOwner, useSigner } from "../hooks";
import { IFish } from "../interfaces";
import { connectWallet, getCurrentWalletConnected } from "../utils";
import {
  changeItemOwner,
  createAward,
  createContractAddress,
  destroyItem,
} from "../utils/nft";
import { randomIntFromInterval } from "../utils/number";
import CardItem from "../components/CardItem";
import FishingModal from "../components/FishingModal";
import { Button } from "reactstrap";
import styles from "./index.module.scss";

const HomePage = () => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [walletAddress, setWallet] = useState<string>("");
  const [totalFish, setTotalFish] = useState<IFish[]>([]);
  const [status, setStatus] = useState<string | ReactNode>("");
  const [isOpenFishingModal, setIsOpenFishingModal] = useState<boolean>(false);

  const { signer } = useSigner();

  useOwner(setTotalFish, contractAddress);

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

  async function startFishing(): Promise<void> {
    if (signer) {
      const generateSeconds: number = randomIntFromInterval(0, 0);
      setIsOpenFishingModal(true);
      setTimeout(() => {
        const fishDetail: IFish = getRandomFishData(walletAddress);
        alert("You have already got a fish, you need to pay for tax.");
        setIsOpenFishingModal(false);
        createAward(JSON.stringify(fishDetail), contractAddress, signer);
      }, generateSeconds * 1000);
    }
  }

  async function handleClearItem(order: number): Promise<void> {
    if (signer) {
      await destroyItem(contractAddress, signer, order);
    }
  }

  async function handleChangeItem(order: number): Promise<void> {
    if (signer) {
      const toWallet = prompt("Input receiver wallet");
      if (toWallet) {
        await changeItemOwner(
          contractAddress,
          signer,
          toWallet,
          order
        );
      }
    }
  }

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    const address = localStorage.getItem(LocalStorageKeys.CONTRACT_ADDRESS);
    if (address) {
      setContractAddress(address);
    }
  }, []);

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
        <div>{`Your player ID: ${contractAddress}`}</div>
        {!contractAddress && (
          <button onClick={() => createContractAddress(setContractAddress)}>
            Get Player ID
          </button>
        )}
        <Button
          className={styles.fishingButton}
          color="primary"
          onClick={() => startFishing()}
        >
          Fishing
        </Button>
        <div className={styles.fishWrapper}>
          {Array.isArray(totalFish) &&
            totalFish.map((fish: IFish, index: number) => (
              <CardItem
                onClear={() => handleClearItem(index + 1)}
                onChangeOwner={() => handleChangeItem(index + 1)}
                fish={fish}
                order={index + 1}
                key={index}
              />
            ))}
        </div>
        <FishingModal isOpen={isOpenFishingModal} />
      </div>
    </div>
  );
};

export default HomePage;
