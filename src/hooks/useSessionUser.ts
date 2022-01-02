import { useState, useEffect } from "react";

const KEY = "SESSION_USER"

function getStorageValue() {
  return localStorage.getItem(KEY) || "";
}

export const useSessionUser = () => {
  const [user, setUser] = useState(() => {
    return getStorageValue();
  });

  useEffect(() => {
    localStorage.setItem(KEY, user);
  }, [user]);

  return [user, setUser] as const;
};