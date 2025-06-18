"use client";

import Image from 'next/image';
import { formatTimeAgo } from '@/lib/utils';

// Cast ka type import hata diya gaya hai
interface ChatMessageProps {
  cast: any; // Hum 'any' use kar rahe hain
}

export default function ChatMessage({ cast }: ChatMessageProps) {
  // Neynar SDK ka timestamp format alag hai
  const timestamp = new Date(cast.timestamp).getTime() / 1000;

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-navy-dark/50 rounded-lg">
      <Image
        src={cast.author.pfp_url || '/default-avatar.png'}
        alt={`${cast.author.username}'s avatar`}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 flex-wrap">
          <p className="font-bold text-white text-sm">
            {cast.author.display_name}
          </p>
          <p className="text-gray-400 text-xs">
            @{cast.author.username}
          </p>
          <p className="text-gray-500 text-xs">
            · {formatTimeAgo(timestamp)}
          </p>
        </div>
        <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap break-words">{cast.text}</p>
      </div>
    </div>
  );
}