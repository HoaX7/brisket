import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

const responseDecorator = async function (fastify: FastifyInstance) {
	fastify.decorateReply("notFound", function (message) {
		return this.code(404).send({
			error: true,
			message: message || "Not found",
			status: 404
		});
	});
};
export default fastifyPlugin(responseDecorator);