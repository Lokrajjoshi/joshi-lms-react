import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import connectDatabase from "./db.js";
import Student from "./models/Student.js";

const app = express();
const port = process.env.PORT || 5000;
let memoryStudents = [];

app.use(express.json({ limit: "4mb" }));

const databaseConnected = () => mongoose.connection.readyState === 1;

app.get("/api/students", async (_request, response) => {
  try {
    const students = databaseConnected()
      ? await Student.find().sort({ createdAt: -1 })
      : memoryStudents;
    response.json(students);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get("/api/students/:id", async (request, response) => {
  try {
    const student = databaseConnected()
      ? await Student.findOne({ id: request.params.id })
      : memoryStudents.find((item) => item.id === request.params.id);

    if (!student) return response.status(404).json({ message: "Student not found." });
    return response.json(student);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});

app.post("/api/students", async (request, response) => {
  try {
    if (databaseConnected()) {
      const student = await Student.create(request.body);
      return response.status(201).json(student);
    }

    if (memoryStudents.some((item) => item.studentId === request.body.studentId)) {
      return response.status(409).json({ message: "Student ID already exists." });
    }
    memoryStudents = [request.body, ...memoryStudents];
    return response.status(201).json(request.body);
  } catch (error) {
    const message = error.code === 11000 ? "Student ID already exists." : error.message;
    return response.status(400).json({ message });
  }
});

app.put("/api/students/:id", async (request, response) => {
  try {
    if (databaseConnected()) {
      const student = await Student.findOneAndUpdate(
        { id: request.params.id },
        request.body,
        { new: true, runValidators: true },
      );
      if (!student) return response.status(404).json({ message: "Student not found." });
      return response.json(student);
    }

    const index = memoryStudents.findIndex((item) => item.id === request.params.id);
    if (index === -1) return response.status(404).json({ message: "Student not found." });
    memoryStudents[index] = request.body;
    return response.json(request.body);
  } catch (error) {
    const message = error.code === 11000 ? "Student ID already exists." : error.message;
    return response.status(400).json({ message });
  }
});

app.delete("/api/students/:id", async (request, response) => {
  try {
    if (databaseConnected()) {
      const student = await Student.findOneAndDelete({ id: request.params.id });
      if (!student) return response.status(404).json({ message: "Student not found." });
    } else {
      const exists = memoryStudents.some((item) => item.id === request.params.id);
      if (!exists) return response.status(404).json({ message: "Student not found." });
      memoryStudents = memoryStudents.filter((item) => item.id !== request.params.id);
    }

    return response.json({ message: "Student deleted successfully." });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});

const startServer = async () => {
  await connectDatabase();
  app.listen(port, () => console.log(`Student API running at http://localhost:${port}`));
};

startServer();
