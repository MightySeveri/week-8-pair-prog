import { useState } from "react";

const useAuth = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authenticate = async (url, credentials) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (credentials) => authenticate("/api/users/login", credentials);
  const signup = (credentials) => authenticate("/api/users/signup", credentials);

  return { login, signup, isLoading, error };
};

export default useAuth;