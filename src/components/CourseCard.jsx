import { useState } from "react";

function CourseCard({ course }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {course.category}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600">
        <b>Instructor:</b> {course.instructor}
      </p>
      <p className="text-sm text-slate-600">
        <b>Duration:</b> {course.duration}
      </p>
      <p className="text-sm text-slate-600">
        <b>Level:</b> {course.level}
      </p>

      {showDetails && (
        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          This course helps students understand {course.category} concepts through simple practical examples.
        </p>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {showDetails ? "Hide Details" : "View Details"}
      </button>
    </div>
  );
}

export default CourseCard;