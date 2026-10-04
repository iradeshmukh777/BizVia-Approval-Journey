import { useMemo, useState } from 'react';
import { BadgeCheck, Check, CheckCircle2, ChevronRight, CircleAlert, Clock3, CloudUpload, FileText, FolderSearch, Search, Upload, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { AppShell } from '@/components/bizvia-shell';
import { DOCUMENTS, readLocal, saveLocal } from '@/lib/bizvia-data';

type UploadCheck = { label: string; state: 'pass' | 'fail' | 'warn'; note: string };
type UploadedDocument = {
  name: string;
  type: string;
  uploadedAt: string;
  verified: boolean;
};

const Button = ({ children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) => {
  const styles = {
    primary: 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[0_8px_18px_hsl(var(--primary)/.15)] hover:-translate-y-0.5',
    secondary: 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]',
    ghost: 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--primary))]',
  };
  return <button className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${styles[variant]}`} {...props}>{children}</button>;
};

export function ApplicationPage() {
  const [, setLocation] = useLocation();
  const [uploaded, setUploaded] = useState(() => readLocal('factory-layout-uploaded', false));
  const [uploadedDocument, setUploadedDocument] = useState<UploadedDocument | null>(() => readLocal('factory-layout-document', null));
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [checks, setChecks] = useState<UploadCheck[]>([]);
  const [validating, setValidating] = useState(false);

  const vaultDocuments = useMemo(() => uploadedDocument
    ? [...DOCUMENTS.filter((document) => document.id !== 'd4'), {
        id: 'd4',
        name: uploadedDocument.name,
        type: uploadedDocument.type,
        verified: uploadedDocument.verified,
        usedInApplications: ['Factory Licence'],
        uploadedAt: uploadedDocument.uploadedAt,
      }]
    : DOCUMENTS, [uploadedDocument]);
  const filteredDocuments = useMemo(() => vaultDocuments.filter((document) => document.name.toLowerCase().includes(search.toLowerCase())), [search, vaultDocuments]);

  const handleUpload = (file?: File) => {
    if (uploading) return;
    setUploading(true);
    let value = 0;
    const metadata: UploadedDocument = {
      name: file?.name || 'Factory Layout.pdf',
      type: file?.type || 'application/pdf',
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      verified: true,
    };
    const timer = window.setInterval(() => {
      value += 20;
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(timer);
        setUploading(false);
        setUploaded(true);
        setUploadedDocument(metadata);
        saveLocal('factory-layout-uploaded', true);
        saveLocal('factory-layout-document', metadata);
        setNotice('Factory Layout uploaded successfully.');
      }
    }, 180);
  };

  const validateFile = (file: File) => {
  if (validating || uploading) return;
  setNotice('');
  setPendingFile(file);
  setChecks([]);
  setValidating(true);
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const typeOk = ['pdf', 'jpg', 'jpeg', 'png'].includes(extension);
  const sizeMb = file.size / (1024 * 1024);
  const emptyFile = file.size === 0;
  const sizeOk = !emptyFile && sizeMb <= 10;
  const nameLower = file.name.toLowerCase();
  const nameMatches = ['layout', 'plan', 'factory', 'floor', 'drawing', 'site', 'blueprint', 'map'].some((word) => nameLower.includes(word));
  const results: UploadCheck[] = [
    typeOk
      ? { label: 'File type', state: 'pass', note: `${extension.toUpperCase()} is an accepted format.` }
      : { label: 'File type', state: 'fail', note: `.${extension || 'unknown'} files are not accepted. Please upload a PDF, JPG or PNG.` },
    sizeOk
      ? { label: 'File size', state: 'pass', note: `${sizeMb.toFixed(2)} MB is within the 10 MB limit.` }
      : { label: 'File size', state: 'fail', note: emptyFile ? 'This file is empty.' : `${sizeMb.toFixed(1)} MB is over the 10 MB limit.` },
    nameMatches
      ? { label: 'Document match', state: 'pass', note: 'The file looks like a factory layout or plan.' }
      : { label: 'Document match', state: 'warn', note: 'This doesn’t look like a factory layout. Expected a layout, plan or drawing of the processing line and storage area.' },
  ];
  results.forEach((result, index) => {
    window.setTimeout(() => {
      setChecks(results.slice(0, index + 1));
      if (index === results.length - 1) {
        setValidating(false);
        if (results.every((item) => item.state === 'pass')) {
          setChecks([]);
          setPendingFile(null);
          handleUpload(file);
        }
      }
    }, 600 * (index + 1));
  });
};

return <AppShell title="Factory Licence" eyebrow="Application · BE-FAC-2026-001">
  
    <div className="rise-in">
      <button className="mb-4 flex items-center text-xs font-bold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" onClick={() => setLocation('/roadmap')} data-testid="button-application-back">
        <ChevronRight className="mr-1 h-3.5 w-3.5 rotate-180" /> Back to roadmap
      </button>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-[hsl(var(--accent))]">BE-FAC-2026-001</p>
          <h2 className="display mt-1 text-3xl font-extrabold tracking-[-.04em] text-[hsl(var(--primary))]">Factory Licence</h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Industries Department</p>
        </div>
        <span className="rounded-full bg-[hsl(var(--accent)/.13)] px-3 py-1 text-xs font-bold text-[hsl(var(--accent))]">Documents required</span>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_.65fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div><p className="eyebrow text-[hsl(var(--muted-foreground))]">Document readiness</p><h3 className="display mt-2 text-xl font-extrabold text-[hsl(var(--primary))]">{uploaded ? '8 / 8 documents ready' : '7 / 8 documents ready'}</h3></div>
              <span className="display text-2xl font-extrabold text-[hsl(var(--primary))]">{uploaded ? '100%' : '87%'}</span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--secondary))] transition-all" style={{ width: uploaded ? '100%' : '87%' }} /></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Detail label="Deadline" value="28 Sep 2026" icon={<Clock3 />} />
              <Detail label="Next step" value={uploaded ? 'Ready for submission' : 'Upload Factory Layout'} icon={<Upload />} accent />
            </div>
          </section>

          <section className="rounded-2xl border border-[hsl(var(--accent)/.25)] bg-[hsl(var(--accent)/.06)] p-5 sm:p-7">
            <div className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><CloudUpload className="h-5 w-5" /></span>
              <div><p className="eyebrow text-[hsl(var(--accent))]">Required document</p><h3 className="display mt-2 text-lg font-extrabold text-[hsl(var(--primary))]">Factory Layout</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Upload the proposed processing line, storage area, and safe separation. This simulation stores only file metadata.</p></div>
            </div>
            {uploaded ? <div className="mt-5 flex items-center gap-3 rounded-xl bg-[hsl(var(--card))] p-3 text-sm font-bold text-[hsl(var(--chart-4))]"><CheckCircle2 className="h-5 w-5" /> {uploadedDocument?.name || 'Factory Layout.pdf'} uploaded successfully</div> : <div className="mt-5 rounded-2xl border-2 border-dashed border-[hsl(var(--accent)/.4)] bg-[hsl(var(--card)/.55)] p-6 text-center">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="layout-upload" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) validateFile(file); }} data-testid="input-factory-layout" />
              <label htmlFor="layout-upload" className="mx-auto flex cursor-pointer flex-col items-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--secondary)/.3)] text-[hsl(var(--primary))]"><CloudUpload /></span>
                <span className="mt-3 text-sm font-bold text-[hsl(var(--primary))]">{uploading ? `Uploading... ${progress}%` : 'Upload Document'}</span>
                <span className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">PDF, JPG, or PNG · max 10 MB</span>
              </label>
              {uploading && <div className="mx-auto mt-5 h-2 max-w-sm overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--accent))] transition-all" style={{ width: `${progress}%` }} /></div>}
            </div>}
            {checks.length > 0 && !uploaded && <div className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4" data-testid="panel-prevalidation">
  <p className="eyebrow text-[hsl(var(--muted-foreground))]">Pre-submission check · {pendingFile?.name}</p>
  <div className="mt-3 space-y-3">
    {checks.map((check) => <div key={check.label} className="flex items-start gap-3">
      <span className={`mt-0.5 ${check.state === 'pass' ? 'text-[hsl(var(--chart-4))]' : check.state === 'warn' ? 'text-[hsl(var(--accent))]' : 'text-red-600'}`}>{check.state === 'pass' ? <CheckCircle2 className="h-4 w-4" /> : check.state === 'warn' ? <CircleAlert className="h-4 w-4" /> : <X className="h-4 w-4" />}</span>
      <div><p className="text-sm font-bold text-[hsl(var(--primary))]">{check.label}</p><p className="text-xs leading-5 text-[hsl(var(--muted-foreground))]">{check.note}</p></div>
    </div>)}
    {validating && <p className="text-xs font-bold text-[hsl(var(--muted-foreground))]">Checking…</p>}
  </div>
  {!validating && checks.some((check) => check.state !== 'pass') && <div className="mt-4 flex flex-wrap gap-2">
    <button className="rounded-xl border border-[hsl(var(--border))] px-3 py-2 text-xs font-bold text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]" onClick={() => { setChecks([]); setPendingFile(null); document.getElementById('layout-upload')?.click(); }}>Choose another file</button>
    {!checks.some((check) => check.state === 'fail') && pendingFile && <button className="rounded-xl bg-[hsl(var(--primary))] px-3 py-2 text-xs font-bold text-[hsl(var(--primary-foreground))]" onClick={() => { const file = pendingFile; setChecks([]); setPendingFile(null); handleUpload(file); }}>Upload anyway</button>}
  </div>}
</div>}
            {notice && <p className="mt-3 flex items-center gap-2 text-xs font-bold text-[hsl(var(--chart-4))]"><CheckCircle2 className="h-4 w-4" /> {notice}</p>}
          </section>

          <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7">
            <div className="flex items-center justify-between"><div><p className="eyebrow text-[hsl(var(--muted-foreground))]">Document Vault</p><h3 className="display mt-2 text-xl font-extrabold text-[hsl(var(--primary))]">Reuse what is ready</h3></div><FolderSearch className="h-5 w-5 text-[hsl(var(--muted-foreground))]" /></div>
            <div className="relative mt-5"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search documents" className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-3 pl-10 pr-4 text-sm outline-none focus:border-[hsl(var(--primary))]" data-testid="input-document-search" /></div>
            <div className="mt-3 divide-y divide-[hsl(var(--border))]">{filteredDocuments.map((document) => <div key={document.id} className="flex items-center gap-3 py-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--primary))]"><FileText className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[hsl(var(--primary))]">{document.name}</p><p className="mt-0.5 text-[11px] text-[hsl(var(--muted-foreground))]">{document.type} · uploaded {document.uploadedAt}</p></div>{document.verified && <span className="text-[hsl(var(--chart-4))]" title="Verified"><BadgeCheck className="h-4 w-4" /></span>}<button className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]" onClick={() => setNotice(`${document.name} selected for reuse.`)} data-testid={`button-reuse-${document.id}`}>Use existing</button></div>)}</div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-[hsl(var(--primary))] p-5 text-[hsl(var(--primary-foreground))]">
            <p className="eyebrow opacity-60">Application progress</p>
            <h3 className="display mt-2 text-xl font-extrabold">Factory Licence</h3>
            <div className="mt-6 space-y-5">{[['Business Details', true], ['Documents', true], ['Review', uploaded], ['Inspection', false], ['Decision', false]].map(([label, done], index) => <div className="flex gap-3" key={String(label)}><div className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${done ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]' : 'border border-[hsl(var(--primary-foreground)/.3)] text-[hsl(var(--primary-foreground)/.6)]'}`}>{done ? <Check className="h-3.5 w-3.5" /> : index + 1}{index < 4 && <span className={`absolute left-1/2 top-7 h-5 w-px ${done ? 'bg-[hsl(var(--secondary)/.7)]' : 'bg-[hsl(var(--primary-foreground)/.2)]'}`} />}</div><p className={`pt-1 text-sm font-semibold ${done ? '' : 'opacity-60'}`}>{String(label)}</p></div>)}</div>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
            <p className="eyebrow text-[hsl(var(--muted-foreground))]">Application details</p>
            <div className="mt-4 space-y-4"><Detail label="Reference" value="BE-FAC-2026-001" /><Detail label="Department" value="Industries Department" /><Detail label="Submitted" value="24 Sep 2026" /></div>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setLocation('/tracking/factory-licence')}><span>Open application tracking</span><ChevronRight className="ml-2 h-4 w-4" /></Button>
        </aside>
      </div>
    </div>
  </AppShell>;
}

function Detail({ label, value, icon, accent = false }: { label: string; value: string; icon?: React.ReactNode; accent?: boolean }) {
  return <div className="flex items-start gap-3">{icon && <span className={`mt-0.5 ${accent ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{icon}</span>}<div><p className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{label}</p><p className={`mt-1 text-sm font-bold ${accent ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--primary))]'}`}>{value}</p></div></div>;
}