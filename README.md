# ILP Monitor

To use:

```sh
git clone https://github.com/nik-suri/ilp-monitor.git
cd frontend
npm install
npm run build
cd ../backend
npm install
npm start
```

ILP Monitor requires a live connector from which to acquire routing data. This connector can either be local to the koa web server or have its Admin APIs port forwarded to the machine local to the running server.
