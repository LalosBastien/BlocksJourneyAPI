import express from 'express';
import { serverPort } from './config/server.config.json';
import indexRoutes from './lib/routes';
import applyMiddlewares from './lib/middlewares/express.middleware';
import sequelize from './lib/middlewares/db.middleware';
import fs from 'fs';
import http from 'http';
import https from 'https';

const app = express();

applyMiddlewares(app);
indexRoutes(app);

// gestion d'erreur
app.use((err, req, res, next) => {
    res.status(err.code || err.status || 500).json({ error: err.message });
});

// if (process.env.TAGS === 'https') {
const options = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/fullchain.pem'),
};

https.createServer(options, app)
    .listen(serverPort, () => {
        console.log(`HTTPS on port ${serverPort}`);
    });
// } else {
//     http.createServer(app)
//     .listen(serverPort, function () {
//         console.log("HOST " + process.env.DATABASE_HOST)
//         console.log("PORT " + process.env.DATABASE_PORT)
//         console.log("USR " + process.env.DATABASE_USER)
//         console.log("PWD " + process.env.DATABASE_PASSWORD)

//         console.log(`HTTP on port ${serverPort}`);
//     });
// }

sequelize.sync().then(() => {
    console.log('DB connection sucessful.');
}, (err) => {
    console.log(err);
});
