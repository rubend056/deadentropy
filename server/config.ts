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
	DB_NAME: process.env.DB_NAME__S,
	DB_HOSTNAME: process.env.DB_HOSTNAME__S,
	DB_PORT: process.env.DB_PORT__S,
	DB_URL: process.env.DB_URL__S,
}

// Snippet from dotenv main.js file, will set keys in env that aren't already defined
Object.keys(defaults).forEach(function (key) {
	if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
		process.env[key] = defaults[key]
	}
})