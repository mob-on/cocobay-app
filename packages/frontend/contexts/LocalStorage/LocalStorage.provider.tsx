"use client";

import { Config } from "@config/index";
import { ReactNode, useEffect, useState } from "react";

import {
  fields,
  LocalStorage,
  LocalStorageContext,
  StoredState,
} from "./LocalStorage.context";

interface LocalStorageProviderProps {
  children: ReactNode;
}

export const LocalStorageProvider = ({
  children,
}: LocalStorageProviderProps) => {
  const [storedState, setStoredState] = useState<StoredState>(
    {} as StoredState,
  );

  // Load fields from localStorage
  useEffect(() => {
    fields.forEach((field) => {
      const value = localStorage.getItem(LocalStorage[field]);
      if (value) {
        setStoredState((prevState) => ({
          ...prevState,
          [field]: JSON.parse(value),
        }));
      } else {
        setStoredState((prevState) => ({
          ...prevState,
          [field]: Config[LocalStorage[field]],
        }));
      }
    });
  }, []);

  // Save fields to localStorage
  useEffect(() => {
    fields.forEach((field) => {
      if (storedState[field])
        localStorage.setItem(
          LocalStorage[field],
          JSON.stringify(storedState[field]),
        );
    });
  }, [storedState]);

  return (
    <LocalStorageContext.Provider
      value={{
        storage: storedState,
        setStorage: setStoredState,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};
