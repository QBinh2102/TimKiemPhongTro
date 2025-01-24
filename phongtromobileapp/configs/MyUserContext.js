import React, { createContext, useState } from "react";

// Tạo context để quản lý userLogin
export const MyUserContext = createContext();
export const MyDispatchContext = createContext();

export const MyUserProvider = ({ children }) => {
  // Khởi tạo state cho userLogin
  const [userLogin, setUserLogin] = useState({
    id: null,
    token: null,
    tuongTac: [],
    // Các thuộc tính khác của userLogin...
  });

  return (
    <MyUserContext.Provider value={userLogin}>
      <MyDispatchContext.Provider value={setUserLogin}>
        {children}
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};
