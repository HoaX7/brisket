import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
const responseDecorator = async function (fastify: FastifyInstance) {
	fastify.decorateReply("serverError", function (code, message) {
		return this.code(500).send({
			error: true,
			code: code,
			message: message || "Service unavailable"
		});
	});
};
export default fastifyPlugin(responseDecorator);