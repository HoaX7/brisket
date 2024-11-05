import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
const responseDecorator = async function (fastify: FastifyInstance) {
	fastify.decorateReply("success", function (data, metadata = {}) {
		return this.code(200).send({
			success: true,
			data,
			metadata
		});
	});
};

export default fastifyPlugin(responseDecorator);