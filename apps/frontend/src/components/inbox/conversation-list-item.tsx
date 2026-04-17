import clsx from 'clsx';
import type { Conversation } from '@/types/api';
import { TagBadge } from '../ui/tag-badge';

export function ConversationListItem({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full rounded-xl border p-3 text-left transition-all',
        active ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300',
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{conversation.contact.name || 'Sem nome'}</p>
        <span className="text-xs text-slate-500">
          {conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
        </span>
      </div>
      <p className="truncate text-xs text-slate-500">{conversation.lastMessagePreview || 'Sem mensagens recentes'}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        {conversation.unreadCount > 0 && (
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">{conversation.unreadCount}</span>
        )}
        {conversation.queue && <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px]">{conversation.queue.name}</span>}
        {conversation.assignedUser && <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-700">{conversation.assignedUser.name}</span>}
        {conversation.tags?.slice(0, 2).map((tagRel) => (
          <TagBadge key={tagRel.tag.id} name={tagRel.tag.name} color={tagRel.tag.color} />
        ))}
      </div>
    </button>
  );
}
