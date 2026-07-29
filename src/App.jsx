import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureHighlights from "./components/FeatureHighlights";
import CourseToolbar from "./components/CourseToolbar";
import CourseList from "./components/CourseList";
import CourseDialog from "./components/CourseDialog";
import EnquiryForm from "./components/EnquiryForm";
import Footer from "./components/Footer";
import getCourses from "./api";

function App() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [retryKey, setRetryKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enquiryCourse, setEnquiryCourse] = useState("");
  const dialogTriggerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourses() {
      setStatus("loading");
      try {
        const data = await getCourses(controller.signal);
        if (!Array.isArray(data)) throw new Error("Invalid course data");
        setCourses(data);
        setStatus("success");
      } catch (error) {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          setStatus("error");
        }
      }
    }

    loadCourses();
    return () => controller.abort();
  }, [retryKey]);

  const categories = useMemo(
    () => ["All", ...new Set(courses.map((course) => course.category))],
    [courses],
  );

  const levels = useMemo(
    () => ["All", ...new Set(courses.map((course) => course.level))],
    [courses],
  );

  const filteredCourses = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    const matches = courses.filter((course) => {
      const searchableText = [
        course.title,
        course.category,
        course.level,
        course.instructor,
        course.description,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!search || searchableText.includes(search)) &&
        (category === "All" || course.category === category) &&
        (level === "All" || course.level === level)
      );
    });

    return [...matches].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "duration") return Number.parseInt(a.duration) - Number.parseInt(b.duration);
      return Number(b.featured) - Number(a.featured) || a.id - b.id;
    });
  }, [courses, searchText, category, level, sortBy]);

  const hasActiveFilters =
    searchText.trim() !== "" || category !== "All" || level !== "All";

  function clearFilters() {
    setSearchText("");
    setCategory("All");
    setLevel("All");
  }

  function openCourseDetails(course, trigger) {
    dialogTriggerRef.current = trigger;
    setSelectedCourse(course);
  }

  function closeCourseDetails() {
    setSelectedCourse(null);
    requestAnimationFrame(() => dialogTriggerRef.current?.focus());
  }

  function enquireAbout(course) {
    setEnquiryCourse(course.title);
    setSelectedCourse(null);
    requestAnimationFrame(() => {
      document.querySelector("#enquiry")?.scrollIntoView({ behavior: "smooth" });
      dialogTriggerRef.current = null;
    });
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />

      <main id="main-content">
        <Hero courseCount={courses.length || 6} />
        <FeatureHighlights />

        <section className="course-section section" id="courses" aria-labelledby="courses-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Course library</span>
                <h2 id="courses-title">Find your next skill</h2>
                <p>Explore focused, practical courses designed to turn concepts into confidence.</p>
              </div>
              <a className="text-link desktop-only" href="#enquiry">
                Need guidance choosing?
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <CourseToolbar
              searchText={searchText}
              setSearchText={setSearchText}
              category={category}
              setCategory={setCategory}
              level={level}
              setLevel={setLevel}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              levels={levels}
              resultCount={filteredCourses.length}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
            />

            <CourseList
              courses={filteredCourses}
              status={status}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              retry={() => setRetryKey((key) => key + 1)}
              onViewDetails={openCourseDetails}
            />
          </div>
        </section>

        <EnquiryForm
          key={enquiryCourse || "general-enquiry"}
          courses={courses}
          initialCourse={enquiryCourse}
        />
      </main>

      <Footer />
      <CourseDialog
        course={selectedCourse}
        onClose={closeCourseDetails}
        onEnquire={enquireAbout}
      />
    </div>
  );
}

export default App;
