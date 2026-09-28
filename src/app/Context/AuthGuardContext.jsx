"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

export const AuthGuardContext = createContext({
  currentUser: null,
  refreshUser: async () => {},
  setCurrentUser: () => {},
  refreshPosts: async () => {},
  posts: [],
});

export const AuthGuardProvider = ({ children }) => {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);

  async function refreshUser() {
    try {
      const res = await axios.get(`${API_BASE_URL}/isLoggedIn`, {
        withCredentials: true,
      });

      setCurrentUser(res.data.user);
      return res.data.user;
    } catch (error) {
      setCurrentUser(null);
      throw error;
    }
  }

  async function refreshPosts() {
    try {
      const res = await axios.get(`${API_BASE_URL}/post`, {
        withCredentials: true,
      });

      console.log(res)
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function checkSession() {
      try {
        await refreshUser();
      } catch (error) {
        router.replace("/");
        console.log(error);
      }
    }

    checkSession();
  }, [router]);

 useEffect(() => {
    async function checkPost() {
      try {
        await refreshPosts();
      } catch (error) {
        console.log(error);
      }
    }

    checkPost();
  }, []);

  return (
    <AuthGuardContext.Provider
      value={{
        currentUser,
        refreshUser,
        setCurrentUser,
        refreshPosts,
        posts,
        setPosts,
      }}
    >
      {children}
    </AuthGuardContext.Provider>
  );
};