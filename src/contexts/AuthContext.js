import { createContext, useEffect, useState } from 'react';
import { setCookie, parseCookies } from 'nookies';
import Router from 'next/router';

import { signInRequest, signUpRequest } from '../services/auth';
import { api } from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [userAuthentication, setUserAuthentication] = useState(false);
  const [username, setUsername] = useState('');

  const isAuthenticated = userAuthentication;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      setUserAuthentication(true);
    }
  }, []);

  async function signIn({ email, password }) {
    const { token, userId, name, message } = await signInRequest({
      email,
      password,
    });

    if (message === 'User Not Found') {
      throw Error('User Not Found');
    }

    if (message === 'Validation failed') {
      throw Error('Validation failed');
    }

    setCookie(undefined, 'next.token', token, {
      maxAge: 60 * 60 * 1, // 1 hour
    });

    setCookie(undefined, 'next.userId', userId, {
      maxAge: 60 * 60 * 1, // 1 hour
    });

    setUsername(name);
    setUserAuthentication(true);

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    Router.push('/products');
  }

  async function signUp({ name, phone, email, password }) {
    const { message } = await signUpRequest({
      name,
      phone,
      email,
      password,
    });

    if (message === 'Validation failed') {
      throw Error('Validation failed');
    }

    Router.push('/');
  }

  return (
    <AuthContext.Provider
      value={{ userAuthentication, isAuthenticated, username, signUp, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}
