import axios from "axios";
import Cookies from "js-cookie";

// Axios default configuration
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Interceptor to add CSRF token
axios.interceptors.request.use((config) => {
  const csrftoken = Cookies.get("csrftoken");
  if (csrftoken) {
    config.headers["X-CSRFToken"] = csrftoken;
  }
  return config;
});

export default axios;
