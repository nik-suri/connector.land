const IlpPacket = require('ilp-packet')
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
        const stats = await this.runPing(routes[destination], 4)
        result.push({ route: routes[destination], stats: stats })
        console.log('updated result: ', result)
      }
      ctx.body = result
    })

    router.get('/coil/register.html', async ctx => {
      ctx.set('content-type', 'text/html')
      ctx.body = fs.readFileStream(__dirname, '../public/coil/register.html')
    })
  }

  async runPing(destination, count) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    let packetError = 0;
    let measurements = [];

    for (let i = 0; i < count; i++) {
      const { parsedPacket, latency } = await this.ping.ping(destination);
      console.log(parsedPacket);

      if (parsedPacket.type === IlpPacket.Type.TYPE_ILP_FULFILL) {
        console.log(`ILP_FULFILL from ${destination}: time = ${latency}`);
        measurements.push(latency);
      } else {
        console.log('Error sending ping. code = ' + parsedPacket.data.code +
          ' message = ' + parsedPacket.data.message + ' triggeredBy = ' + parsedPacket.data.triggeredBy);
        packetError++;
      }

      await sleep(1000);
    }

    // packet stats
		const average = (data) => data.reduce((sum, value) => sum + value, 0) / data.length;

    const loss = packetError / count;

		const min = Math.min(...measurements);
		const avg = average(measurements);
		const max = Math.max(...measurements);

		const diffs = measurements.map((value) => value - avg);
		const squareDiffs = diffs.map((diff) => diff * diff);
		const avgSquareDiff = average(squareDiffs);
		const mdev = Math.sqrt(avgSquareDiff);

    return { loss, min, avg, max, mdev }
  }
}

module.exports = mainController
