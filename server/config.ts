/**
 * This is the server config, gets executed at runtime to set env defaults
 */
// import dotenv from "dotenv"

// Load .env config
// dotenv.config({ path: "./.env" })

const defaults = {
	SERVER_HTTP_PORT: Number(process.env.SERVER_HTTP_PORT__S) || 9080,
	SERVER_HOSTNAME: process.env.SERVER_HOSTNAME__S || "localhost",
	DB_USER: process.env.DB_USER__S,
	DB_PASS: process.env.DB_PASS__S,
}

// Snippet from dotenv main.js file, will set keys in env that aren't already defined
Object.keys(defaults).forEach(function (key) {
	if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
		process.env[key] = defaults[key]
	}
})