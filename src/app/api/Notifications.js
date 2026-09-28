import axios from "axios";
import { API_BASE_URL } from "./config";
export async function handleConfirmNotificationApi( userFollower ) {

      await axios.put(
        `${API_BASE_URL}/Notifications/${userFollower}`,
        {},
        {
          withCredentials: true,
        },
      );

  
  }
  export async function handleDeleteNotificationApi( userFollower ) {

      await axios.delete(
        `${API_BASE_URL}/Notifications/${userFollower}`,
        {
          withCredentials: true,
        },
      );
  
  }