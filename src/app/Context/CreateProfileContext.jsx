"use client";
import { createContext, useEffect, useReducer } from "react";
import CreateProfileReducer from "../Reducer/CreateProfileReducer";
export const CreateProfile = createContext(null);
const initialState = {
  users: [],
  posts: [],
  messages: [],
  Search: [],
};
export const CreateProfileProvider = ({ children }) => {
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
    <CreateProfile.Provider value={{ state, dispatch }}>
      {children}
    </CreateProfile.Provider>
  );
};
