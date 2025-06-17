
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface ChatDetailScreenProps {
  isOpen: boolean;
  onClose: () => void;
  chatContext: {
    senderName: string;
    senderAvatar?: string;
    senderAvatarAiHint?: string;
    messages: ChatMessage[];
  } | null;
  onSendMessage: (text: string) => void;
  currentUserAvatar?: string;
  currentUserAvatarAiHint?: string;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  isOpen,
  onClose,
  chatContext,
  onSendMessage,
  currentUserAvatar,
  currentUserAvatarAiHint,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      // Scroll to bottom when new messages arrive or screen opens
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        setTimeout(() => viewport.scrollTop = viewport.scrollHeight, 100);
      }
    }
  }, [chatContext?.messages, isOpen]);

  if (!isOpen || !chatContext) {
    return null;
  }

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-[60] flex flex-col" role="dialog" aria-modal="true">
      {/* Header */}
      <div className="flex items-center p-3 border-b bg-card shadow-sm sticky top-0">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2 text-muted-foreground hover:text-primary">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <Avatar className="h-9 w-9 mr-3">
          <AvatarImage src={chatContext.senderAvatar} alt={chatContext.senderName} data-ai-hint={chatContext.senderAvatarAiHint || "profile avatar"}/>
          <AvatarFallback>{chatContext.senderName.substring(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold text-foreground truncate">{chatContext.senderName}</h2>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-grow p-4 space-y-4 bg-muted/30">
        {chatContext.messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end gap-2 max-w-[80%]",
              msg.isSender ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <Avatar className="h-7 w-7 self-end mb-0.5">
              <AvatarImage src={msg.isSender ? currentUserAvatar : msg.avatar} alt="User" data-ai-hint={msg.isSender ? currentUserAvatarAiHint : msg.avatarAiHint}/>
              <AvatarFallback className="text-xs">
                {msg.isSender ? 'ME' : chatContext.senderName.substring(0,1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "p-2.5 rounded-lg shadow-sm",
                msg.isSender ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none border"
              )}
            >
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              <p className={cn(
                  "text-xs mt-1",
                  msg.isSender ? "text-primary-foreground/70 text-right" : "text-muted-foreground/80 text-left"
              )}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t bg-card sticky bottom-0">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            className="min-h-[40px] max-h-[100px] resize-none text-sm"
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()} size="icon" className="h-10 w-10 flex-shrink-0">
            <PaperAirplaneIcon className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailScreen;
