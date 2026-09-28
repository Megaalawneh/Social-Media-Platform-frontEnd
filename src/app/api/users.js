import axios from "axios";
import { API_BASE_URL } from "./config";

export async function checkUserNameApi(userId) {
  const res = await axios.get(`${API_BASE_URL}/user/${userId}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function searchUserNameApi(userId) {
  const res = await axios.get(
    `${API_BASE_URL}/user/search/${encodeURIComponent(userId)}`,
    {
    withCredentials: true,
    },
  );
  return res.data;
}
export async function removePendingHandleApi(
  pendingId,
  userFollower,
  userFollowing,
) {
  const response = await axios.delete(`${API_BASE_URL}/follow/pending/${pendingId}`, {
    data: { userFollower, userFollowing },
    withCredentials: true,
  });

  return response.data.user;
}
export async function handelRemoveFollowApi(userId) {
  const response = await axios.delete(`${API_BASE_URL}/follow/${userId}`, {
    withCredentials: true,
  });
  

  return response.data.follow;
}

export async function followUserHandleApi(userFollower, userFollowing) {
  const res = await axios.put(
    `${API_BASE_URL}/follow`,
    {
      userFollower,
      userFollowing,
    },
    {
      withCredentials: true,
    },
  );

  return res.data.user;
}

export async function getUserByIdApi(userId) {
  const res = await axios.get(`${API_BASE_URL}/user/id/${userId}`, {
    withCredentials: true,
  });

  return res.data;
}

export async function getFollowingUsersApi() {
  const res = await axios.get(`${API_BASE_URL}/follow/following`, {
    withCredentials: true,
  });
  return res.data;
}

export async function geocodeCityApi(city) {
  const response = await axios.get(
    `/api/weather/geocode?city=${encodeURIComponent(city)}`,
  );
  return response.data;
}

export async function CreateProfileHandleApi(inputData) {
  const res = await axios.post(
    `${API_BASE_URL}/user`,
    {
      userName: inputData.userName,
      userEmail: inputData.userEmail,
      userPassword: inputData.userPassword,
      userFullName: inputData.userFullName,
      userBirthDate: inputData.userBirthDate,
      userCity: inputData.userCity,
    },
    {
      withCredentials: true,
    },
  );

  return res.data;
}
