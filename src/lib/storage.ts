import { Complaint, AdminMessage, ComplaintMessage, ComplaintStatus } from './types';

export const complaintOptions = [
  'Player Report',
  'Admin Abuse',
  'Bug Report',
  'Cheating or Exploiting',
  'Harassment',
  'Other',
] as const;

export const complaintStatusOptions: ComplaintStatus[] = ['Pending', 'Under Review', 'Resolved', 'Rejected'];

export function saveComplaints(data: Complaint[]) {
  localStorage.setItem('prime-mobile-complaints', JSON.stringify(data));
}

export function getComplaints(): Complaint[] {
  const raw = localStorage.getItem('prime-mobile-complaints');
  return raw ? (JSON.parse(raw) as Complaint[]) : [];
}

export function saveComplaintMessages(complaintId: string, messages: ComplaintMessage[]) {
  localStorage.setItem(`prime-mobile-messages-${complaintId}`, JSON.stringify(messages));
}

export function getComplaintMessages(complaintId: string): ComplaintMessage[] {
  const raw = localStorage.getItem(`prime-mobile-messages-${complaintId}`);
  return raw ? (JSON.parse(raw) as ComplaintMessage[]) : [];
}

export function saveAdminMessages(messages: AdminMessage[]) {
  localStorage.setItem('prime-mobile-admin-messages', JSON.stringify(messages));
}

export function getAdminMessages(): AdminMessage[] {
  const raw = localStorage.getItem('prime-mobile-admin-messages');
  return raw ? (JSON.parse(raw) as AdminMessage[]) : [];
}
