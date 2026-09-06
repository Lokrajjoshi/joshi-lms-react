import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "courses.json");
  const courses = JSON.parse(await readFile(filePath, "utf8"));
  return Response.json({ courses });
}
