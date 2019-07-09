import express from 'express';
import { serverPort } from './config/server.config.json';
import indexRoutes from './lib/routes';
import applyMiddlewares from './lib/middlewares/express.middleware';
import sequelize from './lib/middlewares/db.middleware';
import fs from 'fs';
import http from 'http';
import https from 'https';

let app = express();

applyMiddlewares(app);
indexRoutes(app);

// gestion d'erreur
app.use((err, req, res, next) => {
    res.status(err.code || err.status || 500).json({ error: err.message });
});

const options = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/fullchain.pem')
};

https.createServer(options, app)
  .listen(serverPort, function () {
      console.log(`Example app listening on port ${serverPort}`);
  });

sequelize.sync();
