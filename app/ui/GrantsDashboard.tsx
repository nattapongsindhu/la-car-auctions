"use client";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";

const tabs = [
  "Dashboard",
  "Active Grants",
  "Past Opportunities",
  "Application Status",
  "Saved Searches",
  "Reports",
  "Settings",
];

const metrics = [
  {
    title: "Active Grants",
    value: "14",
    subtext: "Currently tracked.",
    icon: FileText,
  },
  {
    title: "Saved Searches",
    value: "8",
    subtext: "With updates.",
    icon: Bell,
  },
  {
    title: "Expiring Soon",
    value: "3",
    subtext: "Within 30 days.",
    icon: Clock3,
  },
];

const activities = [
  {
    icon: CheckCircle2,
    text: "Grant 'Small Business Innovation Fund' - Status changed to 'Applied'",
    time: "2h ago",
  },
  {
    icon: CalendarDays,
    text: "Deadline added for 'Community Resilience Program'",
    time: "Yesterday",
  },
  {
    icon: Sparkles,
    text: "New match found for 'Workforce Training Grant'",
    time: "Mar 18",
  },
];

const quickLinks = [
  "Create New Search Alert",
  "Review Deadline Calendar",
  "Submit a New Proposal",
];

export function GrantsDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <main className="app-shell">
      <header className="topbar" aria-label="Application header">
        <div className="brand-block">
          <p className="logo">Grants For Me</p>
          <p className="tagline">Find and Manage Your Opportunities.</p>
        </div>

        <label className="search-wrap" aria-label="Search grants">
          <Search size={18} aria-hidden="true" />
          <input placeholder="Search Grants, Programs, or Keyword." />
        </label>
      </header>

      <nav className="tab-strip" aria-label="Dashboard sections">
        {tabs.map((tab, index) => (
          <button
            className={index === 0 ? "tab active" : "tab"}
            key={tab}
            type="button"
            aria-current={index === 0 ? "page" : undefined}
          >
            <span className="tab-number">{index + 1}</span>
            <span className="tab-label">{tab}</span>
          </button>
        ))}
      </nav>

      <div className="workspace">
        <section className="content-column" aria-labelledby="dashboard-title">
          <div className="welcome-row">
            <div>
              <h1 id="dashboard-title">Welcome Back, User!</h1>
              <p>Your personalized grant dashboard.</p>
            </div>
            <button className="primary-action" type="button">
              <Plus size={18} aria-hidden="true" />
              New Grant
            </button>
          </div>

          <div className="metric-grid">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article className="metric-card" key={metric.title}>
                  <div className="metric-icon">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <p>{metric.title}</p>
                    <strong>{metric.value}</strong>
                    <span>{metric.subtext}</span>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="activity-panel" aria-labelledby="activity-title">
            <div className="section-heading">
              <h2 id="activity-title">Recent Activity</h2>
              <button type="button">View All</button>
            </div>

            <div className="activity-list">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <article className="activity-item" key={activity.text}>
                    <div className="activity-icon">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <p>{activity.text}</p>
                    <time>{activity.time}</time>
                  </article>
                );
              })}
            </div>
          </section>
        </section>

        <aside className="side-column" aria-label="Dashboard sidebar">
          <section className="mode-panel" aria-label="Theme controls">
            <div className="theme-toggle-row">
              <Sun size={18} aria-hidden="true" />
              <button
                className={darkMode ? "toggle is-on" : "toggle"}
                type="button"
                role="switch"
                aria-checked={darkMode}
                onClick={() => setDarkMode((value) => !value)}
              >
                <span />
              </button>
              <Moon size={18} aria-hidden="true" />
            </div>
            <p>Toggle Light / Dark Mode.</p>
          </section>

          <section className="quick-panel" aria-labelledby="quick-links-title">
            <h2 id="quick-links-title">Quick Links</h2>
            <div className="quick-links">
              {quickLinks.map((link) => (
                <button key={link} type="button">
                  {link}
                </button>
              ))}
            </div>
          </section>

          <section className="announcement-panel" aria-labelledby="announcements-title">
            <div className="announcement-icon">
              <ShieldCheck size={19} aria-hidden="true" />
            </div>
            <h2 id="announcements-title">Announcements</h2>
            <p>System maintenance is complete. Grant alerts are running normally.</p>
          </section>
        </aside>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="vercel-mark" aria-label="Powered by Vercel">
          <span />
          Powered by Vercel
        </div>
      </footer>
    </main>
  );
}
