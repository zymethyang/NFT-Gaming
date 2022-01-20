import { IDiamond, IFish } from "../interfaces";
import { randomIntFromInterval } from "../utils/number";

export function getRandomFishData(ownerId: string): IFish {
  const fishData: IFish[] = [
    {
      fishedBy: ownerId,
      image: "ca-do.jpg",
      name: "Red fish",
    },
    {
      fishedBy: ownerId,
      image: "ca-hong.jpg",
      name: "Pink fish",
    },
    {
      fishedBy: ownerId,
      image: "ca-tran.jpg",
      name: "White fish",
    },
  ];
  const randomFish = fishData[randomIntFromInterval(0, 2)];
  return randomFish;
}
