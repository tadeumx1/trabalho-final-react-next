import { getAPIClient } from './axios';

export async function signInRequest({ email, password }) {
  const apiClient = getAPIClient();

  const requestBody = {
    email,
    password,
  };

  const { data } = await apiClient.post('/storeProducts/login', requestBody);

  return data;
}

export async function signUpRequest({ name, phone, email, password }) {
  const apiClient = getAPIClient();

  const requestBody = {
    name,
    phone,
    email,
    password
  };

  const { data } = await apiClient.put('/storeProducts/signup', requestBody);

  return data;
}
