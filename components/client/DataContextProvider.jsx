"use client";
import { createContext } from "react";

export const DataContext = createContext([]);

function DataContextProvider({ data, children }) {
  return (
    <DataContext.Provider value={data}>
        {children}
    </DataContext.Provider>
  );
}

export default DataContextProvider;
