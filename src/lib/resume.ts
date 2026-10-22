// Types for the subset of the JSON Resume schema (https://jsonresume.org/schema) this theme renders.
import data from '@/data/resume.json';

export interface Resume {
  basics: {
    name: string;
    label?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: { city?: string; region?: string; countryCode?: string };
    profiles?: { network: string; username?: string; url: string }[];
  };
  work?: {
    name: string;
    position: string;
    url?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }[];
  education?: {
    institution: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
  }[];
  skills?: { name: string; level?: string; keywords?: string[] }[];
  languages?: { language: string; fluency?: string }[];
  certificates?: { name: string; issuer?: string; date?: string; url?: string }[];
}

export const resume = data as Resume;

/** "2022-03" → "Mar 2022"; missing → "Present". */
export function formatResumeDate(value?: string): string {
  if (!value) return 'Present';
  const [y, m] = value.split('-').map(Number);
  if (!m) return String(y);
  return new Date(Date.UTC(y, m - 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
