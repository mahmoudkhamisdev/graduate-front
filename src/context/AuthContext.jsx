import { createContext, useState, useEffect, useContext, useMemo } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { BaseUrlApi, ErrorMessage } from "../lib/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userToken = Cookie.get("token");

  const [credits, setCredits] = useState(0);
  const [token, setToken] = useState(userToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userToken) setToken(userToken);
  }, [userToken]);

  useEffect(() => {
    if (user) setCredits(user?.points || 0);
  }, [user]);

  const getProfile = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/auth/me`);
      setUser(data?.data?.user);
    } catch (error) {
      Cookie.remove("token");
      setUser(null);
      navigate("/");
      toast("Error", {
        description: ErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userToken) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, [userToken]);

  // Verify email token handling
  const isVerifyEmail = location.pathname === "/verify-email";
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (isVerifyEmail && token) {
      axios
        .post(`${BaseUrlApi}/auth/verify-email`, { token })
        .then((_) => {
          toast.success("You have successfully verified your email!");
          navigate("/", { replace: true });
        })
        .catch((error) => {
          Cookie.remove("token");
          setUser(null);
          navigate("/", { replace: true });
          toast("Error", {
            description: ErrorMessage(error),
          });
        });
    }
  }, [isVerifyEmail]);

  const isVerifyGoogle = location.pathname === "/google/success";
  useEffect(() => {
    const urlToken = new URLSearchParams(location.search).get("token");
    if (isVerifyGoogle && urlToken) {
      Cookie.set("token", urlToken, { expires: 365 });
      navigate("/dashboard", { replace: true });
    }
  }, [isVerifyGoogle]);

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    Cookie.remove("token");
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ user, getProfile, token, loading, logout, credits, setCredits }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
