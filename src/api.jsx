import axios from "axios";

const API_URL = "/courses.json";

async function getCourses(signal) {
  const response = await axios.get(API_URL, { signal });
  return response.data;
}

export default getCourses;
