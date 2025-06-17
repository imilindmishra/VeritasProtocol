// File: components/BetModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Web3 from "web3";
import { contractAddress, contractABI } from "@/utils/contract";

interface Market {
  id: number;
  question: string;
  odds: { yes: number; no: number };
}

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: Market;
}

export default function BetModal({ isOpen, onClose, market }: BetModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes");
  const [wagerAmount, setWagerAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    setIsConfirming(true);
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const accounts = await web3.eth.getAccounts();
    try {
      await contract.methods
        .placeBet(selectedOutcome === "yes")
        .send({
          from: accounts[0],
          value: web3.utils.toWei(wagerAmount, "ether"),
        });
      alert("Bet placed successfully!");
      onClose();
      setWagerAmount("");
      setSelectedOutcome("yes");
    } catch (error) {
      console.error("Bet placement failed:", error);
      alert("Failed to place bet. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const riskLevel =
    Number.parseFloat(wagerAmount) > 1 ? "High" : Number.parseFloat(wagerAmount) > 0.5 ? "Medium" : "Low";
  const riskProgress = Number.parseFloat(wagerAmount) > 1 ? 100 : Number.parseFloat(wagerAmount) > 0.5 ? 60 : 30;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-96 w-[90vw] md:w-96 bg-[#1A2238] border-2 border-[#39FF14] rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-orbitron text-2xl text-[#39FF14] mb-4 font-bold">Place Your Bet</h2>
            <p className="text-[#D3D3D3] mb-6 text-sm">{market.question}</p>
            {/* Outcome Toggles */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#D3D3D3] mb-3">Select Outcome</label>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setSelectedOutcome("yes")}
                  className={`flex-1 bg-[#2C2F3A] text-[#39FF14] p-2 rounded-lg transition-all duration-200 ${
                    selectedOutcome === "yes" ? "translate-x-1 bg-[#39FF14]/20" : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-bold">YES</div>
                  <div className="text-sm">{market.odds.yes}%</div>
                </motion.button>
                <motion.button
                  onClick={() => setSelectedOutcome("no")}
                  className={`flex-1 bg-[#2C2F3A] text-[#BF40BF] p-2 rounded-lg transition-all duration-200 ${
                    selectedOutcome === "no" ? "translate-x-1 bg-[#BF40BF]/20" : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-bold">NO</div>
                  <div className="text-sm">{market.odds.no}%</div>
                </motion.button>
              </div>
            </div>
            {/* Wager Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#D3D3D3] mb-2">Wager Amount (ETH)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={wagerAmount}
                onChange={(e) => setWagerAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#2C2F3A] border-[#BF40BF] border text-white p-2 rounded-lg focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]"
              />
            </div>
            {/* Risk Level Progress Circle */}
            {wagerAmount && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#D3D3D3]">Risk Level</span>
                  <span
                    className={`text-sm font-bold ${
                      riskLevel === "High"
                        ? "text-red-400"
                        : riskLevel === "Medium"
                        ? "text-yellow-400"
                        : "text-[#39FF14]"
                    }`}
                  >
                    {riskLevel}
                  </span>
                </div>
                <div className="relative w-16 h-16 mx-auto">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#2C2F3A"
                      strokeWidth="3"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#39FF14"
                      strokeWidth="3"
                      strokeDasharray={`${riskProgress}, 100`}
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${riskProgress}, 100` }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                </div>
              </motion.div>
            )}
            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={onClose}
                className="flex-1 bg-[#2C2F3A] text-[#D3D3D3] px-6 py-2 rounded-lg hover:animate-shake"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                disabled={!wagerAmount || isConfirming}
                className="flex-1 bg-[#39FF14] text-[#1A2238] px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isConfirming ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#1A2238] border-t-transparent rounded-full animate-spin"></div>
                    Confirming...
                  </div>
                ) : (
                  "Confirm Bet"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}