import fastify from "fastify";
import fastifyCookie from "fastify-cookie";
import loggerOpts from "./src/logger/config";
import responses from "./src/plugins/responses";
import hooks from "./src/plugins/hooks";
import routes from "./src/routes";
import fastifyHelmet from "@fastify/helmet";
import cors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";

// order to register / load plugins
// 1. plugins (from the Fastify ecosystem)
// 2. your plugins (your custom plugins)
// 3. decorators
// 4. hooks and middlewares
// 5. your services

const app = fastify({
	logger: loggerOpts,
	disableRequestLogging: false 
});
app.register(fastifyCookie);
app.register(fastifyRateLimit, {
	max: 100, // 100 requests per minute
	timeWindow: "1 minute"
});

app.setErrorHandler(function (error, req, res) {
	if (error.statusCode === 429) {
		res.code(429);
		res.error({
			code: "Too Many Requests",
			message: "Rate limit exceeded, retry in 1 minute",
			status: 429
		});
		return;
	}
	res.send(error);
	return;
});

// helmet options here
// Read more: https://github.com/fastify/fastify-helmet
app.register(fastifyHelmet, {});
// put your options here
// Read more: https://github.com/fastify/fastify-cors
app.register(cors, {});
app.register(responses);
app.register(routes);
app.register(hooks);

export default app;
