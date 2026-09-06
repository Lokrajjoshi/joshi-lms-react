import { readFile } from "node:fs/promises";
import path from "node:path";
import LmsExperience, { type Course } from "@/components/LmsExperience";

async function getCourses(): Promise<Course[]> {
  const filePath = path.join(process.cwd(), "public", "courses.json");
  return JSON.parse(await readFile(filePath, "utf8")) as Course[];
}

export default async function HomePage() {
  const courses = await getCourses();
  return <LmsExperience courses={courses} />;
}
