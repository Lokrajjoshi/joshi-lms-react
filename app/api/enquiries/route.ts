import { connectDatabase } from "@/lib/db";
import Enquiry from "@/models/Enquiry";

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const goal = typeof input.goal === "string" ? input.goal.trim() : "";
    const message = typeof input.message === "string" ? input.message.trim() : "";
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || !goal || message.length > 500) {
      return Response.json({ message: "Please provide valid enquiry details." }, { status: 400 });
    }
    await connectDatabase();
    await Enquiry.create({ name, email, goal, message });
    return Response.json({ message: "Enquiry received." }, { status: 201 });
  } catch {
    return Response.json({ message: "The enquiry service is currently unavailable." }, { status: 503 });
  }
}
