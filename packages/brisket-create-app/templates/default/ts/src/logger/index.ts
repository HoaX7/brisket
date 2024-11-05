import { ApiError } from "../constants/errors";
import { clone } from "../utils";
import { getLoggerContext } from "./config";
import winstonlogger from "./winston";

type T = (string | number | Record<string, unknown> | Error)[]
const prepareLogObject = (array: T[]) => {
	const objects = {};
	const arrays: T[] = [];
	const errors: unknown[] = [];
	array.map((item) => {
		if (item instanceof ApiError) {
			errors.push(item);
		}
		if (item instanceof Error) {
			errors.push({
				message: item.message,
				stack: item.stack || "No stack trace available",
			});
		} else if (Array.isArray(item)) {
			arrays.push(item);
		} else if (typeof item === "object") {
			const obj = clone(item);
			Object.assign(objects, obj);
		}
	});
	const message = array.filter((a) => typeof a === "string").join(", ");
	if (arrays.length > 0) {
		Object.assign(objects, { arrays });
	}
	if (errors.length > 0) {
		Object.assign(objects, { errors });
	}
	return {
		objects,
		message
	};
};
class Logger {
	name: string;
	constructor(name?: string) {
		this.name = name || "";
	}

	private logData(level: "info" | "warn" | "debug" | "error", ...args) {
		const { message, objects = {} } = prepareLogObject(args);
		Object.assign(objects, { labels: getLoggerContext() });
		winstonlogger.log(level, `${this.name ?? `[${this.name}] `}${message}`, objects);
	}

	info(...args) {
		this.logData("info", ...args);
	}

	warn(...args) {
		this.logData("warn", ...args);
	}

	error(...args) {
		this.logData("error", ...args);
	}

	debug(...args) {
		this.logData("debug", ...args);
	}
}

export default Logger;