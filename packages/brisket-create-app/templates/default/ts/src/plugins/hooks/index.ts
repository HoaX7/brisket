import fastifyPlugin from "fastify-plugin";
import { initLoggerContext, setLoggerContext } from "../../logger/config";
import { FastifyInstance } from "fastify";
import { shortid } from "../../utils";

// Add your hooks here
const hooks = async function (fastify: FastifyInstance) {
	fastify.addHook("preHandler", (req, res, next) => {
		initLoggerContext(() => {
			setLoggerContext({ requestId: shortid() });
			next();
		});
	});
};
export default fastifyPlugin(hooks);