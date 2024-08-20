import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// The type of the baseQuery function returned by fetchBaseQuery
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = fetchBaseQuery({
  baseUrl: "http://localhost:3000/",
  credentials: 'include',
});

export default baseQuery;