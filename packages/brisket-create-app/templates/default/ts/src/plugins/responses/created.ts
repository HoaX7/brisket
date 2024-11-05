import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

const responseDecorator = async function (fastify: FastifyInstance) {
	fastify.decorateReply("created", function (data) {
		if (!data) {
			return this.code(201).send();
		}
		return this.code(201).send({
			success: true,
			data
		});
	});
};

export default fastifyPlugin(responseDecorator);