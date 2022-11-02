import React, { createContext, useState } from "react";

export const UserContext = createContext({});
export const UserProvider = (props) => {
  const [client, setclient] = useState({});

  return (
    <UserContext.Provider value={{ client, setclient }}>
      {props.children}
    </UserContext.Provider>
  );
};
