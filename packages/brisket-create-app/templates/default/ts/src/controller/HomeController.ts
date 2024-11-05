import { FastifyReply, FastifyRequest } from "fastify";
import Logger from "../logger";

const logger = new Logger(__filename);

export const sayHello = (req: FastifyRequest, res: FastifyReply) => {
	try {
		return res.success("hello world");
	} catch (err) {
		logger.error("sayHello Failed:", err);
	}
};