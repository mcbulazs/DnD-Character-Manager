import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import LoginRequest from "../../types/loginRequest";


export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<void, { email: string; password: string }>({
      query: (registerData) => ({
        url: `register`,
        method: "POST",
        body: registerData,
      }),
    }),
    login: builder.mutation<void, LoginRequest>({
      query: (loginData) => ({
        url: `login`,
        method: "POST",
        body: loginData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `logout`,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = userApiSlice;
