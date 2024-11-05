import { createNamespace } from "cls-hooked";

const LOGGER_CONTEXT = "logger_context";
/**
 * cls hooked uses call stack to map each context
 * to that call stack to maintain uniqueness.
 * So the interface set does not change with multiple
 * requests
 */
const ctx = createNamespace(LOGGER_CONTEXT);

export const getLoggerContext = () =>
	ctx.get(LOGGER_CONTEXT) || {};


export const setLoggerContext = (context: { requestId: string; }) =>
	ctx.set(LOGGER_CONTEXT, context);

export const initLoggerContext = (cb: () => void) => {
	return ctx.run(() => cb());
};

const loggerOpts = {
	redact: [ "req.headers.authorization" ],
	level: "info",
	timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
	serializers: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		req(req: any) {
			return {
				level: "info",
				method: req.method,
				url: req.url,
				remoteAddress: req.ip
			};
		}
	},
};

export default loggerOpts;