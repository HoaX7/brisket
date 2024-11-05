import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

const responseDecorator = async function (fastify: FastifyInstance) {
	fastify.decorateReply("badRequest", function (message?: string) {
		return this.code(400).send({
			error: true,
			message: message || "Bad request"
		});
	});
};

export default fastifyPlugin(responseDecorator);