import React, { useState, useMemo } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Gamepad2,
  LayoutDashboard,
  ShieldCheck,
  Users,
  BadgeCheck,
  Lock,
  Menu,
  X,
} from 'lucide-react';
import { classNames, discordLink, downloadLink, formatDate, generateComplaintId, uid } from './lib/utils';
import { complaintOptions, complaintStatusOptions } from './lib/storage';
import { AdminMessage, AppUser, Complaint, ComplaintCategory, ComplaintMessage, ComplaintStatus } from './lib/types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useIsMobile } from './hooks/useLocalStorage';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    username: '',
    role: 'user' as 'user' | 'admin',
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [adminChat, setAdminChat] = useState('');
  const [openedComplaint, setOpenedComplaint] = useState<Complaint | null>(null);
  const [complaintForm, setComplaintForm] = useState({
    username: '',
    discordUsername: '',
    reportedUsername: '',
    category: 'Player Report' as ComplaintCategory,
    description: '',
    evidence: [] as File[],
  });

  const { user, setUser, complaints, setComplaints, messagesByComplaint, setMessagesByComplaint, adminMessages, setAdminMessages, isAdmin, loginAsAdmin, logout } = useAppContext();
  const isMobile = useIsMobile();
  const [localUser, setLocalUser] = useLocalStorage<AppUser | null>('prime-mobile-local-user', null);

  const activeUser = user ?? localUser;

  const onAuthSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!authForm.email || !authForm.password || (!authForm.username && authMode === 'register')) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (authForm.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    const nextUser: AppUser = {
      id: uid('user'),
      email: authForm.email,
      username: authForm.username || 'Player',
      role: authForm.role,
    };

    if (authMode === 'register') {
      setUser(nextUser);
      setLocalUser(nextUser);
      setSuccessMessage('Registration successful. Welcome to PRIME MOBILE.');
    } else {
      const loginUser = nextUser.role === 'admin' || authForm.email.includes('admin')
        ? { ...nextUser, role: 'admin', username: 'Admin' }
        : nextUser;
      setUser(loginUser);
      setLocalUser(loginUser);
      setSuccessMessage('Login successful.');
    }

    setAuthForm({ email: '', password: '', username: '', role: 'user' });
  };

  const handleComplaintSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!complaintForm.username || !complaintForm.discordUsername || !complaintForm.reportedUsername || !complaintForm.description) {
      setFormError('Please complete the required complaint fields.');
      return;
    }

    const complaintId = generateComplaintId();
    const now = new Date().toISOString();
    const complaint: Complaint = {
      id: complaintId,
      userId: activeUser?.id || uid('user'),
      username: complaintForm.username,
      discordUsername: complaintForm.discordUsername,
      reportedUsername: complaintForm.reportedUsername,
      category: complaintForm.category,
      description: complaintForm.description,
      evidence: complaintForm.evidence.map((file) => file.name),
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };

    setComplaints((prev) => [complaint, ...prev]);
    setMessagesByComplaint((prev) => ({
      ...prev,
      [complaintId]: [
        {
          id: uid('msg'),
          complaintId,
          sender: complaintForm.username,
          senderRole: 'user',
          content: 'Complaint submitted. We will review it shortly.',
          createdAt: now,
        },
      ],
    }));
    setOpenedComplaint(complaint);
    setSelectedComplaintId(complaintId);
    setComplaintForm({
      username: '',
      discordUsername: '',
      reportedUsername: '',
      category: 'Player Report',
      description: '',
      evidence: [],
    });
    setSuccessMessage(`Complaint submitted successfully. Your tracking ID is ${complaintId}.`);
  };

  const sendComplaintReply = () => {
    if (!selectedComplaintId || !newMessage.trim()) return;

    const message: ComplaintMessage = {
      id: uid('msg'),
      complaintId: selectedComplaintId,
      sender: activeUser?.username || 'Player',
      senderRole: activeUser?.role === 'admin' ? 'admin' : 'user',
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessagesByComplaint((prev) => ({
      ...prev,
      [selectedComplaintId]: [...(prev[selectedComplaintId] || []), message],
    }));
    setNewMessage('');
  };

  const sendAdminMessage = () => {
    if (!adminChat.trim()) return;

    const message: AdminMessage = {
      id: uid('adminmsg'),
      sender: activeUser?.username || 'Admin',
      senderRole: 'admin',
      content: adminChat,
      createdAt: new Date().toISOString(),
    };

    setAdminMessages((prev) => [...prev, message]);
    setAdminChat('');
  };

  const updateComplaintStatus = (complaintId: string, nextStatus: ComplaintStatus) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, status: nextStatus, updatedAt: new Date().toISOString() }
          : complaint,
      ),
    );
  };

  const headerLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Download', href: '#download' },
    { label: 'Discord', href: '#discord' },
    { label: 'Complaints', href: '#complaints' },
    { label: 'Admin', href: '#admin' },
  ];

  const visibleComplaints = useMemo(() => {
    if (!isAdmin) {
      return complaints.filter((complaint) => complaint.userId === activeUser?.id || complaint.username === activeUser?.username);
    }
    return complaints;
  }, [complaints, activeUser, isAdmin]);

  const selectedComplaint = complaints.find((complaint) => complaint.id === selectedComplaintId) || openedComplaint;

  return (
    <div className="app-shell">
      <header className="topbar" id="home">
        <div className="brand-wrap">
          <div className="brand-mark">PM</div>
          <div>
            <p className="eyebrow">Community Portal</p>
            <h1>PRIME MOBILE</h1>
          </div>
        </div>

        <nav className={classNames('nav', isMobile && mobileMenuOpen ? 'nav-open' : '')}>
          {headerLinks.map((link) => (
            <a href={link.href} key={link.label} onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {activeUser ? (
            <>
              <span className="user-pill">{activeUser.username}</span>
              <button className="ghost-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="ghost-btn" onClick={() => setAuthMode('login')}>Login</button>
          )}
          <button className="menu-toggle" onClick={() => setMobileMenuOpen((v) => !v)}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero panel glow-panel">
          <div className="hero-copy">
            <span className="chip">Premium gaming community</span>
            <h2>Welcome to PRIME MOBILE — Your Community, Your Game, Your Voice.</h2>
            <p>
              Join a competitive gaming network built for community, fairness, and support. Download the game,
              connect to Discord, and stay protected with a trusted complaint system.
            </p>
            <div className="cta-row">
              <a href={downloadLink()} className="primary-btn" target="_blank" rel="noreferrer">
                <Download size={18} /> Download Game
              </a>
              <a href={discordLink()} className="secondary-btn" target="_blank" rel="noreferrer">
                <Users size={18} /> Join Discord
              </a>
              <a href="#complaints" className="secondary-btn accent-btn">
                <AlertTriangle size={18} /> Submit a Complaint
              </a>
            </div>
            <div className="stat-row">
              <div>
                <strong>12k+</strong>
                <span>Players</span>
              </div>
              <div>
                <strong>180+</strong>
                <span>Communities</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Support</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="screen-card">
              <div className="screen-badge">Status: Active</div>
              <div className="card-visual">
                <Gamepad2 size={72} />
              </div>
              <div className="mini-stat-grid">
                <div><span>Players Online</span><strong>4,280</strong></div>
                <div><span>Battle Pass</span><strong>Live</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-intro">
          <div className="section-header">
            <span className="chip">About us</span>
            <h3>Built for players who want more than a server.</h3>
          </div>
          <div className="feature-grid">
            <article className="info-card">
              <ShieldCheck size={28} />
              <h4>Secure Community</h4>
              <p>Protected moderation, transparent complaint channels, and private communication with admins.</p>
            </article>
            <article className="info-card">
              <Users size={28} />
              <h4>Competitive Network</h4>
              <p>Play with a welcoming, active community and stay connected through Discord and shared events.</p>
            </article>
            <article className="info-card">
              <LayoutDashboard size={28} />
              <h4>Modern Management</h4>
              <p>Track complaints efficiently, update status, and respond in private admin channels.</p>
            </article>
          </div>
        </section>

        <section className="download-grid panel" id="download">
          <div className="download-icon"><Download size={42} /></div>
          <div className="download-copy">
            <span className="chip">Download the Game</span>
            <h3>Install PRIME MOBILE and join the action.</h3>
            <p>A fast, immersive mobile experience built for competitive play, collaboration, and community events.</p>
            <a className="primary-btn" href={downloadLink()} target="_blank" rel="noreferrer">Download APK</a>
          </div>
        </section>

        <section className="discord-panel panel" id="discord">
          <div>
            <span className="chip">Discord Lounge</span>
            <h3>Join Our Discord</h3>
            <p>Connect with teammates, report issues, receive updates, and stay informed on community events.</p>
          </div>
          <a className="primary-btn" href={discordLink()} target="_blank" rel="noreferrer">Join Our Discord</a>
        </section>

        <section className="complaint-layout" id="complaints">
          <div className="panel">
            <div className="section-header compact">
              <span className="chip">Complaint System</span>
              <h3>Submit a complaint</h3>
            </div>

            <form className="complaint-form" onSubmit={handleComplaintSubmit}>
              <div className="two-col">
                <label>
                  Username
                  <input value={complaintForm.username} onChange={(e) => setComplaintForm({ ...complaintForm, username: e.target.value })} placeholder="Your username" />
                </label>
                <label>
                  Discord username
                  <input value={complaintForm.discordUsername} onChange={(e) => setComplaintForm({ ...complaintForm, discordUsername: e.target.value })} placeholder="Example: user#1234" />
                </label>
              </div>

              <div className="two-col">
                <label>
                  Reported person username
                  <input value={complaintForm.reportedUsername} onChange={(e) => setComplaintForm({ ...complaintForm, reportedUsername: e.target.value })} placeholder="Reported account" />
                </label>
                <label>
                  Complaint category
                  <select value={complaintForm.category} onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value as ComplaintCategory })}>
                    {complaintOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>

              <label>
                Describe the issue
                <textarea value={complaintForm.description} onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })} placeholder="Describe what happened in detail..." rows={6} />
              </label>

              <label>
                Upload evidence
                <input type="file" multiple onChange={(e) => setComplaintForm({ ...complaintForm, evidence: Array.from(e.target.files || []) })} />
              </label>

              {formError && <p className="message error">{formError}</p>}
              {successMessage && <p className="message success">{successMessage}</p>}

              <button className="primary-btn submit-btn" type="submit">Submit Complaint</button>
            </form>
          </div>

          <div className="panel">
            <div className="section-header compact">
              <span className="chip">Complaint Tracking</span>
              <h3>Your cases</h3>
            </div>
            <div className="complaint-list">
              {visibleComplaints.length === 0 ? (
                <p className="muted">No complaints found yet.</p>
              ) : (
                visibleComplaints.map((complaint) => (
                  <button key={complaint.id} className={classNames('complaint-item', selectedComplaint?.id === complaint.id ? 'selected' : '')} onClick={() => setSelectedComplaintId(complaint.id)}>
                    <div className="complaint-topline">
                      <strong>{complaint.id}</strong>
                      <span className={classNames('status', complaint.status.toLowerCase().replace(/\s+/g, '-'))}>{complaint.status}</span>
                    </div>
                    <p>{complaint.category}</p>
                    <small>{formatDate(complaint.createdAt)}</small>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        {selectedComplaint && (
          <section className="chat-panel panel">
            <div className="section-header compact">
              <span className="chip">Private Chat</span>
              <h3>Complaint conversation</h3>
            </div>

            <div className="complaint-detail">
              <div className="detail-block">
                <p><strong>ID:</strong> {selectedComplaint.id}</p>
                <p><strong>Player:</strong> {selectedComplaint.username}</p>
                <p><strong>Reported:</strong> {selectedComplaint.reportedUsername}</p>
                <p><strong>Category:</strong> {selectedComplaint.category}</p>
                <p><strong>Status:</strong> {selectedComplaint.status}</p>
              </div>
              <div className="detail-block">
                <h4>Evidence</h4>
                <ul>
                  {selectedComplaint.evidence.length ? selectedComplaint.evidence.map((file) => <li key={file}>{file}</li>) : <li>No evidence attached.</li>}
                </ul>
              </div>
            </div>

            <div className="chat-box">
              {(messagesByComplaint[selectedComplaint.id] || []).map((message) => (
                <div key={message.id} className={classNames('chat-bubble', message.senderRole === 'admin' ? 'admin' : 'user')}>
                  <strong>{message.sender}</strong>
                  <p>{message.content}</p>
                  <span>{formatDate(message.createdAt)}</span>
                </div>
              ))}
            </div>

            <div className="composer">
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Write a private message..." />
              <button className="primary-btn" onClick={sendComplaintReply}>Send</button>
            </div>
          </section>
        )}

        <section className="auth-grid" id="admin">
          <div className="panel">
            <div className="section-header compact">
              <span className="chip">Authentication</span>
              <h3>User access</h3>
            </div>

            <div className="auth-switch">
              <button type="button" className={classNames(authMode === 'login' ? 'active' : '')} onClick={() => setAuthMode('login')}>Login</button>
              <button type="button" className={classNames(authMode === 'register' ? 'active' : '')} onClick={() => setAuthMode('register')}>Register</button>
            </div>

            <form className="auth-form" onSubmit={onAuthSubmit}>
              <label>
                Email
                <input type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="you@example.com" />
              </label>
              {authMode === 'register' && (
                <label>
                  Username
                  <input value={authForm.username} onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })} placeholder="Choose username" />
                </label>
              )}
              <label>
                Password
                <input type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="Password" />
              </label>
              <label>
                Role
                <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value as 'user' | 'admin' })}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <button className="primary-btn" type="submit">{authMode === 'login' ? 'Log in' : 'Register account'}</button>
            </form>

            <div className="inline-actions">
              <button type="button" className="secondary-btn" onClick={loginAsAdmin}>Secure Admin Login</button>
            </div>
          </div>

          <div className="panel">
            <div className="section-header compact">
              <span className="chip">Admin Dashboard</span>
              <h3>Complaint review</h3>
            </div>

            {isAdmin ? (
              <div className="admin-dashboard">
                <div className="admin-stats">
                  <div><BadgeCheck size={20} /><span>{complaints.length}</span><small>Total complaints</small></div>
                  <div><CheckCircle2 size={20} /><span>{complaints.filter((c) => c.status === 'Resolved').length}</span><small>Resolved</small></div>
                  <div><AlertTriangle size={20} /><span>{complaints.filter((c) => c.status === 'Under Review').length}</span><small>Reviewing</small></div>
                </div>

                <div className="filter-row">
                  {complaintStatusOptions.map((status) => (
                    <button type="button" key={status} className="status-filter" onClick={() => null}>{status}</button>
                  ))}
                </div>

                <div className="admin-complaints">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="admin-complaint-card">
                      <div className="admin-complaint-header">
                        <strong>{complaint.id}</strong>
                        <select value={complaint.status} onChange={(e) => updateComplaintStatus(complaint.id, e.target.value as ComplaintStatus)}>
                          {complaintStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                      <p>{complaint.username} • {complaint.category}</p>
                      <small>{complaint.description}</small>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="lock-box">
                <Lock size={32} />
                <p>Authorized administrators only. Log in with admin access to review complaints.</p>
              </div>
            )}
          </div>
        </section>

        {isAdmin && (
          <section className="panel admin-chat-panel">
            <div className="section-header compact">
              <span className="chip">Private Admin Chat</span>
              <h3>Internal team communication</h3>
            </div>
            <div className="chat-box admin-thread">
              {adminMessages.map((message) => (
                <div key={message.id} className={classNames('chat-bubble', message.senderRole === 'admin' ? 'admin' : 'user')}>
                  <strong>{message.sender}</strong>
                  <p>{message.content}</p>
                  <span>{formatDate(message.createdAt)}</span>
                </div>
              ))}
            </div>
            <div className="composer">
              <input value={adminChat} onChange={(e) => setAdminChat(e.target.value)} placeholder="Discuss private admin matters..." />
              <button className="primary-btn" onClick={sendAdminMessage}>Send</button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div>
          <h4>PRIME MOBILE</h4>
          <p>Community, gaming, and integrity.</p>
        </div>
        <div className="footer-links">
          <a href={downloadLink()} target="_blank" rel="noreferrer">Download</a>
          <a href={discordLink()} target="_blank" rel="noreferrer">Discord</a>
          <a href="#complaints">Complaints</a>
        </div>
      </footer>
    </div>
  );
}

export default function Root() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
