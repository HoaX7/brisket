export class ApiError extends Error {
	status;
	data;
	url;
	method;
	constructor(message, { status, data, url, method }) {
		super(message);
		this.status = status;
		this.data = data;
		this.url = url;
		this.method = method;
	}
}
