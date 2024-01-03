import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import server from "./server.js";

dotenv.config({ path: "../.env" });

const start = async () => {
	try {
		const { url } = await startStandaloneServer(server, {
			listen: { port: parseInt(process.env.PORT || "4000") },
		});

		console.log(`🚀  Server ready at: ${url}`);
	} catch (error) {
		console.log(error);
	}
};

await start();
