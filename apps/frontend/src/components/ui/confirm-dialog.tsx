'use client';

export function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={onCancel}>Cancelar</button>
          <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
