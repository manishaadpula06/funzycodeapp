// context/AuthContext.js

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authService from "../services/authService";
import {
  getApiErrorMessage,
  setAuthToken,
  setUnauthorizedHandler,
} from "../services/apiClient";
import { resetToLogin } from "../services/navigationService";

const TOKEN_KEY = "FUNZYCODE_AUTH_TOKEN";
const USER_KEY = "FUNZYCODE_AUTH_USER";

const AuthContext = createContext(null);

const normalizeAuthResponse = (data) => {
  const token = data?.token || data?.accessToken || data?.jwt || "";
  const user = data?.user || data?.profile || null;

  return { token, user };
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const saveSession = useCallback(async (nextToken, nextUser) => {
    setToken(nextToken || null);
    setUser(nextUser || null);
    setAuthToken(nextToken || null);

    if (nextToken) {
      await AsyncStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }

    if (nextUser) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(USER_KEY);
    }
  }, []);

  const clearSession = useCallback(async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }, []);

  const logout = useCallback(
    async (redirect = true) => {
      await clearSession();

      if (redirect) {
        resetToLogin();
      }
    },
    [clearSession]
  );

  const loadSession = useCallback(async () => {
    setInitializing(true);
    setAuthError("");

    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUserJson = await AsyncStorage.getItem(USER_KEY);
      const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;

      if (!storedToken) {
        await clearSession();
        return false;
      }

      setToken(storedToken);
      setUser(storedUser);
      setAuthToken(storedToken);

      try {
        const freshUser = await authService.me();
        const nextUser = freshUser?.user || freshUser || storedUser;
        await saveSession(storedToken, nextUser);
      } catch (error) {
        await clearSession();
        return false;
      }

      return true;
    } catch (error) {
      setAuthError("Unable to load login session.");
      await clearSession();
      return false;
    } finally {
      setInitializing(false);
    }
  }, [clearSession, saveSession]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout(true);
    });

    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      setAuthError("");

      try {
        const data = await authService.login({
          email: String(email || "").trim(),
          password: String(password || ""),
        });

        const session = normalizeAuthResponse(data);

        if (!session.token) {
          throw new Error("Login response did not contain a token.");
        }

        await saveSession(session.token, session.user);
        return { ok: true, user: session.user, token: session.token };
      } catch (error) {
        const message = getApiErrorMessage(error);
        setAuthError(message);
        return { ok: false, message };
      } finally {
        setLoading(false);
      }
    },
    [saveSession]
  );

  const register = useCallback(
    async ({ fullName, email, password }) => {
      setLoading(true);
      setAuthError("");

      try {
        const data = await authService.register({
          fullName: String(fullName || "").trim(),
          email: String(email || "").trim(),
          password: String(password || ""),
        });

        const session = normalizeAuthResponse(data);

        if (!session.token) {
          throw new Error("Register response did not contain a token.");
        }

        await saveSession(session.token, session.user);
        return { ok: true, user: session.user, token: session.token };
      } catch (error) {
        const message = getApiErrorMessage(error);
        setAuthError(message);
        return { ok: false, message };
      } finally {
        setLoading(false);
      }
    },
    [saveSession]
  );

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setAuthError("");

    try {
      await authService.forgotPassword(String(email || "").trim());
      return {
        ok: true,
        message: "If this email is registered, reset instructions will be sent.",
      };
    } catch (error) {
      const message = getApiErrorMessage(error);
      setAuthError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      loading,
      authError,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      loadSession,
      forgotPassword,
    }),
    [
      token,
      user,
      initializing,
      loading,
      authError,
      login,
      register,
      logout,
      loadSession,
      forgotPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
