import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { type: String, required: true, match: /^\d{10}$/ },
    dateOfBirth: {
      type: String,
      required: true,
      validate: {
        validator: (value) => value <= new Date().toISOString().split("T")[0],
        message: "Date of birth cannot be in the future.",
      },
    },
    gender: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    skills: { type: [String], default: [] },
    address: { type: String, required: true, trim: true },
    profileImage: { type: String, default: "" },
    createdAt: { type: String, required: true },
  },
  { versionKey: false },
);

studentSchema.set("toJSON", {
  transform: (_document, value) => {
    delete value._id;
    return value;
  },
});

export default mongoose.model("Student", studentSchema);
