import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
const responseDecorator = async function (fastify: FastifyInstance) {
	fastify.decorateReply("unauthorized", function (message) {
		return this.code(401).send({
			error: true,
			message: message || "Unauthorized"
		});
	});
};
export default fastifyPlugin(responseDecorator);