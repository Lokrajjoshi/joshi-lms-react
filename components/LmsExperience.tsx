"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

export type Course = {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  description: string;
  longDescription: string;
  outcomes: string[];
  accent: string;
  artLabel: string;
  featured: boolean;
};

type LearningData = { favorites: number[]; progress: Record<string, number> };
type Enquiry = { name: string; email: string; goal: string; message: string };

const STORAGE_KEY = "joshi-lms-learning-data";
const emptyEnquiry: Enquiry = { name: "", email: "", goal: "", message: "" };

function safeData(value: unknown): LearningData {
  if (!value || typeof value !== "object") return { favorites: [], progress: {} };
  const item = value as Partial<LearningData>;
  return {
    favorites: Array.isArray(item.favorites) ? item.favorites.filter(Number.isInteger) : [],
    progress: item.progress && typeof item.progress === "object" ? item.progress : {},
  };
}

function courseProgress(courseId: number, progress: Record<string, number>) {
  return Math.max(0, Math.min(100, progress[String(courseId)] || 0));
}

export default function LmsExperience({ courses }: { courses: Course[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);
  const [learning, setLearning] = useState<LearningData>({ favorites: [], progress: {} });
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");
  const [enquiry, setEnquiry] = useState<Enquiry>(emptyEnquiry);
  const [enquiryState, setEnquiryState] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    try { setLearning(safeData(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"))); } catch { setLearning({ favorites: [], progress: {} }); }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(learning));
  }, [learning, hydrated]);

  const categories = useMemo(() => ["All", ...new Set(courses.map((course) => course.category))], [courses]);
  const visibleCourses = useMemo(() => {
    const text = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesText = !text || [course.title, course.category, course.level, course.description].join(" ").toLowerCase().includes(text);
      return matchesText && (category === "All" || course.category === category);
    });
  }, [category, courses, search]);
  const activeCourses = courses.filter((course) => courseProgress(course.id, learning.progress) > 0);
  const completed = courses.filter((course) => courseProgress(course.id, learning.progress) === 100).length;
  const averageProgress = activeCourses.length ? Math.round(activeCourses.reduce((sum, course) => sum + courseProgress(course.id, learning.progress), 0) / activeCourses.length) : 0;

  function updateLearning(update: (data: LearningData) => LearningData) {
    setLearning((current) => update(current));
  }

  function toggleFavorite(courseId: number) {
    updateLearning((current) => ({
      ...current,
      favorites: current.favorites.includes(courseId) ? current.favorites.filter((id) => id !== courseId) : [...current.favorites, courseId],
    }));
  }

  function continueCourse(course: Course) {
    const nextProgress = Math.min(100, courseProgress(course.id, learning.progress) + 12);
    updateLearning((current) => ({ ...current, progress: { ...current.progress, [course.id]: nextProgress } }));
    setNotice(nextProgress === 100 ? `${course.title} completed — excellent work!` : `${course.title} updated to ${nextProgress}%.`);
  }

  function exportLearningPlan() {
    const file = new Blob([JSON.stringify(learning, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "joshi-lms-learning-plan.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Learning plan exported as JSON.");
  }

  function importLearningPlan(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setLearning(safeData(JSON.parse(String(reader.result))));
        setNotice("Learning plan imported successfully.");
      } catch { setNotice("That file is not a valid Joshi LMS learning plan."); }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enquiry.name.trim() || !/^\S+@\S+\.\S+$/.test(enquiry.email) || !enquiry.goal) {
      setEnquiryState("error");
      return;
    }
    setEnquiryState("sending");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(enquiry) });
      if (!response.ok) throw new Error("Unable to send enquiry");
      setEnquiry(emptyEnquiry);
      setEnquiryState("success");
    } catch { setEnquiryState("error"); }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#overview"><span className="brand-symbol">JL</span><span>Joshi <b>LMS</b></span></a>
        <nav aria-label="Primary navigation"><a href="#overview">Overview</a><a href="#catalogue">Catalogue</a><a href="#learning">My learning</a><a href="#contact">Contact</a></nav>
        <a className="profile-chip" href="#learning"><span>NJ</span><small>Student workspace</small></a>
      </header>

      <section className="hero-wrap" id="overview">
        <div className="hero-copy">
          <span className="eyebrow">PERSONAL LEARNING SPACE</span>
          <h1>Learn with a plan.<br /><em>Build with confidence.</em></h1>
          <p>Joshi LMS turns a course catalogue into a focused learning workspace — discover a path, track meaningful progress, and keep your plan portable.</p>
          <div className="hero-actions"><a className="button primary" href="#catalogue">Explore courses <span>→</span></a><button className="button quiet" onClick={exportLearningPlan}>Export my plan</button></div>
          <div className="hero-points"><span>✓ Responsive experience</span><span>✓ Progress tracking</span><span>✓ Server-powered contact</span></div>
        </div>
        <div className="dashboard-preview" aria-label="Learning dashboard preview">
          <div className="dash-title"><span>Today’s focus</span><b>Tuesday, 4 lessons</b></div>
          <div className="focus-card"><div><small>CONTINUE LEARNING</small><strong>{selectedCourse?.title || "Frontend Development"}</strong><p>{courseProgress(selectedCourse?.id || 1, learning.progress) || 12}% complete</p></div><button onClick={() => selectedCourse && continueCourse(selectedCourse)}>Continue →</button></div>
          <div className="dash-stats"><div><strong>{activeCourses.length}</strong><span>Active paths</span></div><div><strong>{completed}</strong><span>Completed</span></div><div><strong>{learning.favorites.length}</strong><span>Saved</span></div></div>
        </div>
      </section>

      <section className="metrics-band" aria-label="Project capabilities"><div><b>Next.js</b><span>App Router + server rendering</span></div><div><b>TypeScript</b><span>Safer reusable UI logic</span></div><div><b>MongoDB</b><span>Persistent enquiry API</span></div><div><b>Vercel</b><span>Production-ready deployment</span></div></section>

      <section className="content-section catalogue" id="catalogue">
        <div className="section-heading"><div><span className="eyebrow">COURSE CATALOGUE</span><h2>Choose your next build.</h2><p>Search practical courses, save your favourites, and create a learning route that fits your current level.</p></div><span className="result-count">{visibleCourses.length} courses found</span></div>
        <div className="filter-bar"><label><span className="sr-only">Search courses</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search skills, topics, or levels" /></label><div className="category-list">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
        <div className="catalogue-grid">
          <div className="course-grid">{visibleCourses.map((course) => {
            const isSaved = learning.favorites.includes(course.id); const progress = courseProgress(course.id, learning.progress);
            return <article key={course.id} className={`course-card accent-${course.accent}`}><div className="course-card-top"><span>{course.category}</span><button aria-label={isSaved ? `Remove ${course.title} from saved courses` : `Save ${course.title}`} className={isSaved ? "saved" : ""} onClick={() => toggleFavorite(course.id)}>♥</button></div><div className="course-mark">{course.artLabel}</div><p className="meta">{course.level} · {course.duration}</p><h3>{course.title}</h3><p className="description">{course.description}</p>{progress > 0 && <div className="progress-row"><span style={{ width: `${progress}%` }} /><small>{progress}% complete</small></div>}<div className="course-actions"><button onClick={() => setSelectedCourse(course)}>View details</button><button className="arrow-button" aria-label={`Continue ${course.title}`} onClick={() => continueCourse(course)}>→</button></div></article>;
          })}</div>
          <aside className="course-detail"><span className="eyebrow">LEARNING PATH</span>{selectedCourse ? <><div className={`detail-banner accent-${selectedCourse.accent}`}>{selectedCourse.artLabel}</div><p className="meta">{selectedCourse.category} · {selectedCourse.level}</p><h3>{selectedCourse.title}</h3><p>{selectedCourse.longDescription}</p><h4>You will learn</h4><ul>{selectedCourse.outcomes.map((outcome) => <li key={outcome}>✓ {outcome}</li>)}</ul><button className="button primary full" onClick={() => continueCourse(selectedCourse)}>Add progress <span>→</span></button></> : <p>Select a course to inspect its learning path.</p>}</aside>
        </div>
      </section>

      <section className="learning-section" id="learning"><div className="section-heading"><div><span className="eyebrow">MY LEARNING</span><h2>Your progress, kept simple.</h2><p>This dashboard uses browser storage for your personal learning plan. Export it anytime and import it on another device.</p></div></div><div className="learning-grid"><article className="progress-summary"><span>AVERAGE PROGRESS</span><strong>{averageProgress}<small>%</small></strong><div className="large-track"><span style={{ width: `${averageProgress}%` }} /></div><p>{activeCourses.length ? `You are actively building ${activeCourses.length} learning path${activeCourses.length === 1 ? "" : "s"}.` : "Choose a course to start your first learning path."}</p></article><article className="saved-courses"><div><span className="eyebrow">SAVED FOR LATER</span><label className="import-button">Import plan<input type="file" accept="application/json" onChange={importLearningPlan} /></label></div>{learning.favorites.length ? <div className="saved-list">{courses.filter((course) => learning.favorites.includes(course.id)).map((course) => <button key={course.id} onClick={() => setSelectedCourse(course)}><span className={`mini-mark accent-${course.accent}`}>{course.artLabel}</span><span><b>{course.title}</b><small>{courseProgress(course.id, learning.progress)}% progress</small></span><i>→</i></button>)}</div> : <p className="empty-copy">Save courses from the catalogue to make your personal shortlist.</p>}</article></div>{notice && <p className="notice" role="status">{notice}</p>}</section>

      <section className="contact-section" id="contact"><div className="contact-copy"><span className="eyebrow">CONNECT WITH US</span><h2>Start with the right direction.</h2><p>This form is backed by a Vercel API route and MongoDB, giving the project a real full-stack workflow rather than a static contact form.</p><div className="contact-note"><span>01</span><p><b>Thoughtful validation</b><br />Clear feedback before data reaches the server.</p></div><div className="contact-note"><span>02</span><p><b>Persistent enquiries</b><br />Requests are stored through a protected server route.</p></div></div><form className="contact-form" onSubmit={submitEnquiry} noValidate><h3>Tell us your learning goal</h3><label>Full name<input value={enquiry.name} onChange={(event) => setEnquiry({ ...enquiry, name: event.target.value })} placeholder="Your name" /></label><label>Email address<input type="email" value={enquiry.email} onChange={(event) => setEnquiry({ ...enquiry, email: event.target.value })} placeholder="you@example.com" /></label><label>What would you like to learn?<select value={enquiry.goal} onChange={(event) => setEnquiry({ ...enquiry, goal: event.target.value })}><option value="">Select a focus area</option>{courses.map((course) => <option key={course.id} value={course.title}>{course.title}</option>)}</select></label><label>Message <small>optional</small><textarea rows={4} maxLength={500} value={enquiry.message} onChange={(event) => setEnquiry({ ...enquiry, message: event.target.value })} placeholder="What are you hoping to achieve?" /></label><button className="button primary full" disabled={enquiryState === "sending"}>{enquiryState === "sending" ? "Sending…" : "Send enquiry →"}</button>{enquiryState === "success" && <p className="form-message success" role="status">Thanks — your enquiry was received successfully.</p>}{enquiryState === "error" && <p className="form-message error" role="alert">Please provide a name, valid email, and learning goal. If the message still cannot be sent, configure MongoDB in Vercel.</p>}</form></section>

      <footer><a className="brand" href="#overview"><span className="brand-symbol">JL</span><span>Joshi <b>LMS</b></span></a><p>Portfolio project · Next.js · TypeScript · MongoDB · Vercel</p><a href="#overview">Back to top ↑</a></footer>
    </main>
  );
}
