export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Configurações</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Tenant</h3>
          <p className="text-sm text-slate-500">Preferências gerais do tenant e identidade visual.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">Segurança</h3>
          <p className="text-sm text-slate-500">Políticas de senha, sessões e perfis de acesso.</p>
        </div>
      </div>
    </div>
  );
}
