import { useEffect, useRef } from "react";
import Icon from "./Icon";

function CourseDialog({ course, onClose, onEnquire }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (course && !dialog.open) dialog.showModal();
    if (!course && dialog.open) dialog.close();

    function handleCancel(event) {
      event.preventDefault();
      onClose();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [course, onClose]);

  function handleBackdrop(event) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      className="course-dialog"
      ref={dialogRef}
      onClick={handleBackdrop}
      aria-labelledby={course ? "dialog-title" : undefined}
    >
      {course && (
        <div className="dialog-panel">
          <div className={`dialog-art course-art-${course.accent}`}>
            <span className="course-art-grid" aria-hidden="true" />
            <span className="dialog-icon"><Icon name={course.icon} size={38} /></span>
            <span className="art-code" aria-hidden="true">{course.artLabel}</span>
            <button className="dialog-close" type="button" onClick={onClose} aria-label="Close course details">
              <Icon name="close" size={20} />
            </button>
          </div>
          <div className="dialog-content">
            <div className="course-badges">
              <span>{course.category}</span>
              <span className="level-badge">{course.level}</span>
            </div>
            <h2 id="dialog-title">{course.title}</h2>
            <p className="dialog-description">{course.longDescription}</p>

            <div className="dialog-meta">
              <span><Icon name="user" size={18} /><small>Instructor</small><strong>{course.instructor}</strong></span>
              <span><Icon name="clock" size={18} /><small>Duration</small><strong>{course.duration}</strong></span>
            </div>

            <div className="outcomes">
              <h3>What you’ll learn</h3>
              <ul>
                {course.outcomes.map((outcome) => (
                  <li key={outcome}>
                    <span><Icon name="check" size={14} /></span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div className="dialog-actions">
              <button className="button button-primary button-large" type="button" onClick={() => onEnquire(course)}>
                Enquire about this course
                <Icon name="arrow-right" size={18} />
              </button>
              <button className="button button-secondary button-large" type="button" onClick={onClose}>
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default CourseDialog;
