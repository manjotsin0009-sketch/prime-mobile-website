import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppUser, Complaint, ComplaintMessage, defaultAdminMessages, defaultComplaints, defaultMessages } from '../lib/types';
import { getAdminMessages, getComplaintMessages, getComplaints, saveAdminMessages, saveComplaintMessages, saveComplaints } from '../lib/storage';

interface AppContextValue {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  messagesByComplaint: Record<string, ComplaintMessage[]>;
  setMessagesByComplaint: React.Dispatch<React.SetStateAction<Record<string, ComplaintMessage[]>>>;
  adminMessages: ComplaintMessage[];
  setAdminMessages: React.Dispatch<React.SetStateAction<ComplaintMessage[]>>;
  isAdmin: boolean;
  loginAsAdmin: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = getComplaints();
    return saved.length ? saved : defaultComplaints;
  });
  const [messagesByComplaint, setMessagesByComplaint] = useState<Record<string, ComplaintMessage[]>>(() => {
    const base: Record<string, ComplaintMessage[]> = {};
    for (const complaint of defaultComplaints) {
      const saved = getComplaintMessages(complaint.id);
      base[complaint.id] = saved.length ? saved : defaultMessages[complaint.id] || [];
    }
    return base;
  });
  const [adminMessages, setAdminMessages] = useState<ComplaintMessage[]>(() => {
    const saved = getAdminMessages();
    return saved.length ? saved : defaultAdminMessages as ComplaintMessage[];
  });

  useEffect(() => {
    saveComplaints(complaints);
  }, [complaints]);

  useEffect(() => {
    Object.entries(messagesByComplaint).forEach(([complaintId, messages]) => {
      saveComplaintMessages(complaintId, messages);
    });
  }, [messagesByComplaint]);

  useEffect(() => {
    saveAdminMessages(adminMessages);
  }, [adminMessages]);

  useEffect(() => {
    const storedUser = localStorage.getItem('prime-mobile-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('prime-mobile-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('prime-mobile-user');
    }
  }, [user]);

  const isAdmin = Boolean(user && user.role === 'admin');

  const loginAsAdmin = () => {
    setUser({ id: 'admin-001', email: 'admin@primemobile.gg', username: 'Admin', role: 'admin' });
  };

  const logout = () => setUser(null);

  const value: AppContextValue = {
    user,
    setUser,
    complaints,
    setComplaints,
    messagesByComplaint,
    setMessagesByComplaint,
    adminMessages,
    setAdminMessages,
    isAdmin,
    loginAsAdmin,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
