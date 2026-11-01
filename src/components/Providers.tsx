"use client";

import React from "react";
import { GamerAuthProvider } from "../context/GamerAuthContext";
import GamerAuthModal from "./GamerAuthModal";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GamerAuthProvider>
      {children}
      <GamerAuthModal />
    </GamerAuthProvider>
  );
};

export default Providers;

