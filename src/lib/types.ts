export type ComplaintCategory =
  | 'Player Report'
  | 'Admin Abuse'
  | 'Bug Report'
  | 'Cheating or Exploiting'
  | 'Harassment'
  | 'Other';

export type ComplaintStatus = 'Pending' | 'Under Review' | 'Resolved' | 'Rejected';

export interface Complaint {
  id: string;
  userId: string;
  username: string;
  discordUsername: string;
  reportedUsername: string;
  category: ComplaintCategory;
  description: string;
  evidence: string[];
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintMessage {
  id: string;
  complaintId: string;
  sender: string;
  senderRole: 'user' | 'admin';
  content: string;
  createdAt: string;
}

export interface AdminMessage {
  id: string;
  sender: string;
  senderRole: 'admin';
  content: string;
  createdAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

export const defaultComplaints: Complaint[] = [
  {
    id: 'PM-1001',
    userId: 'user-1',
    username: 'ShadowGamer',
    discordUsername: 'ShadowGamer#1234',
    reportedUsername: 'NoobSniper',
    category: 'Cheating or Exploiting',
    description: 'Witnessed suspicious wall-hack behavior during ranked match.',
    evidence: ['screenshot-1.png'],
    status: 'Under Review',
    createdAt: '2026-09-20T12:00:00.000Z',
    updatedAt: '2026-09-20T12:45:00.000Z',
  },
  {
    id: 'PM-1002',
    userId: 'user-2',
    username: 'NightPulse',
    discordUsername: 'NightPulse#6543',
    reportedUsername: 'AdminNova',
    category: 'Admin Abuse',
    description: 'Admin kicked me without reason in the lobby and banned me for 30 mins.',
    evidence: ['admin-log.png'],
    status: 'Pending',
    createdAt: '2026-09-24T15:30:00.000Z',
    updatedAt: '2026-09-24T15:30:00.000Z',
  },
];

export const defaultMessages: Record<string, ComplaintMessage[]> = {
  'PM-1001': [
    {
      id: 'm1',
      complaintId: 'PM-1001',
      sender: 'ShadowGamer',
      senderRole: 'user',
      content: 'I have evidence of the exploit and would like it reviewed.',
      createdAt: '2026-09-20T12:04:00.000Z',
    },
    {
      id: 'm2',
      complaintId: 'PM-1001',
      sender: 'Admin',
      senderRole: 'admin',
      content: 'We are checking the replay and logs. Please keep the evidence available.',
      createdAt: '2026-09-20T12:15:00.000Z',
    },
  ],
  'PM-1002': [
    {
      id: 'm3',
      complaintId: 'PM-1002',
      sender: 'NightPulse',
      senderRole: 'user',
      content: 'Can you tell me when this case will be reviewed?',
      createdAt: '2026-09-24T15:35:00.000Z',
    },
  ],
};

export const defaultAdminMessages: AdminMessage[] = [
  {
    id: 'a1',
    sender: 'CoreAdmin',
    senderRole: 'admin',
    content: 'Review the latest player reports before the next match queue.',
    createdAt: '2026-09-25T09:20:00.000Z',
  },
  {
    id: 'a2',
    sender: 'Moderator',
    senderRole: 'admin',
    content: 'The cheating case has been escalated to the compliance lead.',
    createdAt: '2026-09-25T09:35:00.000Z',
  },
];
