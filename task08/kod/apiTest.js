const supertest = require('supertest')

const db = require('./db')
const app = require('./app')

global.api = supertest(app.callback())


module.exports = {
	mochaHooks: {		
		afterAll: async function () {
			await db.destroy()
		}
	}
}