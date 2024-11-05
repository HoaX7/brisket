export interface SuccessResponse<T> {
	success: boolean;
	data: T;
	metadata: Record<string, unknown>;
}
export interface ErrorResponse {
	error: boolean;
	message: string;
	code?: string;
	status?: number;
}
