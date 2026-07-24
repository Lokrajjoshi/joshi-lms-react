import axios from "axios";

async function getCourses() {
  const response = await axios.get("/courses.json");
  return response.data;
}

export default getCourses;