import axios from "axios";
import { API_BASE_URL } from "./config";

export async function getConversationsApi() {
  const response = await axios.get(`${API_BASE_URL}/messages/conversations`, {
    withCredentials: true,
  });
  return response.data;
}

export async function getConversationApi(userId) {
  const response = await axios.get(
    `${API_BASE_URL}/messages/${encodeURIComponent(userId)}`,
    { withCredentials: true },
  );
  return response.data;
}

export async function sendMessageApi(userId, text) {
  const response = await axios.post(
    `${API_BASE_URL}/messages/${encodeURIComponent(userId)}`,
    { text },
    { withCredentials: true },
  );
  return response.data;
}

export async function sharePostInMessagesApi(postId, recipientIds) {
  const response = await axios.post(
    `${API_BASE_URL}/messages/share/${encodeURIComponent(postId)}`,
    { recipientIds },
    { withCredentials: true },
  );
  return response.data;
}

export async function editMessageApi(messageId, text) {
  const response = await axios.patch(
    `${API_BASE_URL}/messages/${encodeURIComponent(messageId)}`,
    { text },
    { withCredentials: true },
  );
  return response.data;
}

export async function deleteMessageApi(messageId) {
  const response = await axios.delete(
    `${API_BASE_URL}/messages/${encodeURIComponent(messageId)}`,
    { withCredentials: true },
  );
  return response.data;
}
