import clsx from 'clsx';
import type { Message } from '@/types/api';

export function ChatMessageBubble({ message }: { message: Message }) {
  const outbound = message.direction === 'OUTBOUND';
  const internal = message.direction === 'INTERNAL';

  return (
    <div className={clsx('flex', outbound ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm',
          internal && 'border border-amber-300 bg-amber-50 text-amber-900',
          !internal && outbound && 'bg-slate-900 text-white',
          !internal && !outbound && 'bg-white text-slate-800',
        )}
      >
        {message.body && <p>{message.body}</p>}
        {!message.body && message.mediaUrl && <a href={message.mediaUrl} className="underline">Mídia anexada</a>}
        <p className={clsx('mt-1 text-[10px]', outbound ? 'text-slate-300' : 'text-slate-400')}>
          {new Date(message.createdAt).toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
