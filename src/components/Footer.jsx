import Icon from "./Icon";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="brand brand-light" href="#home" aria-label="Joshi LMS home">
            <span className="brand-mark"><Icon name="book" size={22} /></span>
            <span className="brand-copy"><strong>Joshi LMS</strong><span>Learn with direction</span></span>
          </a>
          <p>Practical learning for curious people ready to build modern digital skills.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Quick links</strong>
            <a href="#home">Home</a>
            <a href="#courses">Courses</a>
            <a href="#register">Student registration</a>
            <a href="#students">Student management</a>
            <a href="#enquiry">Course enquiry</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Joshi LMS. Built for better learning.</p>
        <a href="#home">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}

export default Footer;
