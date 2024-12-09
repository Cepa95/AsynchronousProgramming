const db = require('../db')

async function getHealthInfo () {
	return {
		status: 200,
		version: process.env.npm_package_version,
		bazaSpojena: !!(await db.raw('SELECT 1+1'))?.[0]
	}
}

module.exports = {
	getHealthInfo,	
}