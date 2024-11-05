import { createLogger, transports, format } from "winston";

/**
 * Tip: Configure your own cloud logger with winston.
 * 
 * Read more: https://cloud.google.com/nodejs/docs/reference/logging-winston/latest
 * Example:
 * ```
 * import { LoggingWinston } from "@google-cloud/logging-winston";
 * const cloudLogger = new LoggingWinston({
		projectId: GCP_PROJECT_ID,
		keyFilename: "keyfile.json",
		prefix: "<prefix>",
		resource: { type: "service_account" }
	});
 */

const winstonLogger = createLogger({
	format: format.combine(format.timestamp(), format.json()),
	transports: [
		new transports.Console()
		// cloudLogger
	]
});

export default winstonLogger;