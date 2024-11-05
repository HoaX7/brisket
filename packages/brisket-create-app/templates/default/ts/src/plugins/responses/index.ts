import fastifyPlugin from "fastify-plugin";
import unauthorized from "./unauthorized";
import success from "./success";
import notFound from "./notFound";
import serverError from "./serverError";
import forbidden from "./forbidden";
import error from "./error";
import badRequest from "./badRequest";
import created from "./created";
import { FastifyInstance } from "fastify";

const response = async function (fastify: FastifyInstance) {
	fastify.register(success);
	fastify.register(unauthorized);
	fastify.register(notFound);
	fastify.register(serverError);
	fastify.register(forbidden);
	fastify.register(error);
	fastify.register(badRequest);
	fastify.register(created);
};

export default fastifyPlugin(response);