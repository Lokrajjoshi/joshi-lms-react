import { useState } from "react";
import Icon from "./Icon";

const emptyForm = { name: "", email: "", course: "", message: "" };

function validateField(name, value) {
  if (name === "name" && value.trim().length < 2) return "Please enter your full name.";
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  if (name === "course" && !value) return "Choose a course you’re interested in.";
  if (name === "message" && value.length > 500) return "Keep your message under 500 characters.";
  return "";
}

function EnquiryForm({ courses, initialCourse }) {
  const [formData, setFormData] = useState(() => ({
    ...emptyForm,
    course: initialCourse || "",
  }));
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    if (statusMessage) setStatusMessage("");
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = Object.fromEntries(
      Object.entries(formData)
        .map(([name, value]) => [name, validateField(name, value)])
        .filter(([, error]) => error),
    );
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("Please review the highlighted fields.");
      requestAnimationFrame(() => form.querySelector("[aria-invalid='true']")?.focus());
      return;
    }

    setStatusMessage(
      `Form validated successfully, ${formData.name.split(" ")[0]}. In a production LMS, your ${formData.course} enquiry would now be sent to the learning team.`,
    );
    setFormData(emptyForm);
    setErrors({});
  }

  function fieldProps(name) {
    return {
      id: name,
      name,
      value: formData[name],
      onChange: handleChange,
      onBlur: handleBlur,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  const isSuccess = statusMessage.startsWith("Form validated");

  return (
    <section className="enquiry-section section" id="enquiry" aria-labelledby="enquiry-title">
      <div className="container enquiry-grid">
        <div className="enquiry-content">
          <span className="eyebrow eyebrow-light">Personal course guidance</span>
          <h2 id="enquiry-title">Not sure where to begin?</h2>
          <p>Tell us what you want to learn. We’ll help you identify the course that best fits your current experience and goals.</p>
          <ul className="enquiry-benefits">
            <li><span><Icon name="check" size={15} /></span>Clear, no-pressure guidance</li>
            <li><span><Icon name="check" size={15} /></span>Recommendations matched to your level</li>
            <li><span><Icon name="check" size={15} /></span>Clear guidance for choosing your next step</li>
          </ul>
          <div className="advisor-note">
            <span className="advisor-avatar">JL</span>
            <p><strong>We’re here to help</strong><small>Share your goal and we’ll point you in the right direction.</small></p>
          </div>
        </div>

        <div className="form-card">
          <div className="form-heading">
            <span><Icon name="mail" size={21} /></span>
            <div><h3>Prepare a course enquiry</h3><p>Fields marked with * are required.</p></div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Full name <span aria-hidden="true">*</span></label>
                <input type="text" autoComplete="name" placeholder="e.g. Namraj Joshi" {...fieldProps("name")} />
                {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
              </div>
              <div className="field">
                <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                <input type="email" autoComplete="email" placeholder="you@example.com" {...fieldProps("email")} />
                {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="course">Course of interest <span aria-hidden="true">*</span></label>
              <select {...fieldProps("course")}>
                <option value="">Select a course</option>
                {courses.map((course) => <option value={course.title} key={course.id}>{course.title}</option>)}
              </select>
              {errors.course && <p className="field-error" id="course-error">{errors.course}</p>}
            </div>

            <div className="field">
              <div className="label-row">
                <label htmlFor="message">What would you like to know?</label>
                <span>{formData.message.length}/500</span>
              </div>
              <textarea rows="4" maxLength="500" placeholder="Tell us about your goals, experience, or any questions…" {...fieldProps("message")} />
              {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
            </div>

            <button className="button button-primary button-large form-submit" type="submit">
              Check my enquiry <Icon name="arrow-right" size={18} />
            </button>
            <p className="privacy-note">Demo form — your details are validated locally and are not transmitted or stored.</p>

            {statusMessage && (
              <div className={`form-status ${isSuccess ? "is-success" : "is-error"}`} role={isSuccess ? "status" : "alert"}>
                <span><Icon name={isSuccess ? "check" : "message"} size={18} /></span>
                {statusMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default EnquiryForm;
