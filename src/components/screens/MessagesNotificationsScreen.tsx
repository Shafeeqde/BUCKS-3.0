
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { XMarkIcon, BellIcon, ChatBubbleOvalLeftEllipsisIcon, CheckCircleIcon, EnvelopeIcon, ExclamationTriangleIcon, GiftIcon, UserIcon } from '@heroicons/react/24/outline';
import type { MessageItem, NotificationItem, Category } from '@/types'; // Adjusted types
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MessagesNotificationsScreenProps {
  onClose: () => void;
}

const initialMessages: MessageItem[] = [
  { id: 1, sender: 'Shafeeq', senderImage: 'https://source.unsplash.com/random/40x40/?man,portrait', senderImageAiHint: 'man portrait', subject: 'Regarding your recent post', content: 'Hi, I saw your post about Diwali celebrations and wanted to share some thoughts...', timestamp: '2 hours ago', read: false },
  { id: 2, sender: 'Mikado UX UI', senderImage: 'https://source.unsplash.com/random/40x40/?company,logo', senderImageAiHint: 'company logo', subject: 'Job Application Follow-up', content: 'Dear applicant, thank you for your interest in the Graphic Designer position...', timestamp: '5 hours ago', read: false },
  { id: 3, sender: 'Admin Support', senderImage: 'https://source.unsplash.com/random/40x40/?support,icon', senderImageAiHint: 'support icon', subject: 'Welcome to Bucks!', content: 'Welcome to our platform! We are excited to have you on board.', timestamp: '1 day ago', read: true },
];

const initialNotifications: NotificationItem[] = [
  { id: 1, type: 'Like', icon: GiftIcon, content: 'Your post "Enjoying the golden hour!" received 10 new likes.', timestamp: '1 hour ago', read: false, link: '#' },
  { id: 2, type: 'Comment', icon: ChatBubbleOvalLeftEllipsisIcon, content: 'Deepthi commented on your post: "Such a beautiful view!"', timestamp: '3 hours ago', read: false, link: '#' },
  { id: 3, type: 'Follow', icon: UserIcon, content: 'Senthil Devaraj started following you.', timestamp: '6 hours ago', read: true, link: '#' },
  { id: 4, type: 'Update', icon: ExclamationTriangleIcon, content: 'New services added to the "Menu" section. Check them out!', timestamp: 'Yesterday', read: true, link: '#' },
];

const MessagesNotificationsScreen: React.FC<MessagesNotificationsScreenProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAllAsRead = () => {
    if (activeTab === 'messages') {
      setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
    } else {
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    }
  };

  const unreadMessagesCount = messages.filter(msg => !msg.read).length;
  const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <Card className="w-full h-full sm:max-w-lg sm:max-h-[90vh] shadow-2xl flex flex-col rounded-none sm:rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-xl font-semibold font-headline text-primary">
            Messages & Notifications
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <XMarkIcon className="h-5 w-5 text-muted-foreground" />
          </Button>
        </CardHeader>
        
        <Tabs defaultValue="messages" onValueChange={(value) => setActiveTab(value as 'messages' | 'notifications')} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b h-auto p-0">
            <TabsTrigger value="messages" className="py-3 text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
              <EnvelopeIcon className="mr-2 h-4 w-4" /> Messages {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-3 text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
              <BellIcon className="mr-2 h-4 w-4" /> Notifications {unreadNotificationsCount > 0 && `(${unreadNotificationsCount})`}
            </TabsTrigger>
          </TabsList>

          <div className="p-3 flex-shrink-0">
            {(activeTab === 'messages' && unreadMessagesCount > 0) || (activeTab === 'notifications' && unreadNotificationsCount > 0) ? (
              <Button size="sm" className="w-full" onClick={markAllAsRead}>
                <CheckCircleIcon className="mr-2 h-4 w-4" /> Mark all as read
              </Button>
            ) : (
                 <p className="text-sm text-center text-muted-foreground py-1">No unread items.</p>
            )}
          </div>

          <ScrollArea className="flex-grow custom-scrollbar">
            <TabsContent value="messages" className="m-0 p-3 space-y-3">
              {messages.length > 0 ? messages.map(msg => (
                <Card key={msg.id} className={cn("hover:shadow-md transition-shadow", !msg.read && "border-primary ring-1 ring-primary/20")}>
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      {msg.senderImage && (
                        <Image src={msg.senderImage} alt={msg.sender} width={40} height={40} className="rounded-full" data-ai-hint={msg.senderImageAiHint || "profile avatar"}/>
                      )}
                       {!msg.senderImage && <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">{msg.sender.substring(0,1)}</div>}
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className="font-semibold text-foreground text-sm">{msg.sender}</p>
                          <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                        </div>
                        <p className={cn("font-medium text-foreground text-sm", !msg.read && "text-primary")}>{msg.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{msg.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-muted-foreground py-10">No messages.</p>}
            </TabsContent>

            <TabsContent value="notifications" className="m-0 p-3 space-y-3">
              {notifications.length > 0 ? notifications.map(notif => (
                <Card key={notif.id} className={cn("hover:shadow-md transition-shadow", !notif.read && "border-primary ring-1 ring-primary/20")}>
                   <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      {notif.icon ? <notif.icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", !notif.read ? "text-primary" : "text-muted-foreground")} /> : <BellIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-muted-foreground"/>}
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-0.5">
                           <p className={cn("font-semibold text-foreground text-sm", !notif.read && "text-primary")}>{notif.type}</p>
                           <p className="text-xs text-muted-foreground">{notif.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{notif.content}</p>
                        {notif.link && <a href={notif.link} className="text-xs text-primary hover:underline mt-1 inline-block">View details</a>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-muted-foreground py-10">No notifications.</p>}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </Card>
    </div>
  );
};

export default MessagesNotificationsScreen;
