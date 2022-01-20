/* eslint-disable @next/next/no-img-element */
import { IDiamond } from "../../interfaces";
import styles from "./diamondItem.module.scss";

interface IDiamondItemProps {
  diamond: IDiamond;
  order: number;
  isDisableReceipt?: boolean;
  isDisableCheckout?: boolean;
  onClickCreateReceipt: () => void;
  onClickViewReceipt: () => void;
  onClickViewHistory: () => void;
  onClickCheckoutPayment: () => void;
}

const DiamondItem = (props: IDiamondItemProps) => {
  const {
    diamond,
    order,
    isDisableReceipt,
    isDisableCheckout,
    onClickCreateReceipt,
    onClickViewReceipt,
    onClickViewHistory,
    onClickCheckoutPayment,
  } = props;

  return (
    <div className={styles.container}>
      <div className={styles.order}>{order}</div>
      <div
        className={styles.name}
      >{`${diamond?.name} \n${diamond?.diamondId}`}</div>
      <div className={styles.imageWrapper}>
        {diamond?.image && (
          <img
            src={diamond?.image}
            width={100}
            height={100}
            alt={diamond.name}
          />
        )}
      </div>
      <div>{diamond?.company}</div>
      {!isDisableReceipt && (
        <button className={styles.destroyButton} onClick={onClickCreateReceipt}>
          Create receipt
        </button>
      )}
      <button className={styles.destroyButton} onClick={onClickViewReceipt}>
        View receipt
      </button>
      {!isDisableCheckout && (
        <button
          className={styles.destroyButton}
          onClick={onClickCheckoutPayment}
        >
          Checkout payment
        </button>
      )}
      <button className={styles.destroyButton} onClick={onClickViewHistory}>
        View history
      </button>
    </div>
  );
};

export default DiamondItem;
