const Router = require('@koa/router')
const indexRepo = require('../repo/index')

const router = new Router()

router.get('/health', async function (ctx) {
	ctx.body = await indexRepo.getHealthInfo()
})

module.exports = router