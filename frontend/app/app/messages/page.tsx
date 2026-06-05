'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth'
import { agentService } from '@/lib/services/agent'
import { Button } from '@/components/ui/button'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { ConversationSummary, Message } from '@/lib/types'
import { parseJson } from '@/lib/runtime'

export const dynamic = 'force-dynamic'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const user = authService.getCurrentUser()

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return

      try {
        // In a real app, fetch conversations from backend
        // For now, show stored messages
        const stored = localStorage.getItem('smartinfo_messages')
        if (stored) {
          const messages = parseJson<Record<string, Message[]>>(stored, {})
          const convos = Object.entries(messages).map(([key, msgs]) => {
            const otherUser = key.split('-').find((id) => id !== user.id) || key
            return {
              id: otherUser,
              lastMessage: msgs[msgs.length - 1]?.text || 'Sem mensagens',
              timestamp: msgs[msgs.length - 1]?.timestamp || new Date(),
              unread: msgs.some((message) => message.receiverId === user.id && !message.read),
            }
          })
          setConversations(convos)
        }
      } catch (err) {
        console.error('Failed to load conversations:', err)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
        <p className="text-gray-600 mt-2">Suas conversas com agentes</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Carregando mensagens...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Nenhuma conversa ainda</p>
          <Button
            onClick={() => router.push('/app/map')}
            className="mt-4 bg-primary hover:bg-primary/90 text-white"
          >
            Encontrar Agentes
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => router.push(`/app/chat/${conv.id}`)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Agente {conv.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread && (
                  <div className="w-3 h-3 bg-primary rounded-full ml-2" />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(conv.timestamp).toLocaleString('pt-MZ')}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
