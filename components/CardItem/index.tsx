/* eslint-disable @next/next/no-img-element */
import { IFish } from "../../interfaces";
import styles from "./cardItem.module.scss";

interface ICardItemProps {
  fish: IFish;
  order: number;
  onClear: () => void;
  onChangeOwner: () => void;
}

const CardItem = (props: ICardItemProps) => {
  const { fish, order, onClear, onChangeOwner } = props;

  return (
    <div className={styles.container}>
      <div className={styles.order}>{order}</div>
      <div className={styles.name}>{fish?.name}</div>
      <div className={styles.imageWrapper}>
        {fish?.image && (
          <img src={fish?.image} width={100} height={100} alt={fish.name} />
        )}
      </div>
      <div>{fish?.fishedBy}</div>
      <button className={styles.destroyButton} onClick={onClear}>
        Destroy
      </button>
      <button className={styles.changeOwner} onClick={onChangeOwner}>
        Change owner
      </button>
    </div>
  );
};

export default CardItem;
