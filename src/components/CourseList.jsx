import CourseCard from "./CourseCard";
import CourseGridSkeleton from "./CourseGridSkeleton";
import EmptyState from "./EmptyState";

function CourseList({
  courses,
  status,
  hasActiveFilters,
  clearFilters,
  retry,
  onViewDetails,
}) {
  if (status === "loading") return <CourseGridSkeleton />;

  if (status === "error") {
    return (
      <EmptyState
        icon="message"
        title="We couldn’t load the course library"
        text="The connection may have been interrupted. Try loading the courses again."
        actionLabel="Try again"
        onAction={retry}
      />
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No matching courses yet"
        text={
          hasActiveFilters
            ? "Try another keyword or clear your filters to see the complete library."
            : "New learning opportunities will appear here soon."
        }
        actionLabel={hasActiveFilters ? "Clear all filters" : undefined}
        onAction={hasActiveFilters ? clearFilters : undefined}
      />
    );
  }

  return (
    <div className="course-grid">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default CourseList;
