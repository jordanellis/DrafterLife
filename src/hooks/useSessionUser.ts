import { useState, useEffect } from "react";

const key = "SESSION_USER"

function getStorageValue() {
  return localStorage.getItem(key) || "";
}

export const useSessionUser = () => {
  const [user, setUser] = useState(() => {
    return getStorageValue();
  });

  useEffect(() => {
    localStorage.setItem(key, user);
  }, [user]);

  return [user, setUser] as const;
};