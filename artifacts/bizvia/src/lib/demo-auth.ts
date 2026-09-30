export type DemoRole = 'business' | 'government-officer';

export type DemoSession = {
  role: DemoRole;
  name: string;
  email: string;
  signedInAt: string;
};

const SESSION_STORAGE_KEY = 'bizvia:session';

export function startDemoSession(role: DemoRole, email?: string): DemoSession {
  const session: DemoSession = {
    role,
    name: role === 'government-officer' ? 'Demo Officer' : 'Aarav Shah',
    email: email || (role === 'government-officer' ? 'officer@demo.bizvia' : 'aarav@acmefoods.in'),
    signedInAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function readDemoSession(): DemoSession | null {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;

    const value: unknown = JSON.parse(stored);
    if (!value || typeof value !== 'object') return null;

    const session = value as Partial<DemoSession>;
    if (
      (session.role !== 'business' && session.role !== 'government-officer') ||
      typeof session.name !== 'string' ||
      typeof session.email !== 'string' ||
      typeof session.signedInAt !== 'string'
    ) {
      return null;
    }

    return session as DemoSession;
  } catch {
    return null;
  }
}

export function clearDemoSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}