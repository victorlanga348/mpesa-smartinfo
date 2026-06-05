'use client'

import { useEffect, useRef, useState } from 'react'
import { Message } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ShieldCheck } from 'lucide-react'

interface ChatBoxProps {
  agentId: string
  agentName: string
  onPing?: () => void
}

const STORAGE_KEY = 'smartinfo_messages'

function getCurrentUser() {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('smartinfo_user')
  return stored ? JSON.parse(stored) : null
}

function getConversationKey(userId: string, otherId: string) {
  return [userId, otherId].sort().join('-')
}

function readMessages(userId: string, otherId: string): Message[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  const allMessages = stored ? JSON.parse(stored) : {}
  return allMessages[getConversationKey(userId, otherId)] || []
}

function writeMessages(userId: string, otherId: string, messages: Message[]) {
  const stored = localStorage.getItem(STORAGE_KEY)
  const allMessages = stored ? JSON.parse(stored) : {}
  allMessages[getConversationKey(userId, otherId)] = messages
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allMessages))
}

export function ChatBox({ agentId, agentName, onPing }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (!currentUser) return
    setMessages(readMessages(currentUser.id, agentId))
    setLoading(false)
  }, [agentId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const persistMessages = (nextMessages: Message[]) => {
    if (!user) return
    setMessages(nextMessages)
    writeMessages(user.id, agentId, nextMessages)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !user) return

    const now = new Date()
    const customerMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: agentId,
      text: inputText.trim(),
      timestamp: now,
      read: false,
    }

    const nextMessages = [...messages, customerMessage]
    persistMessages(nextMessages)
    setInputText('')

    window.setTimeout(() => {
      const reply: Message = {
        id: `msg-${Date.now()}-agent`,
        senderId: agentId,
        receiverId: user.id,
        text: 'Recebi a sua mensagem. Envie o pedido de disponibilidade para eu confirmar.',
        timestamp: new Date(),
        read: false,
      }
      persistMessages([...nextMessages, reply])
    }, 700)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-red-100 bg-[#E60000] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">{agentName}</h3>
            <p className="text-sm text-white/80">Chat com agente M-Pesa</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Carregando mensagens...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="font-semibold text-gray-700">Nenhuma conversa ainda</p>
            <p className="mt-2 text-sm text-gray-400">Pergunte sobre disponibilidade, localizacao ou tempo de espera.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-lg px-4 py-2 shadow-sm ${
                  msg.senderId === user?.id
                    ? 'bg-[#E60000] text-white'
                    : 'bg-gray-100 text-[#4A4A4A]'
                }`}
              >
                <p className="break-words text-sm">{msg.text}</p>
                <p className={`mt-1 text-[11px] ${msg.senderId === user?.id ? 'text-white/70' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-3 border-t border-gray-200 p-3">
        {onPing && (
          <Button onClick={onPing} variant="outline" className="w-full rounded-full border-red-200 text-[#E60000]">
            Confirmar disponibilidade
          </Button>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Escreva sua mensagem..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="rounded-full"
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="rounded-full bg-[#E60000] text-white hover:bg-red-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
