import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CourseList from "./components/CourseList";
import EnquiryForm from "./components/EnquiryForm";
import getCourses from "./api";

function App() {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch {
        setError("Unable to load courses. Please check API link.");
      }
    }

    loadCourses();
  }, []);

 const filteredCourses = courses.filter((course) => {
  const search = searchText.toLowerCase();

  return (
    course.title.toLowerCase().includes(search) ||
    course.category.toLowerCase().includes(search) ||
    course.level.toLowerCase().includes(search) ||
    course.instructor.toLowerCase().includes(search)
  );
});

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main id="home">
        <section className="mx-auto max-w-6xl px-6 pt-10">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">
            <p className="text-sm font-medium text-blue-100">React Lab 5 & 6</p>
            <h1 className="mt-2 text-4xl font-bold">Joshi LMS Smart Course Explorer</h1>
            <p className="mt-3 max-w-2xl text-blue-100">
              Explore courses, search by category, and submit a student enquiry using React, Axios, Hooks, Forms, Vite and Tailwind CSS.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-6 grid max-w-6xl gap-4 px-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Data Source</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">GitHub JSON API</h3>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Hooks Used</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">useState + useEffect</h3>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Main Feature</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Course Enquiry Form</h3>
          </div>
        </section>

        <SearchBar searchText={searchText} setSearchText={setSearchText} />

        {error && (
          <p className="mx-auto mt-6 max-w-6xl rounded-xl bg-red-50 px-6 py-4 text-red-600">
            {error}
          </p>
        )}

        <CourseList courses={filteredCourses} />
        <EnquiryForm />
      </main>
    </div>
  );
}

export default App;