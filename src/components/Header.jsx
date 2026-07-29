import { useEffect, useState } from "react";
import Icon from "./Icon";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Courses", href: "#courses" },
  { label: "Enquiry", href: "#enquiry" },
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Joshi LMS home">
      <span className="brand-mark" aria-hidden="true">
        <Icon name="book" size={22} />
      </span>
      <span className="brand-copy">
        <strong>Joshi LMS</strong>
        <span>Learn with direction</span>
      </span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="button button-small button-primary desktop-cta" href="#courses">
            Explore courses
            <Icon name="arrow-right" size={16} />
          </a>
          <button
            className="icon-button menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={23} />
          </button>
        </div>
      </div>

      <div
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        id="mobile-navigation"
      >
        <nav className="container mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
              <Icon name="chevron-right" size={18} />
            </a>
          ))}
          <a className="button button-primary" href="#courses" onClick={closeMenu}>
            Explore courses
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
