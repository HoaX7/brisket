import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
const responseDecorator = async function (fastify: FastifyInstance) {
	fastify.decorateReply("forbidden", function (code, message) {
		return this.code(403).send({
			error: true,
			code: code || null,
			message: message || "Forbidden"
		});
	});
};
export default fastifyPlugin(responseDecorator);