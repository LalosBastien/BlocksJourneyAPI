import express from 'express';
import { serverPort } from './config/server.config.json';
import indexRoutes from './lib/routes';
import applyMiddlewares from './lib/middlewares/express.middleware';
import sequelize from './lib/middlewares/db.middleware';
import fs from 'fs';
import http from 'http';

console.log('DB_HOST ' + process.env.DATABASE_HOST)
console.log('DATABASE_PORT ' + process.env.DATABASE_PORT)
console.log('DATABASE_TYPE ' + process.env.DATABASE_TYPE)
console.log('DATABASE_USER ' + process.env.DATABASE_USER)
console.log('DATABASE_PASSWORD ' + process.env.DATABASE_PASSWORD)
console.log('DATABASE_SCHEMA ' + process.env.DATABASE_SCHEMA)

let app = express();

applyMiddlewares(app);
indexRoutes(app);

// gestion d'erreur
app.use((err, req, res, next) => {
    res.status(err.code || err.status || 500).json({ error: err.message });
});

//const options = {
//    key: fs.readFileSync('/sslcert/privkey1.pem'),
//    cert: fs.readFileSync('/sslcert/fullchain1.pem')
//};

http.createServer(app)
  .listen(serverPort, function () {
      console.log(`Example app listening on port ${serverPort}`);
  });

sequelize.sync();
