"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SearchInput } from "@/components/forms/SearchInput";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";

const CONVERSATIONS = [
  {
    id: "1",
    username: "lord007tn",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c",
    lastMessage: "gg wp bro, good games",
    time: "2h",
    unread: 0,
    online: true,
  },
  {
    id: "2",
    username: "sirius",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIDHpN23i-I4B7mHMoS0wj_PJ2Eg4Gk-6GS9HsK=s96-c",
    lastMessage: "wanna play valo tonight?",
    time: "1d",
    unread: 2,
    online: true,
  },
  {
    id: "3",
    username: "azizbecha",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocL_GUJfwCYMwPgywoGxf8FnGR1oq_IoJk_IVn-L7dPaWiR-Gzsx=s96-c",
    lastMessage: "check this clip bro",
    time: "3d",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    username: "murexhyena",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKY14j2kNBcnQ4cFTIrNUl_v-8B2rbxjr8dOGziUMwwxa_CLD8=s96-c",
    lastMessage: "let's set up a scrim",
    time: "5d",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    username: "choxel",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKCrsXsBt0lHA6pIedv1Mjp_4vxAEGs_bGqXmE0nVjhxZDB1Z8=s96-c",
    lastMessage: "you free this weekend?",
    time: "1w",
    unread: 1,
    online: true,
  },
];

const MESSAGES: Record<string, { id: string; text: string; time: string; isMine: boolean }[]> = {
  "1": [
    { id: "1", text: "yo bro up for some apex?", time: "14:20", isMine: false },
    { id: "2", text: "sure lets go, what server?", time: "14:21", isMine: true },
    { id: "3", text: "EU west, adding you now", time: "14:21", isMine: false },
    { id: "4", text: "in lobby", time: "14:22", isMine: true },
    { id: "5", text: "gg wp bro, good games", time: "15:30", isMine: false },
    { id: "6", text: "gg! let's run it again tmrw", time: "15:31", isMine: true },
  ],
  "2": [
    { id: "1", text: "bro your valorant rank?", time: "yesterday", isMine: false },
    { id: "2", text: "diamond 2, you?", time: "yesterday", isMine: true },
    { id: "3", text: "radiant 😤", time: "yesterday", isMine: false },
    { id: "4", text: "wanna play valo tonight?", time: "2h ago", isMine: false },
  ],
  "3": [
    { id: "1", text: "check this clip bro", time: "3d ago", isMine: false },
  ],
  "4": [
    { id: "1", text: "hey man, looking at your stats", time: "5d ago", isMine: false },
    { id: "2", text: "let's set up a scrim", time: "5d ago", isMine: false },
  ],
  "5": [
    { id: "1", text: "you free this weekend?", time: "1w ago", isMine: false },
  ],
};

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("1");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const conv = CONVERSATIONS.find((c) => c.id === activeId)!;
  const msgs = MESSAGES[activeId] || [];

  const filtered = CONVERSATIONS.filter(
    (c) => search.trim() === "" || c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Messages" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Messages" }]} />} />
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation list */}
          <div className="w-[280px] shrink-0 border-r border-border-default flex flex-col bg-bg-secondary">
            <div className="p-3 border-b border-border-default">
              <SearchInput
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                className="w-full"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer text-left border-b border-border-subtle ${
                    activeId === c.id ? "bg-accent-subtle border-l-2 border-l-border-accent" : "hover:bg-bg-surface-hover"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="size-10 rounded-full bg-bg-surface overflow-hidden border border-border-default">
                      <img src={c.avatar} alt={c.username} className="w-full h-full object-cover" />
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-status-online border-2 border-bg-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-text-primary">{c.username}</span>
                      <span className="text-[10px] text-text-tertiary">{c.time}</span>
                    </div>
                    <p className="text-xs text-text-secondary truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="size-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground shrink-0">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-default bg-bg-secondary">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="size-9 rounded-full bg-bg-surface overflow-hidden border border-border-default">
                    <img src={conv.avatar} alt={conv.username} className="w-full h-full object-cover" />
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 size-2 rounded-full bg-status-online border border-bg-secondary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{conv.username}</p>
                  <p className="text-xs text-text-tertiary">{conv.online ? "Online" : "Offline"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="size-8 flex items-center justify-center rounded-[var(--radius-sm)] text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer">
                  <Phone size={16} />
                </button>
                <button className="size-8 flex items-center justify-center rounded-[var(--radius-sm)] text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer">
                  <Video size={16} />
                </button>
                <button className="size-8 flex items-center justify-center rounded-[var(--radius-sm)] text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {msgs.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.isMine ? "flex-row-reverse" : ""}`}>
                  {!msg.isMine && (
                    <div className="size-7 rounded-full bg-bg-surface overflow-hidden shrink-0 border border-border-default">
                      <img src={conv.avatar} alt={conv.username} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={`max-w-[60%] px-4 py-2.5 rounded-[var(--radius-lg)] text-sm leading-relaxed ${
                      msg.isMine
                        ? "bg-accent text-accent-foreground rounded-br-sm"
                        : "bg-bg-card border border-border-default text-text-primary rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-text-tertiary shrink-0">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border-default bg-bg-secondary">
              <div className="flex items-center gap-2 bg-bg-input border border-border-default rounded-[var(--radius-lg)] px-3 py-2.5 focus-within:border-border-accent transition-colors">
                <button className="text-text-tertiary hover:text-text-secondary cursor-pointer transition-colors">
                  <Paperclip size={16} />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && message.trim()) setMessage("");
                  }}
                  placeholder={`Message ${conv.username}...`}
                  className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                />
                <button className="text-text-tertiary hover:text-text-secondary cursor-pointer transition-colors">
                  <Smile size={16} />
                </button>
                <button
                  onClick={() => setMessage("")}
                  disabled={!message.trim()}
                  className="text-text-accent hover:text-text-primary cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
