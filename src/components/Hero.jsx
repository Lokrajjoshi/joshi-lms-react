import { useRef } from "react";
import Icon from "./Icon";

function Hero({ courseCount }) {
  const visualRef = useRef(null);

  function handlePointerMove(event) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const visual = visualRef.current;
    const rect = visual.getBoundingClientRect();
    const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
    const vertical = (event.clientY - rect.top) / rect.height - 0.5;
    visual.style.setProperty("--rotate-y", `${horizontal * 5}deg`);
    visual.style.setProperty("--rotate-x", `${vertical * -4}deg`);
    visual.style.setProperty("--light-x", `${50 + horizontal * 24}%`);
    visual.style.setProperty("--light-y", `${42 + vertical * 20}%`);
  }

  function resetVisual() {
    const visual = visualRef.current;
    visual.style.setProperty("--rotate-y", "0deg");
    visual.style.setProperty("--rotate-x", "0deg");
    visual.style.setProperty("--light-x", "50%");
    visual.style.setProperty("--light-y", "42%");
  }

  return (
    <section className="hero" id="home">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-label">
            <Icon name="sparkles" size={16} />
            Learn skills that move you forward
          </span>
          <h1>Build real skills.<br /><span>Shape what’s next.</span></h1>
          <p>
            Practical, guided courses that help you understand modern web
            development and turn knowledge into work you’re proud of.
          </p>
          <div className="hero-actions">
            <a className="button button-primary button-large" href="#courses">
              Browse all courses
              <Icon name="arrow-right" size={18} />
            </a>
            <a className="button button-secondary button-large" href="#enquiry">
              Talk to an advisor
            </a>
          </div>
          <div className="hero-proof" aria-label="Platform highlights">
            <span className="hero-proof-icon" aria-hidden="true">
              <Icon name="book" size={17} />
            </span>
            <p><strong>{courseCount} focused courses</strong><span>Clear, practical, beginner-friendly</span></p>
          </div>
        </div>

        <div
          className="hero-visual"
          ref={visualRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetVisual}
          aria-label="Interactive learning dashboard preview"
        >
          <span className="dashboard-ambient-glow" aria-hidden="true" />
          <div className="dashboard-card">
            <span className="dashboard-shine" aria-hidden="true" />
            <div className="dashboard-topbar">
              <span className="mini-brand"><Icon name="book" size={16} /></span>
              <span>Learning preview</span>
            </div>
            <div className="progress-panel">
              <div className="progress-icon"><Icon name="code" size={24} /></div>
              <div>
                <span className="mini-label">Continue learning</span>
                <strong>Frontend Development</strong>
              </div>
              <span className="progress-value">72%</span>
              <div className="progress-track"><span /></div>
              <div className="lesson-meta">
                <span>12 of 16 lessons</span>
                <span>Next: Responsive layouts</span>
              </div>
            </div>
            <div className="dashboard-row">
              <div className="mini-course indigo">
                <Icon name="layers" size={21} />
                <span>React Basics</span>
                <small>4 weeks</small>
              </div>
              <div className="mini-course cyan">
                <Icon name="palette" size={21} />
                <span>UI with Tailwind</span>
                <small>3 weeks</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
