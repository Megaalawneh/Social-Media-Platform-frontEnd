"use client";
import { createContext, useEffect, useReducer, useState } from "react";
import CreateProfileReducer from "../Reducer/CreateProfileReducer";
export const CreateProfile = createContext(null);
const initialState = {
  users: [],
  posts: [],
  likes: [],
  comments: [],
  messages: [],
  Search:[],
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

  return (
    <CreateProfile.Provider
      value={{ state, dispatch, inputData, setInputData }}
    >
      {children}
    </CreateProfile.Provider>
  );
};
