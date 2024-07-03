import { createContext } from "react";
import { IBetSlipBet } from "./BetSlip";

type IContext = {
  bets: IBetSlipBet[];
  setBets: (bets: IBetSlipBet[]) => void;
  show: boolean;
  setShow: (show: boolean) => void;
};

export const context = createContext<IContext>({
  bets: [],
  setBets: () => void 0,
  show: false,
  setShow: () => void 0,
});
