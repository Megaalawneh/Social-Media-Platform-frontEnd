import axios from "axios";
import { API_BASE_URL } from "./config";

export async function handleDeleteCommentApi(postId, commentId) {
  const res = await axios.delete(`${API_BASE_URL}/post/${postId}/${commentId}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function handleLikeCommentApi(postId, commentId) {
  const res = await axios.post(
    `${API_BASE_URL}/post/${postId}/${commentId}/like`,
    {},
    { withCredentials: true },
  );

  return res.data.updatedPost;
}

export async function handleAddCommentApi(postId, content) {
  const res = await axios.post(
    `${API_BASE_URL}/post/${postId}/comment`,
    { content },
    { withCredentials: true },
  );
  return res.data.updatedPost;
}

export async function handleDeletePostApi(postId) {
  await axios.delete(`${API_BASE_URL}/post/${postId}`, {
    withCredentials: true,
  });
}

export async function handleAddPostLikeApi(postId) {
  const res = await axios.post(
    `${API_BASE_URL}/post/${postId}/like`,
    {},
    { withCredentials: true },
  );
  return res.data.updatedPost;
}

export async function handleSharePostApi(formData) {
  await axios.post(`${API_BASE_URL}/post`, formData, {
    withCredentials: true,
  });
}
