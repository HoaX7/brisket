import axios, { AxiosRequestConfig, AxiosRequestHeaders, isAxiosError, Method } from "axios";
import { ApiError } from "../constants/errors";

/**
 * Requester allows you to make API requests to other services.
 * @template T - Type of request data
 * @template R - Type of response data
 * @param {Object} options - Request options
 * @param {Method} [options.method="GET"] - HTTP method
 * @param {string} options.url - Endpoint URL
 * @param {AxiosRequestHeaders} [options.headers] - Custom headers
 * @param {T} [options.data] - Request data
 * @param {boolean} [options.isRawResponse=false] - Flag for raw response
 * @param {boolean} [options.isFile=false] - Flag for file response
 * @param {string} [options.baseURL] - Custom base URL
 * @returns {Promise<R>} - Response data
 */
const requester = async function <T, R>({
	method,
	url,
	headers,
	data,
	isRawResponse,
	baseURL
}: {
    method?: Method;
    url?: string;
    headers?: AxiosRequestHeaders;
    data?: T;
    isRawResponse?: boolean;
    baseURL?: string;
}): Promise<R> {
	const config: AxiosRequestConfig = {
		// Modify `baseURL` to the host of your backend
		// service.
		// Example: baseUrl: http://localhost:5001/api
		//
		baseURL,
		responseType: "json",
		withCredentials: true,
		headers: {
			"Content-Type": "application/json", 
			"Accept": "application/json",
			...(headers || {})
		},
	};

	const requesterInstance = axios.create(config);
	const request: AxiosRequestConfig = {
		method: method || "GET",
		withCredentials: true,
		url,
		...(method === "GET" ? { params: data } : { data })
	};
	return requesterInstance(request)
		.then((res) => isRawResponse === true ? res : res.data)
		.catch((err) => {
			if (isAxiosError(err)) {
				throw new ApiError(err.message, {
					status: err.status,
					data: err.response?.data,
					url: err.config?.url,
					method: err.config?.method
				});
			}
			throw err;
		});
};

export default requester;