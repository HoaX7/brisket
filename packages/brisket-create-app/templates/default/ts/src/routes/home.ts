import { FastifyInstance } from "fastify";
import * as controller from "../controller/HomeController";

const route = async function(fastify: FastifyInstance) {
	fastify.get("/", controller.sayHello);
};

export default route;
