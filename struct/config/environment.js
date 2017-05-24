module.exports = {
	port: process.env.PORT || 10000,
	isProduction: process.env.NODE_ENV && process.env.NODE_ENV == 'production',
	numCPUs: process.env.CPU_COUNT || require('os').cpus().length
};