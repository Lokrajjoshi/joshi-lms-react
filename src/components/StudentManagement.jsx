import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "./Icon";

const STORAGE_KEY = "joshi-lms-students";
const today = new Date().toISOString().split("T")[0];

const emptyForm = {
  fullName: "",
  studentId: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  course: "",
  semester: "",
  skills: [],
  address: "",
  profileImage: "",
  terms: false,
};

const skillOptions = ["HTML", "CSS", "JavaScript", "React"];
const genderOptions = ["Female", "Male", "Other"];
const semesterOptions = Array.from({ length: 8 }, (_, index) => `${index + 1}`);
const fallbackCourses = ["Frontend Development", "React Basics", "API Integration"];

const inputClass =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const inputFields = [
  ["fullName", "Full name", "text", "e.g. Namraj Joshi"],
  ["studentId", "Student ID", "text", "e.g. STU-101"],
  ["email", "Email", "email", "student@example.com"],
  ["phone", "Phone number", "tel", "10 digit number"],
  ["password", "Password", "password", "Minimum 6 characters"],
  ["confirmPassword", "Confirm password", "password", "Repeat password"],
  ["dateOfBirth", "Date of birth", "date", ""],
];

function FormField({ field, value, error, onChange }) {
  const [name, label, type, placeholder] = field;
  return (
    <div className="mb-5">
      <label className={labelClass} htmlFor={`student-${name}`}>{label} *</label>
      <input
        className={inputClass}
        id={`student-${name}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        max={type === "date" ? today : undefined}
        onInput={onChange}
      />
      {error && <p className="field-error mt-2">{error}</p>}
    </div>
  );
}

const getLocalStudents = () => {
  try {
    const savedStudents = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedStudents) ? savedStudents : [];
  } catch {
    return [];
  }
};

const validateStudent = (values, students, editingId) => {
  const errors = {};
  const studentId = values.studentId.trim().toLowerCase();
  if (!/^[A-Za-z][A-Za-z .'-]{1,}$/.test(values.fullName.trim())) errors.fullName = "Enter a valid full name.";
  if (!studentId) errors.studentId = "Student ID is required.";
  else if (students.some((student) => student.id !== editingId && student.studentId.toLowerCase() === studentId)) {
    errors.studentId = "Student ID already exists.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (values.password.length < 6) errors.password = "Password must contain at least 6 characters.";
  if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match.";
  if (values.phone.replace(/\D/g, "").length !== 10) errors.phone = "Phone number must contain 10 digits.";
  if (!values.dateOfBirth) errors.dateOfBirth = "Select a date of birth.";
  else if (values.dateOfBirth > today) errors.dateOfBirth = "Date of birth cannot be in the future.";
  if (!values.gender) errors.gender = "Select a gender.";
  if (!values.course) errors.course = "Select a course.";
  if (!values.semester) errors.semester = "Select a semester.";
  if (!values.address.trim()) errors.address = "Address is required.";
  if (!values.terms) errors.terms = "Accept the terms and conditions.";
  return errors;
};

function StudentManagement({ courses }) {
  const [mode, setMode] = useState("local");
  const [students, setStudents] = useState(getLocalStudents);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isApi = mode === "api";

  const courseOptions = courses.length
    ? courses.map((course) => course.title)
    : fallbackCourses;
  const selectFields = [
    ["course", "Course", "Select course", courseOptions],
    ["semester", "Semester", "Select semester", semesterOptions],
  ];

  useEffect(() => {
    if (!isApi) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      } catch {
        console.warn("Browser storage is full. Remove a record or use a smaller photo.");
      }
    }
  }, [students, isApi]);

  const resetForm = () => {
    setFormData(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const loadApiStudents = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.get("/api/students");
      setStudents(response.data);
    } catch {
      setStudents([]);
      setMessage("Start the Express server to use API and database CRUD.");
    } finally {
      setLoading(false);
    }
  };

  const changeMode = async (nextMode) => {
    setMode(nextMode);
    resetForm();
    setMessage("");
    if (nextMode === "local") {
      setStudents(getLocalStudents());
    } else {
      await loadApiStudents();
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let nextValue = value;

    if (name === "skills") {
      nextValue = checked
        ? [...formData.skills, value]
        : formData.skills.filter((skill) => skill !== value);
    } else if (type === "checkbox") {
      nextValue = checked;
    }

    setFormData((current) => ({ ...current, [name]: nextValue }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handlePhoto = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors((current) => ({ ...current, profileImage: "Choose a JPG or PNG image." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((current) => ({ ...current, profileImage: "Choose an image smaller than 2 MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, profileImage: reader.result }));
      setErrors((current) => ({ ...current, profileImage: "" }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData((current) => ({ ...current, profileImage: "" }));
    setErrors((current) => ({ ...current, profileImage: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateStudent(formData, students, editingId);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      setMessage("Please correct the highlighted fields.");
      return;
    }

    const existingStudent = students.find((student) => student.id === editingId);
    const student = {
      id: editingId || crypto.randomUUID(),
      fullName: formData.fullName.trim(),
      studentId: formData.studentId.trim(),
      email: formData.email.trim(),
      phone: formData.phone.replace(/\D/g, ""),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      course: formData.course,
      semester: formData.semester,
      skills: formData.skills,
      address: formData.address.trim(),
      profileImage: formData.profileImage,
      createdAt: existingStudent?.createdAt || new Date().toISOString(),
    };

    try {
      if (isApi) {
        const response = editingId
          ? await axios.put(`/api/students/${editingId}`, student)
          : await axios.post("/api/students", student);

        setStudents((current) =>
          editingId
            ? current.map((item) => (item.id === editingId ? response.data : item))
            : [response.data, ...current],
        );
      } else {
        setStudents((current) =>
          editingId
            ? current.map((item) => (item.id === editingId ? student : item))
            : [student, ...current],
        );
      }

      setMessage(editingId ? "Student updated successfully." : "Student registered successfully.");
      resetForm();
      requestAnimationFrame(() => document.querySelector("#students")?.scrollIntoView({ behavior: "smooth" }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save the student.");
    }
  };

  const editStudent = (student) => {
    setEditingId(student.id);
    setFormData({
      ...emptyForm,
      ...student,
      password: "",
      confirmPassword: "",
      terms: true,
    });
    setErrors({});
    setMessage("Editing student. Enter a password to confirm the update.");
    document.querySelector("#register")?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteStudent = async (student) => {
    if (!window.confirm(`Delete ${student.fullName}?`)) return;
    try {
      if (isApi) await axios.delete(`/api/students/${student.id}`);
      setStudents((current) => current.filter((item) => item.id !== student.id));
      if (editingId === student.id) resetForm();
      setMessage("Student deleted successfully.");
    } catch {
      setMessage("Unable to delete the student.");
    }
  };

  return (
    <section className="section bg-white" id="register" aria-labelledby="registration-title">
      <div className="container">
        <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="eyebrow-row">
              <span className="eyebrow">Student registration</span>
              <span className="section-number">3</span>
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl" id="registration-title">
              Student registration and management
            </h2>
            <p className="max-w-2xl leading-7 text-slate-600">
              Register students, validate their details, and manage records using local objects or the Express API.
            </p>
          </div>

          <div className="inline-flex w-fit rounded-xl border border-slate-200 bg-slate-100 p-1" aria-label="CRUD storage mode">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${!isApi ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}
              type="button"
              onClick={() => changeMode("local")}
            >
              Local CRUD
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${isApi ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}
              type="button"
              onClick={() => changeMode("api")}
            >
              API + Database
            </button>
          </div>
        </div>

        <div className="grid min-w-0 gap-8 xl:grid-cols-[1.25fr_.75fr]">
          <form className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 md:p-8" onSubmit={handleSubmit} noValidate>
            <div className="mb-7 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{editingId ? "Update student" : "Create student profile"}</h3>
                <p className="mt-1 text-sm text-slate-500">Passwords are validated but never saved or displayed.</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{isApi ? "REST API" : "localStorage"}</span>
            </div>

            <div className="grid gap-x-5 md:grid-cols-2">
              {inputFields.map((field) => (
                <FormField key={field[0]} field={field} value={formData[field[0]]} error={errors[field[0]]} onChange={handleChange} />
              ))}

              <fieldset className="mb-5">
                <legend className={labelClass}>Gender *</legend>
                <div className="flex min-h-12 flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4">
                  {genderOptions.map((gender) => (
                    <label className="flex items-center gap-2 text-sm text-slate-700" key={gender}>
                      <input checked={formData.gender === gender} name="gender" onChange={handleChange} type="radio" value={gender} />
                      {gender}
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="field-error mt-2">{errors.gender}</p>}
              </fieldset>

              {selectFields.map(([name, label, placeholder, options]) => (
                <div className="mb-5" key={name}>
                  <label className={labelClass} htmlFor={`student-${name}`}>{label} *</label>
                  <select className={inputClass} id={`student-${name}`} name={name} value={formData[name]} onChange={handleChange}>
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>{name === "semester" ? `Semester ${option}` : option}</option>
                    ))}
                  </select>
                  {errors[name] && <p className="field-error mt-2">{errors[name]}</p>}
                </div>
              ))}

              <fieldset className="mb-5 md:col-span-2">
                <legend className={labelClass}>Skills or interests</legend>
                <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {skillOptions.map((skill) => (
                    <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm" key={skill}>
                      <input checked={formData.skills.includes(skill)} name="skills" onChange={handleChange} type="checkbox" value={skill} />
                      {skill}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mb-5 md:col-span-2">
                <label className={labelClass} htmlFor="address">Address *</label>
                <textarea className={`${inputClass} min-h-28 py-3`} id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your complete address" />
                {errors.address && <p className="field-error mt-2">{errors.address}</p>}
              </div>

              <div className="mb-5 md:col-span-2">
                <label className={labelClass} htmlFor="profileImage">Profile photo</label>
                <div className="grid gap-3">
                  <label
                    className="flex cursor-pointer flex-col gap-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 p-4 transition hover:border-indigo-400 hover:bg-indigo-50 sm:flex-row sm:items-center"
                    htmlFor="profileImage"
                  >
                    {formData.profileImage ? (
                      <img className="h-20 w-20 rounded-2xl object-cover" src={formData.profileImage} alt="Selected profile preview" />
                    ) : (
                      <span className="grid h-20 w-20 place-items-center rounded-2xl bg-indigo-100 text-indigo-600"><Icon name="user" size={30} /></span>
                    )}
                    <div>
                      <span className="inline-flex min-h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm">
                        {formData.profileImage ? "Change profile photo" : "Upload profile photo"}
                      </span>
                      <p className="mt-2 text-xs text-slate-500">Click anywhere in this box · JPG or PNG · Maximum 2 MB</p>
                    </div>
                    <input className="sr-only" key={formData.profileImage ? "selected" : "empty"} id="profileImage" type="file" accept="image/jpeg,image/png" onChange={handlePhoto} />
                  </label>
                  {formData.profileImage && (
                    <button className="w-fit text-sm font-bold text-red-600 hover:text-red-700" type="button" onClick={removePhoto}>
                      Remove selected photo
                    </button>
                  )}
                </div>
                {errors.profileImage && <p className="field-error mt-2">{errors.profileImage}</p>}
              </div>

              <div className="mb-6 md:col-span-2">
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input className="mt-1" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} />
                  I accept the Terms and Conditions. *
                </label>
                {errors.terms && <p className="field-error mt-2">{errors.terms}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="button button-primary button-large" type="submit">
                {editingId ? "Update Student" : "Register Student"}
                <Icon name="arrow-right" size={18} />
              </button>
              <button className="button button-secondary button-large" type="button" onClick={resetForm}>Reset</button>
              {editingId && <button className="button button-secondary button-large" type="button" onClick={resetForm}>Cancel Edit</button>}
            </div>
          </form>

          <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white xl:sticky xl:top-24">
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500"><Icon name="users" size={24} /></span>
            <h3 className="text-xl font-bold">What you can manage</h3>
            <div className="mt-6 grid gap-4 text-sm text-slate-300">
              <p><strong className="text-white">Registration:</strong> Complete student details, validate inputs and preview a profile photo.</p>
              <p><strong className="text-white">Student records:</strong> Create, view, update and delete records using local or database storage.</p>
              <p><strong className="text-white">Current mode:</strong> {isApi ? "Express API + MongoDB" : "Browser array + localStorage"}</p>
            </div>
          </aside>
        </div>

        <div className="mt-16 scroll-mt-24" id="students">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow-row">
                <span className="eyebrow">Student records &amp; CRUD</span>
                <span className="section-number">4</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Registered students</h2>
            </div>
            <p className="text-sm font-semibold text-slate-500">{students.length} {students.length === 1 ? "record" : "records"} · {isApi ? "REST API" : "Local storage"}</p>
          </div>

          {message && (
            <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold ${message.includes("successfully") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-800"}`} role="status">
              {message}
            </div>
          )}

          {loading ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">Loading student records...</p>
          ) : students.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-600"><Icon name="users" size={27} /></span>
              <h3 className="text-lg font-bold text-slate-900">No students registered yet</h3>
              <p className="mt-2 text-sm text-slate-500">Complete the form above to create the first student record.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {students.map((student) => (
                <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50" key={student.id}>
                  <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-500" />
                  <div className="px-5 pb-5">
                    {student.profileImage ? (
                      <img className="-mt-10 h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md" src={student.profileImage} alt={`${student.fullName} profile`} />
                    ) : (
                      <span className="-mt-10 grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-indigo-100 text-xl font-bold text-indigo-700 shadow-md">
                        {student.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
                      </span>
                    )}
                    <h3 className="mt-4 text-xl font-bold text-slate-900">{student.fullName}</h3>
                    <p className="mt-1 text-sm text-slate-500">{student.studentId} · {student.email}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{student.course}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Semester {student.semester}</span>
                    </div>
                    <dl className="mt-5 grid gap-2 text-sm text-slate-600">
                      <div><dt className="inline font-semibold text-slate-800">Phone: </dt><dd className="inline">{student.phone}</dd></div>
                      <div><dt className="inline font-semibold text-slate-800">Gender: </dt><dd className="inline">{student.gender}</dd></div>
                      <div><dt className="inline font-semibold text-slate-800">Skills: </dt><dd className="inline">{student.skills.length ? student.skills.join(", ") : "Not specified"}</dd></div>
                      <div><dt className="inline font-semibold text-slate-800">Address: </dt><dd className="inline">{student.address}</dd></div>
                    </dl>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                      <button className="button button-secondary" type="button" onClick={() => editStudent(student)}>Edit</button>
                      <button className="button min-h-11 border border-red-200 bg-red-50 font-bold text-red-700 hover:bg-red-100" type="button" onClick={() => deleteStudent(student)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StudentManagement;
