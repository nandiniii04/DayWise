import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('daywise_session');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('daywise_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const session = { email: found.email, name: found.name };
    localStorage.setItem('daywise_session', JSON.stringify(session));
    setUser(session);
    return session;
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('daywise_users') || '[]');
    if (users.find(u => u.email === email)) throw new Error('Email already registered');
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('daywise_users', JSON.stringify(users));
    const session = { email, name };
    localStorage.setItem('daywise_session', JSON.stringify(session));
    setUser(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem('daywise_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);