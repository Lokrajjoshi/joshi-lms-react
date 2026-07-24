function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">📘 Joshi LMS</h1>
          <p className="text-sm text-slate-500">Smart Course Explorer</p>
        </div>

        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#home" className="hover:text-blue-600">Home</a>
          <a href="#courses" className="hover:text-blue-600">Courses</a>
          <a href="#enquiry" className="hover:text-blue-600">Enquiry</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;