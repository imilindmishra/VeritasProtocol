// File: frontend/app/create/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useRouter } from 'next/navigation';
import { marketFactoryConfig } from '@/lib/contracts';

export default function CreateMarketPage() {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError, error, data } = useWaitForTransactionReceipt({ 
    hash,
  });

  // Handle transaction success or error
  useEffect(() => {
    if (isSuccess) {
      console.log('Market created successfully!', data);
      setStatus('Market created successfully! Redirecting...');
      alert('Market created successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
    if (isError && error) {
      console.error("Transaction Error:", error);
      setStatus(`Error creating market: ${error.message}`);
      setIsLoading(false);
    }
  }, [isSuccess, isError, error, data, router]);

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !description || !deadline) {
      alert('Please fill all fields.');
      return;
    }
    setIsLoading(true);

    // --- STEP 1: IPFS UPLOAD ---
    setStatus('Uploading market data to IPFS...');
    let ipfsHash = '';
    try {
      const response = await fetch('/api/ipfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, description }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'IPFS upload failed');
      }
      ipfsHash = data.ipfsHash;
      setStatus('IPFS upload successful! Creating market on-chain...');
    } catch (error: any) {
      console.error(error);
      setStatus(`Error uploading to IPFS: ${error.message}`);
      setIsLoading(false);
      return;
    }

    // --- STEP 2: SMART CONTRACT CALL ---
    try {
      // Convert deadline string to Unix timestamp in seconds
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

      writeContract({
        ...marketFactoryConfig,
        functionName: 'createMarket',
        args: [question, BigInt(deadlineTimestamp), ipfsHash],
      });
    } catch (error: any) {
      console.error(error);
      setStatus(`Error initiating transaction: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">
        Create a New Market
      </h1>
      <form onSubmit={handleCreateMarket} className="bg-charcoal p-8 rounded-xl space-y-6">
        <div>
          <label htmlFor="question" className="block text-lg font-medium text-gray-300 mb-2">
            Market Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Will BTC hit $100K by Q4 2025?"
            className="w-full px-4 py-3 bg-navy-dark border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">This is the short question displayed on the market card.</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details, rules, or sources for your market..."
            className="w-full px-4 py-3 bg-navy-dark border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
            required
          />
           <p className="text-xs text-gray-500 mt-1">This data will be stored on IPFS.</p>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-lg font-medium text-gray-300 mb-2">
            Betting Deadline
          </label>
          <input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-3 bg-navy-dark border border-gray-600 rounded-lg text-white focus:border-neon-green focus:outline-none"
            required
          />
           <p className="text-xs text-gray-500 mt-1">Users cannot place bets after this time.</p>
        </div>

        <button 
          type="submit"
          disabled={isLoading || isConfirming}
          className="w-full py-4 bg-neon-green text-navy-dark font-bold rounded-lg text-lg glow-button hover:bg-neon-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Market...' : 'Create Market'}
        </button>

        {(isLoading || status) && (
            <div className="text-center text-gray-300 mt-4">
                <p>{isConfirming ? 'Waiting for transaction confirmation...' : status}</p>
                {hash && <p className="text-sm text-green-400 mt-2 break-all">Tx Hash: {hash}</p>}
            </div>
        )}
      </form>
    </div>
  );
}