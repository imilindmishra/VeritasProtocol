// File: app/chats/page.tsx
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Web3 from "web3";
import { contractAddress, contractABI } from "@/utils/contract";
import { mockChats, mockMarkets } from "@/utils/mockData";
import BetModal from "@/components/BetModal";

// Add type for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ChatInterface() {
  const [selectedMarket, setSelectedMarket] = useState(mockMarkets[0]);
  const [messages, setMessages] = useState(mockChats.filter((chat) => chat.marketId === selectedMarket.id));
  const [newMessage, setNewMessage] = useState("");
  const [showBetModal, setShowBetModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [odds, setOdds] = useState({ yes: 50, no: 50 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch odds from contract
  useEffect(() => {
    const fetchOdds = async () => {
      if (!window.ethereum) return;
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      try {
        const yesBets = await contract.methods.totalBets(true).call();
        const noBets = await contract.methods.totalBets(false).call();
        const total = Number(yesBets) + Number(noBets);
        if (total > 0) {
          const yesPercent = Math.round((Number(yesBets) / total) * 100);
          setOdds({ yes: yesPercent, no: 100 - yesPercent });
        }
      } catch (error) {
        console.error("Failed to fetch odds:", error);
      }
    };
    fetchOdds();
    const interval = setInterval(fetchOdds, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      marketId: selectedMarket.id,
      sender: "You",
      message: newMessage,
      badge: "Active Bettor",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleMarketSelect = (market: (typeof mockMarkets)[0]) => {
    setSelectedMarket(market);
    setMessages(mockChats.filter((chat) => chat.marketId === market.id));
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#2C2F3A]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed lg:relative lg:translate-x-0 w-80 lg:w-1/4 h-full bg-[#1A2238] p-4 border-r border-[#BF40BF] z-50 lg:z-0 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-orbitron text-2xl text-[#39FF14] font-bold">Prediction Markets</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white hover:text-[#39FF14]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {mockMarkets.map((market, index) => (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleMarketSelect(market)}
              className={`bg-[#2C2F3A] border-[#BF40BF] border rounded-lg p-4 text-white cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_0_8px_#BF40BF] transition-all duration-200 ${
                selectedMarket.id === market.id ? "border-2 shadow-[0_0_8px_#BF40BF]" : ""
              }`}
            >
              <h3 className="font-inter text-lg mb-2">{market.question}</h3>
              <div className="flex gap-2">
                <span className="text-[#39FF14] text-sm bg-[#39FF14]/20 px-2 py-1 rounded">
                  Yes: {odds.yes}%
                </span>
                <span className="text-[#BF40BF] text-sm bg-[#BF40BF]/20 px-2 py-1 rounded">
                  No: {odds.no}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.aside>
      {/* Main Area */}
      <div className="flex-1 lg:w-3/4 flex flex-col">
        {/* Odds Display Header */}
        <header className="bg-[#1A2238] p-4 border-b border-[#BF40BF]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-12 h-12 bg-[#39FF14] text-[#1A2238] rounded-lg flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="font-inter text-lg text-white font-medium">{selectedMarket.question}</h1>
                <p className="text-[#D3D3D3] text-sm">{messages.length} participants</p>
              </div>
            </div>
            {/* Animated Pie Chart */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
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
                    strokeDasharray={`${odds.yes}, 100`}
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${odds.yes}, 100` }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#39FF14]">{odds.yes}%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-inter text-lg text-white">Current Odds</div>
                <div className="text-[#39FF14] text-sm">Yes: {odds.yes}%</div>
                <div className="text-[#BF40BF] text-sm">No: {odds.no}%</div>
              </div>
            </div>
          </div>
        </header>
        {/* Chat Feed */}
        <div className="flex-1 p-4 bg-[#2C2F3A] overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"} animate-slide-in`}
              >
                <div className={`max-w-xs ${message.sender === "You" ? "order-2" : "order-1"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#39FF14] font-inter text-sm">{message.sender}</span>
                    <span className="bg-[#39FF14] text-[#1A2238] text-xs px-2 py-1 rounded-full font-medium">
                      {message.badge}
                    </span>
                  </div>
                  <div
                    className={`bg-[#1A2238] text-white p-3 rounded-lg ${
                      message.sender === "You" ? "bg-[#BF40BF]" : ""
                    }`}
                  >
                    <p className="text-base">{message.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
        <div className="bg-[#1A2238] p-4 border-t border-[#BF40BF]">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowBetModal(true)}
              className="bg-[#BF40BF] text-white px-4 py-2 rounded-lg hover:rotate-[360deg] transition-transform duration-500"
            >
              Place Bet
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#2C2F3A] border-[#BF40BF] border text-white p-2 rounded-lg focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]"
            />
            <button
              type="submit"
              className="bg-[#39FF14] text-[#1A2238] px-4 py-2 rounded-lg focus:animate-pulse-custom"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      {/* Bet Modal */}
      <BetModal isOpen={showBetModal} onClose={() => setShowBetModal(false)} market={selectedMarket} />
    </div>
  );
}