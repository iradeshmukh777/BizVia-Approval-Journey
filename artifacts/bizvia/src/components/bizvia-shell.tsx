import { Bell, ChevronRight, ClipboardCheck, FileCheck2, Home, LogOut, Map, Menu, Route, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { clearDemoSession, readDemoSession } from '@/lib/demo-auth';
import { readLocal } from '@/lib/bizvia-data';

type ShellProps = { children: React.ReactNode; title?: string; eyebrow?: string };

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/roadmap', label: 'Approval roadmap', icon: Route },
  { href: '/application/factory-licence', label: 'Applications', icon: ClipboardCheck },
  { href: '/dashboard', label: 'Document vault', icon: FileCheck2 },
];

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
    <span className={`grid h-9 w-9 place-items-center rounded-xl ${inverse ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'}`}>
      <span className="font-display text-lg font-extrabold tracking-tighter">B</span>
    </span>
    <span className={`display text-lg font-extrabold tracking-tight ${inverse ? 'text-[hsl(var(--sidebar-foreground))]' : 'text-[hsl(var(--primary))]'}`}>BizVia</span>
  </Link>;
}

export function PublicNav() {
  const [, setLocation] = useLocation();
  return <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
    <Logo />
    <nav className="hidden items-center gap-8 text-sm font-semibold text-[hsl(var(--muted-foreground))] md:flex">
      <a href="#how-it-works" className="transition-colors hover:text-[hsl(var(--primary))]" data-testid="link-how-it-works">How it works</a>
      <a href="#features" className="transition-colors hover:text-[hsl(var(--primary))]" data-testid="link-features">For entrepreneurs</a>
      <a href="#trust" className="transition-colors hover:text-[hsl(var(--primary))]" data-testid="link-trust">Why BizVia</a>
    </nav>
    <div className="flex items-center gap-2.5">
      <button className="rounded-xl border border-[hsl(var(--primary))] px-4 py-2 text-sm font-bold text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--muted))]" onClick={() => setLocation('/login?mode=signin')} data-testid="button-public-login">Sign in</button>
      <button className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))] shadow-[0_8px_18px_hsl(var(--primary)/.18)] transition-all hover:-translate-y-0.5" onClick={() => setLocation('/login?mode=register')} data-testid="button-public-start">Login <ChevronRight className="ml-1 inline h-4 w-4" /></button>
  </div>
  </header>;
}

export function AppShell({ children, title = 'Overview', eyebrow = 'Your business control room' }: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [location, setLocation] = useLocation();
  const session = readDemoSession();
  const userName = session?.role === 'government-officer' ? '' : String(readLocal('user-name', '') || '');
  const companyName = readLocal<{ companyName?: string }>('profile', {}).companyName || 'Acme Foods Pvt. Ltd.';
  return <div className="min-h-[100dvh] bg-[hsl(var(--background))]">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[hsl(var(--sidebar))] px-4 py-5 text-[hsl(var(--sidebar-foreground))] transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-9 flex items-center justify-between px-2">
        <Logo inverse />
        <button className="rounded-lg p-2 text-[hsl(var(--sidebar-foreground))] lg:hidden" onClick={() => setMobileOpen(false)} data-testid="button-close-menu"><X className="h-4 w-4" /></button>
      </div>
      <div className="mb-5 px-3">
        <p className="eyebrow text-[hsl(var(--sidebar-foreground)/.55)]">Workspace</p>
        <p className="mt-1 text-sm font-semibold">{companyName}</p>
      </div>
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location === item.href || (item.href.startsWith('/application') && location.startsWith('/application')) || (item.href === '/roadmap' && location === '/roadmap');
          return <Link href={item.href} key={`${item.label}-${item.href}`} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${active ? 'bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-[0_6px_15px_hsl(var(--secondary)/.13)]' : 'text-[hsl(var(--sidebar-foreground)/.72)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]'}`} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
            <Icon className="h-[17px] w-[17px]" /> <span>{item.label}</span>
          </Link>;
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] p-4">
        <p className="eyebrow text-[hsl(var(--secondary))]">Demo workspace</p>
        <p className="mt-2 text-xs leading-5 text-[hsl(var(--sidebar-foreground)/.72)]">Approval requirements use simulated demo data for this prototype.</p>
        <Link href="/roadmap" className="mt-3 inline-flex items-center text-xs font-bold text-[hsl(var(--secondary))]" data-testid="link-view-roadmap">View roadmap <ChevronRight className="ml-1 h-3 w-3" /></Link>
      </div>
    </aside>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.25)] lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-overlay-close" />}
    <main className="lg:pl-64">
      <div className="sticky top-0 z-20 flex h-[73px] items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.92)] px-5 backdrop-blur-md lg:px-9">
        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] lg:hidden" onClick={() => setMobileOpen(true)} data-testid="button-open-menu"><Menu className="h-5 w-5" /></button>
          <div><p className="eyebrow text-[hsl(var(--muted-foreground))]">{eyebrow}</p><h1 className="display mt-0.5 text-lg font-extrabold text-[hsl(var(--primary))]">{title}</h1></div>
        </div>
        <div className="relative flex items-center gap-2.5">
          <button className="relative rounded-xl p-2.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--primary))]" onClick={() => setNotifications((value) => !value)} data-testid="button-notifications" aria-label="Open notifications">
            <Bell className="h-[18px] w-[18px]" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
          </button>
          <div className="hidden h-8 w-px bg-[hsl(var(--border))] sm:block" />
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--secondary))] text-xs font-extrabold text-[hsl(var(--foreground))]">{session?.role === 'government-officer' ? 'GO' : (userName ? userName[0].toUpperCase() : 'U')}</div>
          <div className="hidden sm:block"><p className="text-xs font-bold text-[hsl(var(--primary))]">{userName || session?.name || 'Guest'}</p><p className="text-[11px] text-[hsl(var(--muted-foreground))]">{session?.role === 'government-officer' ? 'Government Officer · Demo' : 'Founder'}</p></div>
          {session && <button className="rounded-xl p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--primary))]" onClick={() => { clearDemoSession(); setLocation('/login'); }} aria-label="Sign out of demo session" title="Sign out" data-testid="button-sign-out"><LogOut className="h-4 w-4" /></button>}
          {notifications && <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_18px_50px_hsl(var(--foreground)/.12)]">
            <div className="flex items-center justify-between"><h3 className="display text-sm font-extrabold text-[hsl(var(--primary))]">Notifications</h3><span className="rounded-full bg-[hsl(var(--accent)/.12)] px-2 py-1 text-[10px] font-bold text-[hsl(var(--accent))]">3 new</span></div>
             <div className="mt-3 space-y-3 text-xs"><button className="block w-full rounded-xl p-2 text-left transition-colors hover:bg-[hsl(var(--muted))]" onClick={() => { setNotifications(false); setLocation('/tracking/factory-licence'); }} data-testid="button-notification-query"><b>Query needs a response</b><br /><span className="text-[hsl(var(--muted-foreground))]">Factory Licence · due in 2 days</span></button><button className="block w-full rounded-xl p-2 text-left transition-colors hover:bg-[hsl(var(--muted))]" onClick={() => { setNotifications(false); setLocation('/tracking/factory-licence'); }} data-testid="button-notification-inspection"><b>Inspection scheduled</b><br /><span className="text-[hsl(var(--muted-foreground))]">Pollution Consent · 28 September</span></button><button className="block w-full rounded-xl p-2 text-left transition-colors hover:bg-[hsl(var(--muted))]" onClick={() => { setNotifications(false); setLocation('/roadmap'); }} data-testid="button-notification-fire"><b>Fire NOC approved</b><br /><span className="text-[hsl(var(--muted-foreground))]">Valid until 11 Sep 2029</span></button></div>
          </div>}
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] p-5 lg:p-9">{children}</div>
    </main>
  </div>;
}
