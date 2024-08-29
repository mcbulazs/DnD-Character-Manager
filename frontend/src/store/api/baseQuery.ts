import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { type BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiError } from "../../types/apiError";
import backendUrl from "../../env";

// The type of the baseQuery function returned by fetchBaseQuery
const baseUrl = (() => {
	return backendUrl();
})();
// Define the base query with error handling

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
	args,
	api,
	extraOptions,
) => {
	try {
		const result = await fetchBaseQuery({
			baseUrl,
			credentials: "include",
		})(args, api, extraOptions);
		if (result.error) {
			const error = result.error as FetchBaseQueryError;

			const mappedError: ApiError = {
				status: typeof error.status === "number" ? error.status : 500, // Default to 500 if status is not a number
				message:
					error.data && typeof error.data === "object" && "error" in error.data
						? (error.data as { error: string }).error
						: "An unexpected error occurred", // Provide a default message
			};
			return { error: mappedError };
		}

		return result;
	} catch (error) {
		const mappedError: ApiError = {
			status: 500,
			message: "An unexpected error occurred",
		};
		return { error: mappedError };
	}
};

export default baseQuery;
