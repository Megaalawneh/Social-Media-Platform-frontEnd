

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        await axios.get(`${API_BASE_URL}/isLoggedIn`, {
          withCredentials: true,
        });
         router.replace("/mainPage");
      } catch (error) {
        console.log(error);
      }
    }

    checkSession();
  }, [router]);
  

}