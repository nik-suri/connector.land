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

    router.post('/pingroute', async ctx => {
      const { destination, numPing } = ctx.request.body;
      const stats = await this.runPing(destination, numPing);
      ctx.body = { route: destination, stats: stats };
    });

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

    const loss = packetError * 1.0 / count;

		const min = Math.min(...measurements);
		const avg = average(measurements);
		const max = Math.max(...measurements);

		const diffs = measurements.map((value) => value - avg);
		const squareDiffs = diffs.map((diff) => diff * diff);
		const avgSquareDiff = average(squareDiffs);
		const stdDev = Math.sqrt(avgSquareDiff);

    return { loss, min, avg, max, stdDev }
  }
}

module.exports = mainController
