"use client";
import { createContext, useEffect, useReducer, useState } from "react";
import CreateProfileReducer from "../Reducer/CreateProfileReducer";
export const CreateProfile = createContext(null);
const initialState = {
  users: [],
  posts: [],
  messages: [],
  Search: [],
 
};
export const CreateProfileProvider = ({ children }) => {
  const [inputData, setInputData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userBirthDay: "",
    userBirthMonth: "",
    userBirthYear: "",
    userFullName: "",
    userProfilePic: "",
    userBio:"",
  });

  const getInitialTasks = () => {
    try {
      const storage = localStorage.getItem("AppState");
      if (!storage) {
        return initialState;
      }

      return JSON.parse(storage);
    } catch {
      return [];
    }
  };

  const [state, dispatch] = useReducer(
    CreateProfileReducer,
    initialState,
    getInitialTasks,
  );
  useEffect(() => {
    localStorage.setItem("AppState", JSON.stringify(state));
  }, [state]);
  const User = state.users?.[1] || {};
  return (
    <CreateProfile.Provider
      value={{ state, dispatch, inputData, setInputData,User }}
    >
      {children}
    </CreateProfile.Provider>
  );
};
