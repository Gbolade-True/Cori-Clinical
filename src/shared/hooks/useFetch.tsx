import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import axios from "axios";

interface FetchState<T> {
	data: T | null;
	error: Error | null;
	isPending: boolean;
}

interface FetchOptions {
	method?: "GET" | "POST" | "PUT" | "DELETE";
	headers?: Record<string, string>;
	skip?: boolean;
	params?: Record<string, string>;
}

interface Action<T> {
	type: "FETCH_INIT" | "FETCH_SUCCESS" | "FETCH_FAILURE";
	payload?: T | Error;
}

function fetchReducer<T>(
	state: FetchState<T>,
	action: Action<T>
): FetchState<T> {
	switch (action.type) {
		case "FETCH_INIT":
			return { ...state, isPending: true, error: null };
		case "FETCH_SUCCESS":
			return { ...state, isPending: false, data: action.payload as T };
		case "FETCH_FAILURE":
			return {
				...state,
				isPending: false,
				error: action.payload as Error,
			};
		default:
			throw new Error("Unhandled action type");
	}
}

function buildUrlWithParams(url: string, params: Record<string, string>) {
	const query = new URLSearchParams(params).toString();
	return query ? `${url}?${query}` : url;
}

export function useFetch<T>(url: string, options: FetchOptions = {}) {
	const { method = "GET", headers = {}, skip = false, params = {} } = options;

	const initialState: FetchState<T> = {
		data: null,
		error: null,
		isPending: false,
	};

	const [state, dispatch] = useReducer(fetchReducer<T>, initialState);
	const abortControllerRef = useRef<AbortController | null>(null);

	const serializedHeaders = JSON.stringify(headers);
	const serializedParams = JSON.stringify(params);

	const memoizedHeaders = useMemo(
		() => JSON.parse(serializedHeaders),
		[serializedHeaders]
	);
	const memoizedParams = useMemo(
		() => JSON.parse(serializedParams),
		[serializedParams]
	);

	const fetchData = useCallback(async (): Promise<T | undefined> => {
		if (skip || !url) return;

		abortControllerRef.current?.abort();
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		dispatch({ type: "FETCH_INIT" });

		try {
			const fullUrl = buildUrlWithParams(url, memoizedParams);
			const { data } = await axios(fullUrl, {
				method,
				headers: {
					"Content-Type": "application/json",
					...memoizedHeaders,
				},
				signal: abortController.signal,
			});

			dispatch({ type: "FETCH_SUCCESS", payload: data });
			return data;
		} catch (error) {
			if (!abortController.signal.aborted) {
				dispatch({ type: "FETCH_FAILURE", payload: error as Error });
			}
			throw error;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url, method, skip, memoizedHeaders, memoizedParams]);

	useEffect(() => {
		fetchData();
		return () => {
			abortControllerRef.current?.abort();
		};
	}, [fetchData]);

	return {
		...state,
		refetch: fetchData,
	};
}
