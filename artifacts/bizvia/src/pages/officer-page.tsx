import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle2, CircleAlert, LogOut, Send } from 'lucide-react';
import { Logo } from '@/components/bizvia-shell';
import { APPLICATIONS, DEMO_QUERY, type Query, readLocal, saveLocal } from '@/lib/bizvia-data';
import { clearDemoSession } from '@/lib/demo-auth';

export function OfficerPage() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState<Query>(() => readLocal('query', DEMO_QUERY));
  const [selected, setSelected] = useState(APPLICATIONS[0].id);
  const [draft, setDraft] = useState('');
  const app = APPLICATIONS.find((item) => item.id === selected) || APPLICATIONS[0];
  const isFactory = app.id === 'BE-FAC-2026-001';

  useEffect(() => {
    const sync = () => setQuery(readLocal('query', DEMO_QUERY));
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const raiseQuery = () => {
    if (!draft.trim()) return;
    const next: Query = { status: 'Open', message: draft.trim(), dueInDays: 2 };
    saveLocal('query', next);
    setQuery(next);
    setDraft('');
  };

  return <div className="min-h-[100dvh] bg-[hsl(var(--background))]">
    <header className="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-4 lg:px-9">
      <div className="flex items-center gap-4"><Logo /><span className="rounded-full bg-[hsl(var(--secondary)/.35)] px-3 py-1 text-[11px] font-bold text-[hsl(var(--primary))]">Government Officer · Demo</span></div>
      <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" onClick={() => { clearDemoSession(); setLocation('/login'); }}><LogOut className="h-4 w-4" /> Sign out</button>
    </header>
    <main className="mx-auto grid max-w-6xl gap-6 p-5 lg:grid-cols-[.8fr_1.2fr] lg:p-9">
      <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <p className="eyebrow text-[hsl(var(--muted-foreground))]">Review queue</p>
        <h2 className="display mt-2 text-xl font-extrabold text-[hsl(var(--primary))]">Applications assigned to you</h2>
        <div className="mt-4 divide-y divide-[hsl(var(--border))]">
          {APPLICATIONS.map((item) => <button key={item.id} onClick={() => setSelected(item.id)} className={`block w-full px-2 py-4 text-left transition-colors hover:bg-[hsl(var(--muted)/.5)] ${selected === item.id ? 'bg-[hsl(var(--muted)/.6)]' : ''}`}>
            <p className="text-sm font-bold text-[hsl(var(--primary))]">{item.name}</p>
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Acme Foods Pvt. Ltd. · {item.id}</p>
            <p className="mt-1 text-[11px] font-bold text-[hsl(var(--accent))]">{item.id === 'BE-FAC-2026-001' ? (query.status === 'Responded' ? 'Business responded · review' : 'Waiting for business') : item.status}</p>
          </button>)}
        </div>
      </section>
      <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7">
        <p className="eyebrow text-[hsl(var(--accent))]">{app.id}</p>
        <h2 className="display mt-2 text-2xl font-extrabold text-[hsl(var(--primary))]">{app.name}</h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{app.department} · submitted {app.submittedAt}</p>
        {isFactory ? <>
          <div className={`mt-6 rounded-xl border p-4 ${query.status === 'Responded' ? 'border-[hsl(var(--chart-4)/.3)] bg-[hsl(var(--chart-4)/.07)]' : 'border-[hsl(var(--accent)/.3)] bg-[hsl(var(--accent)/.07)]'}`}>
            <p className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]">{query.status === 'Responded' ? <CheckCircle2 className="h-4 w-4 text-[hsl(var(--chart-4))]" /> : <CircleAlert className="h-4 w-4 text-[hsl(var(--accent))]" />} {query.status === 'Responded' ? 'Business has responded' : 'Query sent · waiting for business'}</p>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]"><b className="text-[hsl(var(--primary))]">Your query:</b> {query.message}</p>
            {query.status === 'Responded' && <p className="mt-3 rounded-lg bg-[hsl(var(--card))] p-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]"><b className="text-[hsl(var(--primary))]">Business response:</b> {query.response}</p>}
          </div>
          <label className="mt-6 block text-sm font-bold text-[hsl(var(--primary))]">Raise a new query
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} placeholder="e.g. Please confirm fire exit width in the storage area." className="mt-2 w-full resize-none rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-3 text-sm outline-none focus:border-[hsl(var(--primary))]" />
          </label>
          <button onClick={raiseQuery} disabled={!draft.trim()} className="mt-3 inline-flex items-center rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-50">Send query to business <Send className="ml-2 h-4 w-4" /></button>
        </> : <p className="mt-6 rounded-xl bg-[hsl(var(--muted)/.6)] p-4 text-sm text-[hsl(var(--muted-foreground))]">No open queries on this application. Status: {app.status}.</p>}
      </section>
    </main>
  </div>;
}