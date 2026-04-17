'use client';

import { useMemo, useState } from 'react';
import { Paperclip, SendHorizontal, Smile } from 'lucide-react';
import { ConversationListItem } from '@/components/inbox/conversation-list-item';
import { ChatMessageBubble } from '@/components/inbox/chat-message-bubble';
import { RightPanelCard } from '@/components/inbox/right-panel-card';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/search-input';
import { TagBadge } from '@/components/ui/tag-badge';
import { useConversations, useMessages, useSendMessage } from '@/hooks/use-inbox';
import { useInboxStore } from '@/store/inbox-store';

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'unread', label: 'Não lidas' },
  { key: 'mine', label: 'Minhas' },
  { key: 'pending', label: 'Aguardando' },
  { key: 'closed', label: 'Encerradas' },
] as const;

export default function InboxPage() {
  const { filter, setFilter, activeConversationId, setActiveConversation, search, setSearch } = useInboxStore();
  const [draft, setDraft] = useState('');

  const conversationsQuery = useConversations(filter);
  const conversations = useMemo(
    () => (conversationsQuery.data ?? []).filter((conv) => (conv.contact.name || '').toLowerCase().includes(search.toLowerCase())),
    [conversationsQuery.data, search],
  );

  const activeConversation = conversations.find((item) => item.id === activeConversationId) ?? conversations[0];
  const messagesQuery = useMessages(activeConversation?.id);
  const sendMessage = useSendMessage(activeConversation?.id);

  async function handleSendMessage() {
    if (!draft.trim() || !activeConversation) return;
    await sendMessage.mutateAsync(draft.trim());
    setDraft('');
  }

  return (
    <div className="grid h-[calc(100vh-7rem)] grid-cols-12 gap-4">
      <section className="col-span-3 flex flex-col rounded-2xl border border-slate-200 bg-white p-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar conversa..." />
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${filter === item.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2 overflow-y-auto pr-1">
          {conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === activeConversation?.id}
              onClick={() => setActiveConversation(conversation.id)}
            />
          ))}
        </div>
      </section>

      <section className="col-span-6 flex flex-col rounded-2xl border border-slate-200 bg-slate-50">
        {activeConversation ? (
          <>
            <header className="border-b border-slate-200 bg-white px-4 py-3">
              <h3 className="font-semibold text-slate-900">{activeConversation.contact.name ?? 'Contato'}</h3>
              <p className="text-xs text-slate-500">
                {activeConversation.queue?.name ?? 'Sem fila'} • {activeConversation.channel?.name ?? 'Sem canal'}
              </p>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {(messagesQuery.data ?? []).map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
              {!messagesQuery.data?.length && <EmptyState title="Sem mensagens" description="Conversa ainda não possui histórico." />}
            </div>

            <footer className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
              <button className="rounded-lg border border-slate-200 p-2 text-slate-500"><Paperclip className="h-4 w-4" /></button>
              <button className="rounded-lg border border-slate-200 p-2 text-slate-500"><Smile className="h-4 w-4" /></button>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                placeholder="Digite uma mensagem..."
              />
              <button
                onClick={handleSendMessage}
                className="rounded-lg bg-slate-900 px-3 py-2 text-white disabled:opacity-50"
                disabled={sendMessage.isPending}
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </footer>
          </>
        ) : (
          <EmptyState title="Selecione uma conversa" description="Escolha uma conversa para visualizar o atendimento." />
        )}
      </section>

      <aside className="col-span-3 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
        {activeConversation ? (
          <>
            <RightPanelCard title="Contato">
              <p className="text-sm font-semibold">{activeConversation.contact.name ?? 'Sem nome'}</p>
              <p className="text-xs text-slate-500">{activeConversation.contact.phone ?? '-'}</p>
              <p className="text-xs text-slate-500">{activeConversation.contact.email ?? '-'}</p>
            </RightPanelCard>

            <RightPanelCard title="Tags">
              <div className="flex flex-wrap gap-1">
                {activeConversation.tags?.length ? (
                  activeConversation.tags.map((item) => (
                    <TagBadge key={item.tag.id} name={item.tag.name} color={item.tag.color} />
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Sem tags</p>
                )}
              </div>
            </RightPanelCard>

            <RightPanelCard title="Ações">
              <div className="grid gap-2">
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Assumir</button>
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Transferir</button>
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Encerrar</button>
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Mover estágio</button>
              </div>
            </RightPanelCard>
          </>
        ) : (
          <EmptyState title="Sem conversa ativa" />
        )}
      </aside>
    </div>
  );
}
