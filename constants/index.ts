import { IFish } from "../interfaces";
import { randomIntFromInterval } from "../utils/number";

export function getRandomFishData(ownerId: string): IFish {
  const fishData: IFish[] = [
    {
      fishedBy: ownerId,
      image: "ca-do.jpg",
      name: "Cá đỏ",
    },
    {
      fishedBy: ownerId,
      image: "ca-hong.jpg",
      name: "Cá hồng",
    },
    {
      fishedBy: ownerId,
      image: "ca-tran.jpg",
      name: "Cá trắng",
    },
  ];
  const randomFish = fishData[randomIntFromInterval(0, 2)];
  return randomFish;
}
