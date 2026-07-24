import axios from "axios";

const API_URL = "https://raw.githubusercontent.com/Lokrajjoshi/joshi-lms-react/refs/heads/main/courses.json";

async function getCourses() {
  const response = await axios.get(API_URL);
  return response.data;
}

export default getCourses;