// File: englishapp/src/function/UserContext.jsx
// Description: This file creates a context for managing user data in a React application.
// It provides a way to share the username state and its updater function across components.
// It will be used to store the username of the user after they log in and to provide it to other components that need access to the username.
// We will need to cover App(main) by this context provider so that all components in App can access the username.
import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}
