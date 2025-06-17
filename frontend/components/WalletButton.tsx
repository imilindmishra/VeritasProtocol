// File: components/WalletButton.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Web3 from "web3";

export default function WalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xAA36A7" }], // Optimism Sepolia
        });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Failed to connect wallet. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please install MetaMask!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
      });
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  if (account) {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-3 bg-[#2C2F3A] border-2 border-[#39FF14] rounded-xl px-6 py-3"
      >
        <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse"></div>
        <span className="text-white font-medium">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={connectWallet}
      disabled={isLoading}
      className="relative group bg-transparent border-2 border-[#39FF14] text-[#39FF14] font-orbitron font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_10px_#39FF14] disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Connect Wallet"
    >
      <div className="absolute inset-0 bg-[#39FF14]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10 flex items-center gap-3">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Connect Wallet
          </>
        )}
      </div>
    </motion.button>
  );
}