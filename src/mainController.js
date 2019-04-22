const ConnectorRoutes = require('./lib/routeGetter')
const Ping = require('./lib/ping')

class mainController {
  constructor (deps) {
    this.ping = deps(Ping)
  }

  async init (router) {
    console.log('initializing ping')
    await this.ping.init()
    console.log('ping initialized')

    router.get('/', async ctx => {
      await ctx.render('../public/index')
    })

    router.get('/routing', async ctx => {
      const { localRoutingTable } = await ConnectorRoutes.getRoutingTable()
      let routes = []
      for (let route in localRoutingTable) {
        routes = [...routes, route]
      }

      ctx.body = routes
    })

    router.get('/stats', async ctx => {
      ctx.body = stats
    })

    router.post('/pingroutes', async ctx => {
      let { routes } = ctx.request.body
      let result = []
      for (let destination in routes) {
        try {
          await this.ping.ping(routes[destination])
          result.push({route: routes[destination], live: 'Yes'})
          console.log('updated result: ', result)
        } catch (err) {
          result.push({route: routes[destination], live: 'No', error: err})
          console.log('updated result: ', result)
        }
      }

      ctx.body = result
    })

    router.get('/coil/register.html', async ctx => {
      ctx.set('content-type', 'text/html')
      ctx.body = fs.readFileStream(__dirname, '../public/coil/register.html')
    })
  }
}

module.exports = mainController
