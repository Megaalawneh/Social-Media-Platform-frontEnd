import axios from "axios";
import { API_BASE_URL } from "./config";

export async function logoutApi() {
  await axios.post(
    `${API_BASE_URL}/userLogout`,
    {},
    {
      withCredentials: true,
    },
  );
}

export async function loginApi(email, password) {
  
  const response = await axios.post(
    `${API_BASE_URL}/userLogin`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
}
