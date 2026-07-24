import CourseCard from "./CourseCard";

function CourseList({ courses }) {
  return (
    <section id="courses" className="mx-auto mt-8 max-w-6xl px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Available Courses</h2>
        <p className="text-sm text-slate-500">{courses.length} courses found</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

export default CourseList;