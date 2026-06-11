"use client"

import { useState, useEffect, useRef } from "react"
import { useRole } from "@/components/providers/role-provider"
import { motion } from "framer-motion"
import { Send, User as UserIcon, MessageSquare } from "lucide-react"

export default function ChatPage() {
  const { role, userProfile } = useRole()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat?role=${role}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [role])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const tempMessage = {
      id: Date.now().toString(),
      senderName: userProfile.name,
      senderRole: role,
      content: newMessage,
      createdAt: new Date().toISOString()
    }

    setMessages([...messages, tempMessage])
    setNewMessage("")

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: userProfile.name,
          senderRole: role,
          content: tempMessage.content
        })
      })
    } catch (err) {
      console.error("Failed to send message")
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col premium-card overflow-hidden">
      <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold">Chat Nội Bộ (Group)</h2>
          <p className="text-xs text-muted-foreground">Kênh trao đổi chung của toàn công ty</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Đang tải tin nhắn...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <MessageSquare className="w-10 h-10 opacity-20" />
            <p className="text-sm">Chưa có tin nhắn nào. Hãy là người bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderName === userProfile.name
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {!isMe && (
                  <span className="text-xs text-muted-foreground mb-1 ml-1 flex items-center gap-1">
                    <UserIcon className="w-3 h-3" /> {msg.senderName} ({msg.senderRole})
                  </span>
                )}
                <div 
                  className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                    isMe 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-muted text-foreground border border-border/50 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-muted/50 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  )
}
