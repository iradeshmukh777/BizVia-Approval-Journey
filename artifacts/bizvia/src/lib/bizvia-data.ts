export type ProjectStage = 'Pre-construction' | 'Construction' | 'Operational';

export type BusinessProfile = {
  companyName: string;
  businessType: string;
  state: string;
  district: string;
  locationType: string;
  investment: string;
  employees: number;
  projectStage: ProjectStage;
};

export type Approval = {
  id: string;
  name: string;
  department: string;
  stage: 'Planning' | 'Construction' | 'Operations' | 'Renewals';
  status: 'Completed' | 'In progress' | 'Need attention' | 'Upcoming';
  readiness: number;
  documentsReady: number;
  documentsTotal: number;
  deadline?: string;
  nextStep?: string;
};

export type Document = {
  id: string;
  name: string;
  type: string;
  verified: boolean;
  usedInApplications: string[];
  uploadedAt: string;
};

export type Application = {
  id: string;
  name: string;
  department: string;
  status: string;
  submittedAt: string;
};

export type Query = {
  status: 'Open' | 'Responded';
  message: string;
  dueInDays: number;
  response?: string;
};

export const DEMO_PROFILE: BusinessProfile = {
  companyName: 'Acme Foods Pvt. Ltd.',
  businessType: 'Food Processing Plant',
  state: 'Maharashtra',
  district: 'Chhatrapati Sambhajinagar',
  locationType: 'Industrial Area',
  investment: '₹50 lakh',
  employees: 25,
  projectStage: 'Pre-construction',
};

export const APPROVALS: Approval[] = [
  { id: 'factory', name: 'Factory Licence', department: 'Industries Department', stage: 'Planning', status: 'Need attention', readiness: 87, documentsReady: 7, documentsTotal: 8, deadline: '28 Sep 2026', nextStep: 'Upload Factory Layout' },
  { id: 'fire', name: 'Fire NOC', department: 'Maharashtra Fire Services', stage: 'Planning', status: 'Completed', readiness: 100, documentsReady: 5, documentsTotal: 5 },
  { id: 'land', name: 'Land Use Permission', department: 'Aurangabad Municipal Corporation', stage: 'Planning', status: 'Completed', readiness: 100, documentsReady: 4, documentsTotal: 4 },
  { id: 'building', name: 'Building Plan Approval', department: 'Town Planning Department', stage: 'Construction', status: 'In progress', readiness: 64, documentsReady: 5, documentsTotal: 8, deadline: '05 Oct 2026', nextStep: 'Review structural drawings' },
  { id: 'pollution', name: 'Pollution Consent', department: 'Maharashtra Pollution Control Board', stage: 'Construction', status: 'In progress', readiness: 72, documentsReady: 6, documentsTotal: 8, deadline: '28 Sep 2026', nextStep: 'Prepare for inspection' },
  { id: 'electricity', name: 'Electricity Connection', department: 'MSEDCL', stage: 'Construction', status: 'Upcoming', readiness: 35, documentsReady: 2, documentsTotal: 6, nextStep: 'Add load estimate' },
  { id: 'water', name: 'Water Connection', department: 'MIDC', stage: 'Construction', status: 'Upcoming', readiness: 20, documentsReady: 1, documentsTotal: 5 },
  { id: 'gst', name: 'GST Registration', department: 'Goods & Services Tax', stage: 'Operations', status: 'Completed', readiness: 100, documentsReady: 3, documentsTotal: 3 },
  { id: 'msme', name: 'Udyam Registration', department: 'Ministry of MSME', stage: 'Operations', status: 'Completed', readiness: 100, documentsReady: 3, documentsTotal: 3 },
  { id: 'fssai', name: 'FSSAI Central Licence', department: 'Food Safety & Standards Authority', stage: 'Operations', status: 'Completed', readiness: 100, documentsReady: 6, documentsTotal: 6 },
  { id: 'labour', name: 'Labour Welfare Registration', department: 'Labour Department', stage: 'Operations', status: 'Need attention', readiness: 58, documentsReady: 3, documentsTotal: 5, nextStep: 'Confirm employee count' },
  { id: 'esi', name: 'ESI Registration', department: 'Employees State Insurance', stage: 'Operations', status: 'Upcoming', readiness: 30, documentsReady: 1, documentsTotal: 4 },
  { id: 'epf', name: 'EPF Registration', department: 'Employees Provident Fund', stage: 'Operations', status: 'Upcoming', readiness: 30, documentsReady: 1, documentsTotal: 4 },
  { id: 'trade', name: 'Trade Licence', department: 'Municipal Corporation', stage: 'Operations', status: 'Completed', readiness: 100, documentsReady: 4, documentsTotal: 4 },
  { id: 'legal', name: 'Legal Metrology Registration', department: 'Legal Metrology Department', stage: 'Renewals', status: 'Upcoming', readiness: 0, documentsReady: 0, documentsTotal: 3 },
  { id: 'fire-renewal', name: 'Fire NOC Renewal', department: 'Maharashtra Fire Services', stage: 'Renewals', status: 'Upcoming', readiness: 0, documentsReady: 0, documentsTotal: 3 },
  { id: 'pollution-renewal', name: 'Pollution Consent Renewal', department: 'MPCB', stage: 'Renewals', status: 'Upcoming', readiness: 0, documentsReady: 0, documentsTotal: 3 },
];

export const DOCUMENTS: Document[] = [
  { id: 'd1', name: 'Company PAN Card', type: 'PDF', verified: true, usedInApplications: ['Factory Licence', 'GST Registration'], uploadedAt: '18 Aug 2026' },
  { id: 'd2', name: 'Certificate of Incorporation', type: 'PDF', verified: true, usedInApplications: ['Factory Licence', 'Udyam Registration'], uploadedAt: '18 Aug 2026' },
  { id: 'd3', name: 'Site Ownership Deed', type: 'PDF', verified: true, usedInApplications: ['Land Use Permission'], uploadedAt: '19 Aug 2026' },
  { id: 'd4', name: 'Factory Layout Plan', type: 'PDF', verified: false, usedInApplications: [], uploadedAt: 'Not uploaded' },
  { id: 'd5', name: 'Director Identity Proof', type: 'JPG', verified: true, usedInApplications: ['Factory Licence'], uploadedAt: '21 Aug 2026' },
  { id: 'd6', name: 'Project Report', type: 'PDF', verified: true, usedInApplications: ['Factory Licence', 'Pollution Consent'], uploadedAt: '21 Aug 2026' },
  { id: 'd7', name: 'Land Conversion Order', type: 'PDF', verified: true, usedInApplications: ['Land Use Permission'], uploadedAt: '25 Aug 2026' },
];

export const APPLICATIONS: Application[] = [
  { id: 'BE-FAC-2026-001', name: 'Factory Licence', department: 'Industries Department', status: 'Documents required', submittedAt: '24 Aug 2026' },
  { id: 'PC-CNS-2026-014', name: 'Pollution Consent', department: 'Maharashtra Pollution Control Board', status: 'Inspection scheduled', submittedAt: '29 Aug 2026' },
  { id: 'FN-2026-0082', name: 'Fire NOC', department: 'Maharashtra Fire Services', status: 'Approved', submittedAt: '12 Sep 2026' },
];

export const DEMO_QUERY: Query = {
  status: 'Open',
  message: 'Please provide clarification regarding the factory layout, specifically the separation between the processing line and the proposed storage area.',
  dueInDays: 2,
};

export const saveLocal = (key: string, value: unknown) => localStorage.setItem(`bizvia:${key}`, JSON.stringify(value));
export const readLocal = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(`bizvia:${key}`);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};