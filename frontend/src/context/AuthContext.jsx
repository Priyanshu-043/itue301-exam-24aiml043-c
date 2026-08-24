import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    return {
      member: JSON.parse(localStorage.getItem('fitzone_member') || 'null'),
      token: localStorage.getItem('fitzone_token'),
      role: localStorage.getItem('fitzone_role') || 'Member'
    };
  } catch {
    return { member: null, token: null, role: null };
  }
}

export function AuthProvider({ children }) {
  const stored = readStoredAuth();
  const [member, setMember] = useState(stored.member);
  const [token, setToken] = useState(stored.token);
  const [role, setRole] = useState(stored.token ? stored.role : null);

  function login(authResponse) {
    setMember(authResponse.member);
    setToken(authResponse.token);
    setRole(authResponse.role || 'Member');
    localStorage.setItem('fitzone_member', JSON.stringify(authResponse.member));
    localStorage.setItem('fitzone_token', authResponse.token);
    localStorage.setItem('fitzone_role', authResponse.role || 'Member');
  }

  function logout() {
    setMember(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('fitzone_member');
    localStorage.removeItem('fitzone_token');
    localStorage.removeItem('fitzone_role');
  }

  const value = useMemo(
    () => ({ member, token, role, login, logout }),
    [member, token, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
