import { useEffect, useState } from "react";
import { Modal } from "reactstrap";
import styles from "./fishingModal.module.scss";

interface IFishingModalProps {
  isOpen: boolean;
}

const FishingModal = (props: IFishingModalProps) => {
  const { isOpen } = props;
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    let timerRef: NodeJS.Timer;

    if (isOpen) {
      timerRef = setInterval(() => {
        setTimer((oldTime: number) => oldTime + 1);
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => {
      clearInterval(timerRef);
    };
  }, [isOpen]);

  return (
    <Modal centered isOpen={isOpen}>
      <div className={styles.container}>
        {`Fishing, please keep patient!: ${timer}s`}
      </div>
    </Modal>
  );
};

export default FishingModal;
