import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [profile, setProfile] = useLocalStorage("profile", null);
  const navigate = useNavigate();

  const login = async (data) => {
    if (typeof data === "string") {
      setUser(data);
      setProfile(null);
    } else {
      setUser(data.token);
      setProfile({ username: data.username, email: data.email });
    }
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      login,
      logout,
    }),
    [user, profile]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
