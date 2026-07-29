import Icon from "./Icon";

function CourseCard({ course, onViewDetails }) {
  return (
    <article className="course-card">
      <div className={`course-art course-art-${course.accent}`}>
        <span className="course-art-grid" aria-hidden="true" />
        <span className="course-icon">
          <Icon name={course.icon} size={30} strokeWidth={1.6} />
        </span>
        {course.featured && <span className="featured-badge">Popular</span>}
        <span className="art-code" aria-hidden="true">{course.artLabel}</span>
      </div>

      <div className="course-card-body">
        <div className="course-badges">
          <span>{course.category}</span>
          <span className="level-badge">{course.level}</span>
        </div>
        <h3>{course.title}</h3>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          <span><Icon name="user" size={16} />{course.instructor}</span>
          <span><Icon name="clock" size={16} />{course.duration}</span>
        </div>

        <div className="course-card-actions">
          <button
            className="button button-dark"
            type="button"
            onClick={(event) => onViewDetails(course, event.currentTarget)}
          >
            View course
            <Icon name="arrow-up-right" size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
