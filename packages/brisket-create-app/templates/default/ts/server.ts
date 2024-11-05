import server from "./app";
import { HOST, PORT } from "./src/env";

server.listen({
	port: PORT as number,
	host: HOST
}, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	server.log.info(`Listening on ${address}`);
});
