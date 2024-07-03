"use client";
import { useContext, useEffect, useState } from "react";
import { context } from "@/components/Utils";
import { FaTimes } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export interface IBetSlipBet {
  chosen: string;
  bet: string;
  match: string;
  odds: number;
}

function Bet(bet: IBetSlipBet) {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 py-2">
      <div className="flex-1 pr-4">
        <p className="text-gray-200">
          <span className="font-bold">{bet.chosen}</span> - {bet.bet}
        </p>
        <p className="text-sm text-gray-400">{bet.match}</p>
      </div>
      <div className="flex items-center justify-center flex-row">
        <p className="text-white text-md pr-2">{bet.odds}</p>
        <FaTimes className="text-gray-400" />
      </div>
    </div>
  );
}

export default function Betslip() {
  const [expand, setExpand] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(0);
  const { bets, show, setShow, setBets } = useContext(context);

  useEffect(() => {
    const body = document.querySelector("body")!;
    body.style.overflow = expand ? "hidden" : "auto";
  }, [expand]);

  return (
    show && (
      <>
        <div
          className={`fixed bottom-0 left-0 w-full bg-gray-700 text-white flex justify-center items-end z-[150] transition-opacity mb-16`}
        >
          <div className="flex items-center justify-between w-full p-4">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold">Betslip</p>
            </div>
            <div className="flex items-center gap-5">
              <p className="text-sm text-gray-400">
                {bets.length} {bets.length === 1 ? "bet" : "bets"}
              </p>
              <button
                onClick={() => setExpand(!expand)}
                className="text-bb-accent hover:text-gray-400"
              >
                <FaChevronUp />
              </button>
            </div>
          </div>
        </div>
        {expand && (
          <>
            <div
              onClick={() => {
                setShow(false);
                setExpand(false);
              }}
              className={`fixed bottom-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 text-white flex justify-center items-end z-[150] transition-opacity ${
                show ? "opacity-100" : "opacity-0"
              }`}
            ></div>
            <div className="fixed bottom-0 left-0 bg-gray-800 rounded-t-lg shadow-lg w-full max-w-md p-4 z-[151]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Betslip</h2>
                <button
                  onClick={() => {
                    setShow(false);
                    setExpand(false);
                  }}
                  className="text-bb-accent hover:text-gray-400"
                >
                  <FaChevronDown />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {bets.map((bet, index) => (
                  // TODO: Implement remove functionality
                  <Bet {...bet} key={index} />
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-neutral-400">Stake</p>
                  <input
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    type="number"
                    placeholder="5.00"
                    min="0.2"
                    className="bg-gray-700 text-white px-4 py-2 rounded-md w-24"
                  />
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-neutral-400">Possible winnings</p>
                  <p className="text-white font-bold">
                    €{" "}
                    {(
                      quantity * bets.reduce((acc, bet) => acc + bet.odds, 0)
                    ).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBets([]);
                    setShow(false);
                    setExpand(false);
                    setQuantity(0);
                  }}
                  className="bg-bb-accent hover:bg-orange-600 text-white px-4 py-2 rounded-md w-full"
                >
                  Place Bet
                </button>
              </div>
            </div>
          </>
        )}
      </>
    )
  );
}