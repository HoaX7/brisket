import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
const responseDecorator = async function (fastify: FastifyInstance) {
	fastify.decorateReply("error", function (error) {
		return this
			.code(error.status || 500)
			.type("application/json")
			.send({
				error: true,
				code: error.code,
				message: error.message,
				status: error.status || 500
			});
	});	
};
export default fastifyPlugin(responseDecorator);