// EditedNameProvider.js
import React, { useState, createContext, useContext } from "react";

const EditedNameContext = createContext();

export const useEditedName = () => {
  return useContext(EditedNameContext);
};

export const EditedNameProvider = ({ children }) => {
  const [editedName, setEditedName] = useState("");

  const updateEditedName = (newName) => {
    setEditedName(newName);
  };

  return (
    <EditedNameContext.Provider value={{ editedName, updateEditedName }}>
      {children}
    </EditedNameContext.Provider>
  );
};
