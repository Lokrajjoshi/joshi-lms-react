function CourseGridSkeleton() {
  return (
    <div className="course-grid" aria-label="Loading courses" aria-busy="true">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div className="course-card skeleton-card" key={item}>
          <div className="skeleton skeleton-art" />
          <div className="course-card-body">
            <div className="skeleton skeleton-line skeleton-short" />
            <div className="skeleton skeleton-line skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-medium" />
            <div className="skeleton skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseGridSkeleton;
