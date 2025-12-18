"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ToolbarContextType {
  customToolbar: ReactNode | null;
  setCustomToolbar: (toolbar: ReactNode | null) => void;
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const ToolbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customToolbar, setCustomToolbar] = useState<ReactNode | null>(null);

  return (
    <ToolbarContext.Provider value={{ customToolbar, setCustomToolbar }}>
      {children}
    </ToolbarContext.Provider>
  );
};

export const useToolbar = () => {
  const context = useContext(ToolbarContext);
  if (context === undefined) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return context;
};

export { ToolbarContext };

