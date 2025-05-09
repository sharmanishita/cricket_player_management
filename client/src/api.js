import axios from "axios";
const API = "http://localhost:5000";
export default axios.create({ baseURL: API });
