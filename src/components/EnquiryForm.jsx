import { useState } from "react";

function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (formData.name === "" || formData.email === "" || formData.course === "") {
      setSuccessMessage("Please fill all required fields.");
      return;
    }

    setSuccessMessage(
      `Thank you ${formData.name}, your enquiry for ${formData.course} has been submitted.`
    );

    setFormData({
      name: "",
      email: "",
      course: "",
      message: "",
    });
  }

  return (
    <section id="enquiry" className="mx-auto mt-10 max-w-6xl px-6 pb-10">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Student Course Enquiry</h2>
        <p className="mt-1 text-sm text-slate-500">
          Fill this form to show React form handling using useState.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select Interested Course</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="React Basics">React Basics</option>
            <option value="API Integration">API Integration</option>
            <option value="JavaScript Forms">JavaScript Forms</option>
            <option value="UI Design with Tailwind">UI Design with Tailwind</option>
            <option value="Learning Dashboard Basics">Learning Dashboard Basics</option>            
          </select>

          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 md:col-span-2"
          ></textarea>

          <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
            Submit Enquiry
          </button>
        </form>

        {successMessage && (
          <p className="mt-4 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
            {successMessage}
          </p>
        )}
      </div>
    </section>
  );
}

export default EnquiryForm;