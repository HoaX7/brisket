import fastifyPlugin from "fastify-plugin";
import home from "./home";
import { FastifyInstance } from "fastify";

const routes = async function(fastify: FastifyInstance) {
	// Register your routes along with prefix
	// Example: fastify.register(auth, { prefix: "/auth" })
	fastify.register(home);
};

export default fastifyPlugin(routes);