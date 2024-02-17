import { fetchApi } from "../../api/api";
import { Activate, logIn, register } from "../../models/auth";

export const login = async (data: logIn): Promise<any> => {
  const response = await fetchApi("/login/", "POST", data);
  return response.data;
};

export const AccountVerification = async (data: Activate): Promise<any> => {
  const response = await fetchApi("/activate/", "POST", data);
  return response.data;
};

export const postRegister = async (data: register): Promise<any> => {
  const response = await fetchApi("/register/", "POST", data);
  return response.data;
};

export const logout = async (): Promise<any> => {
  const response = await fetchApi("/logout/", "POST");
  return response.data;
};
