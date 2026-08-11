import { useCallback, useEffect, useState } from 'react';
import { login as apiLogin, fetchMe } from '../api/auth.js';
import { getToken, setToken } from '../api/client.js';
import { AuthContext } from './authContextInstance.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Initialize synchronously from whether a token exists, so the "no
  // token" case never needs a setState call inside the effect below -
  // only the async fetchMe() path (a genuine async result, not a
  // synchronous effect-body update) transitions status afterwards.
  const [status, setStatus] = useState(() => (getToken() ? 'loading' : 'unauthenticated'));

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return undefined;

    fetchMe()
      .then((res) => {
        setUser(res.user);
        setStatus('authenticated');
      })
      .catch(() => {
        setToken(null);
        setStatus('unauthenticated');
      });

    function onUnauthorized() {
      logout();
    }
    window.addEventListener('yesen:unauthorized', onUnauthorized);
    return () => window.removeEventListener('yesen:unauthorized', onUnauthorized);
  }, [logout]);

  const login = useCallback(async (username, password) => {
    const res = await apiLogin(username, password);
    setToken(res.token);
    setUser(res.user);
    setStatus('authenticated');
    return res.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout, setUser }}>{children}</AuthContext.Provider>
  );
}
